require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const eventEmitter = require('../events')

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const TABLE_MAP = {
  users: 'users', categories: 'categories', brands: 'brands',
  products: 'products', orders: 'orders', reviews: 'reviews',
  blog_posts: 'blog_posts', offers: 'offers', addresses: 'addresses',
  expenses: 'expenses', hero_slides: 'hero_slides',
  notifications: 'notifications', faq: 'faq',
  order_statuses: 'order_statuses', shipping_rates: 'shipping_rates',
  payment_gateways: 'payment_gateways',
  social_login_providers: 'social_login_providers',
}

function extractTable(sql) {
  const m = sql.match(/\b(?:FROM|INTO|UPDATE|TABLE)\s+[`"']?(\w+)[`"']?/i)
  return m ? m[1] : null
}

function cleanSql(sql) {
  return sql
    .replace(/`/g, '')
    .replace(/\bWHERE\s+1\s*=\s*1\b/i, 'WHERE')
    .replace(/\bAS\s+(\w+)\b/gi, (_, a) => `AS "${a}"`)
}

function extractHardcodedFilters(sql) {
  const filters = []

  const boolRe = /(\w+(?:\.\w+)?)\s*=\s*(TRUE|FALSE)/gi
  let m
  while ((m = boolRe.exec(sql)) !== null) {
    const col = m[1].includes('.') ? m[1].split('.')[1] : m[1]
    filters.push({ col, op: 'eq', val: m[2] === 'TRUE' })
  }

  const nullRe = /(\w+(?:\.\w+)?)\s+IS\s+(NOT\s+)?NULL/gi
  while ((m = nullRe.exec(sql)) !== null) {
    const col = m[1].includes('.') ? m[1].split('.')[1] : m[1]
    filters.push({ col, op: m[2] ? 'isnot' : 'is', val: null })
  }

  const nowRe = /(\w+(?:\.\w+)?)\s*(>|<|>=|<=)\s*NOW\(\)/gi
  while ((m = nowRe.exec(sql)) !== null) {
    const col = m[1].includes('.') ? m[1].split('.')[1] : m[1]
    filters.push({ col, op: m[2] === '>' ? 'gt' : m[2] === '<' ? 'lt' : m[2] === '>=' ? 'gte' : 'lte', val: new Date().toISOString() })
  }

  const colCompareRe = /(\w+)\s*(<|>)\s*(\w+)/gi
  while ((m = colCompareRe.exec(sql)) !== null) {
    filters.push({ col: m[1], op: 'lt', raw: true, rawCol: m[3] })
  }

  const hardLikeRe = /(\w+)\s+LIKE\s+'([^']+)'/gi
  while ((m = hardLikeRe.exec(sql)) !== null) {
    filters.push({ col: m[1], op: 'like', val: m[2] })
  }

  return filters
}

function extractParamFilters(sql, params) {
  const filters = []
  let paramIdx = 0
  const paramRe = /(\w+)\s*(=|!=|<>|>|<|>=|<=|LIKE|IN)\s*\?/gi
  let m
  while ((m = paramRe.exec(sql)) !== null) {
    const col = m[1].includes('.') ? m[1].split('.')[1] : m[1]
    const op = m[2].toUpperCase()
    const val = params ? params[paramIdx] : undefined
    if (op === 'LIKE') {
      filters.push({ col, op: 'ilike', val })
    } else if (op === 'IN') {
      filters.push({ col, op: 'in', val: Array.isArray(val) ? val : [val] })
    } else if (op === '!=' || op === '<>') {
      filters.push({ col, op: 'neq', val })
    } else {
      const opMap = { '=': 'eq', '>': 'gt', '<': 'lt', '>=': 'gte', '<=': 'lte' }
      filters.push({ col, op: opMap[op] || 'eq', val })
    }
    paramIdx++
  }
  return filters
}

function getOrder(sql) {
  const m = sql.match(/\bORDER\s+BY\s+(\w+(?:\.\w+)?)\s*(DESC|ASC)?/i)
  if (!m) return null
  const col = m[1].includes('.') ? m[1].split('.')[1] : m[1]
  return { col, dir: (m[2] || 'ASC').toUpperCase() === 'DESC' ? { ascending: false } : { ascending: true } }
}

function getLimitOffset(sql) {
  const limit = sql.match(/\bLIMIT\s+(\d+)/i)
  const offset = sql.match(/\bOFFSET\s+(\d+)/i)
  const l = limit ? parseInt(limit[1]) : null
  const o = offset ? parseInt(offset[1]) : null
  return { limit: l, offset: o }
}

function applyFilters(query, filters) {
  for (const f of filters) {
    if (f.raw) continue
    switch (f.op) {
      case 'eq': query = query.eq(f.col, f.val); break
      case 'neq': query = query.neq(f.col, f.val); break
      case 'gt': query = query.gt(f.col, f.val); break
      case 'lt': query = query.lt(f.col, f.val); break
      case 'gte': query = query.gte(f.col, f.val); break
      case 'lte': query = query.lte(f.col, f.val); break
      case 'ilike': query = query.ilike(f.col, f.val ? f.val.replace(/%/g, '') : ''); break
      case 'like': query = query.like(f.col, f.val ? f.val.replace(/%/g, '') : ''); break
      case 'in': query = query.in(f.col, f.val); break
      case 'is': query = query.is(f.col, null); break
      case 'isnot': query = query.not(f.col, 'is', null); break
    }
  }
  return query
}

async function handleSelect(sql, params) {
  const table = extractTable(sql)
  if (!table || !TABLE_MAP[table]) throw new Error(`Unknown table: ${table}`)

  const cleaned = cleanSql(sql)
  const paramFilters = extractParamFilters(cleaned, params)
  const hardFilters = extractHardcodedFilters(cleaned)
  const allFilters = [...paramFilters, ...hardFilters]
  const order = getOrder(cleaned)
  const { limit, offset } = getLimitOffset(cleaned)

  const isJoin = /\b(LEFT|RIGHT|INNER|JOIN)\b/i.test(cleaned)

  const aggMatch = cleaned.match(/(COUNT|AVG|SUM|MIN|MAX)\s*\(\s*(\*|\w+)\s*\)(?:\s+AS\s+"?(\w+)"?)?/i)

  if (aggMatch) {
    const func = aggMatch[1].toUpperCase()
    const alias = aggMatch[3] || func.toLowerCase()

    let query = supabase.from(table).select('*', { count: 'exact', head: false })
    query = applyFilters(query, allFilters)

    const { data, error, count } = await query
    if (error) throw error

    if (func === 'COUNT') {
      return [[{ [alias]: count || 0 }], undefined]
    }
    if (func === 'AVG') {
      const colMatch = cleaned.match(/AVG\s*\(\s*(\w+)\s*\)/i)
      const colName = colMatch ? colMatch[1] : null
      if (colName && data && data.length > 0) {
        let sum = 0
        for (const row of data) sum += Number(row[colName]) || 0
        return [[{ [alias]: data.length > 0 ? +(sum / data.length).toFixed(1) : 0 }], undefined]
      }
      return [[{ [alias]: 0 }], undefined]
    }
    return [[{ [alias]: count || 0 }], undefined]
  }

  if (isJoin && table === 'reviews') {
    let query = supabase.from(table).select('*, users!left(name)')
    query = applyFilters(query, allFilters)
    if (order) query = query.order(order.col, order.dir)
    if (limit) query = query.range(offset || 0, (offset || 0) + limit - 1)
    const { data, error } = await query
    if (error) throw error
    const mapped = (data || []).map(r => ({ ...r, user_name: r.users?.name || null, users: undefined }))
    return [mapped, undefined]
  }

  if (isJoin) {
    const idEq = allFilters.find(f => f.col === 'id' && f.op === 'eq')
    try {
      if (idEq) {
        const { data, error } = await supabase
          .from(table)
          .select('*, categories!left(name), brands!left(name)')
          .eq('id', idEq.val)
          .maybeSingle()
        if (error) throw error
        return [[data ? [data] : []], undefined]
      }

      const { data, error } = await supabase
        .from(table)
        .select('*, categories!left(name), brands!left(name)')
      if (error) throw error
      return [data || [], undefined]
    } catch (joinErr) {
      if (joinErr.code === 'PGRST202' || joinErr.message?.includes('Could not find a relationship')) {
        let query = supabase.from(table).select('*')
        query = applyFilters(query, allFilters)
        if (order) query = query.order(order.col, order.dir)
        if (limit) query = query.range(offset || 0, (offset || 0) + limit - 1)
        const { data, error } = await query
        if (error) throw error
        return [data || [], undefined]
      }
      throw joinErr
    }
  }

  let query = supabase.from(table).select('*')
  query = applyFilters(query, allFilters)
  if (order) query = query.order(order.col, order.dir)
  if (limit) query = query.range(offset || 0, (offset || 0) + limit - 1)

  const { data, error } = await query
  if (error) throw error
  return [data || [], undefined]
}

async function handleInsert(sql, params) {
  const table = extractTable(sql)
  if (!table || !TABLE_MAP[table]) throw new Error(`Unknown table: ${table}`)

  const colsMatch = sql.match(/INSERT\s+(?:IGNORE\s+)?INTO\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)/i)
  if (!colsMatch) throw new Error('Cannot parse INSERT columns')

  const cols = colsMatch[2].split(',').map(c => c.trim().replace(/[`"']/g, ''))
  const row = {}
  for (let i = 0; i < cols.length; i++) {
    let val = params && params[i] !== undefined ? params[i] : null
    if (typeof val === 'string') {
      try { val = JSON.parse(val) } catch { }
    }
    row[cols[i]] = val
  }

  const isConflict = /ON\s+CONFLICT/i.test(sql)
  let query = supabase.from(table).insert(row).select('id')

  if (isConflict) {
    query = query.single()
  } else {
    query = query.single()
  }

  const { data, error } = await query
  if (error && !isConflict) throw error
  if (error && isConflict && error.code === '23505') {
    return [{ insertId: 0, affectedRows: 0 }, undefined]
  }
  if (error && isConflict && error.message?.includes('conflict')) {
    return [{ insertId: 0, affectedRows: 0 }, undefined]
  }
  if (error) throw error

  eventEmitter.emit('data:change', { table, type: 'insert', id: data?.id })

  return [{ insertId: data?.id || 0, affectedRows: 1 }, undefined]
}

async function handleUpdate(sql, params) {
  const table = extractTable(sql)
  if (!table || !TABLE_MAP[table]) throw new Error(`Unknown table: ${table}`)

  const cleaned = cleanSql(sql)

  const setMatch = cleaned.match(/SET\s+([^WHERE]+)/i)
  if (!setMatch) throw new Error('Cannot parse SET clause')

  const setParts = setMatch[1].split(',').map(s => s.trim())
  const updateData = {}
  let paramIdx = 0
  for (const part of setParts) {
    const m = part.match(/[`"']?(\w+)[`"']?\s*=\s*\?/i)
    if (m) {
      let val = params && params[paramIdx] !== undefined ? params[paramIdx] : null
      if (typeof val === 'string') {
        try { val = JSON.parse(val) } catch { }
      }
      updateData[m[1]] = val
      paramIdx++
    }
  }

  const whereStr = cleaned.match(/WHERE\s+(.+)/i)
  if (!whereStr) {
    const { data, error } = await supabase.from(table).update(updateData).select()
    if (error) throw error
    eventEmitter.emit('data:change', { table, type: 'update' })
    return [[], undefined]
  }

  const whereClause = whereStr[1]
  const conditions = []
  const whereParamRe = /\b(\w+)\s*=\s*\?/g
  let m
  while ((m = whereParamRe.exec(whereClause)) !== null) {
    conditions.push({ col: m[1], op: 'eq', val: params && params[paramIdx] !== undefined ? params[paramIdx] : null })
    paramIdx++
  }

  let query = supabase.from(table).update(updateData).select()
  for (const c of conditions) {
    query = query.eq(c.col, c.val)
  }

  const { data, error } = await query
  if (error) throw error

  eventEmitter.emit('data:change', { table, type: 'update' })

  return [[], undefined]
}

async function handleDelete(sql, params) {
  const table = extractTable(sql)
  if (!table || !TABLE_MAP[table]) throw new Error(`Unknown table: ${table}`)

  const cleaned = cleanSql(sql)
  const whereMatch = cleaned.match(/WHERE\s+(.+)/i)
  if (!whereMatch) {
    const { error } = await supabase.from(table).delete().neq('id', 0)
    if (error) throw error
    eventEmitter.emit('data:change', { table, type: 'delete' })
    return [[], undefined]
  }

  const eqMatch = whereMatch[1].match(/(\w+)\s*=\s*\?/)
  if (eqMatch) {
    const col = eqMatch[1]
    const val = params && params[0] !== undefined ? params[0] : null
    const { error } = await supabase.from(table).delete().eq(col, val)
    if (error) throw error
  } else {
    const { error } = await supabase.from(table).delete()
    if (error) throw error
  }

  eventEmitter.emit('data:change', { table, type: 'delete' })

  return [[], undefined]
}

const db = {
  query: async (text, params) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DB]', text, params ? JSON.stringify(params) : '')
    }

    try {
      const trimmed = text.trim().toUpperCase()
      if (trimmed.startsWith('SELECT') || trimmed.startsWith('WITH')) {
        return await handleSelect(text, params)
      } else if (trimmed.startsWith('INSERT')) {
        return await handleInsert(text, params)
      } else if (trimmed.startsWith('UPDATE')) {
        return await handleUpdate(text, params)
      } else if (trimmed.startsWith('DELETE')) {
        return await handleDelete(text, params)
      }
      throw new Error(`Unsupported operation: ${text.substring(0, 50)}`)
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[DB Error]', err.message, '\n  SQL:', text, '\n  Params:', JSON.stringify(params))
      }
      throw err
    }
  },

  getSupabase: () => supabase,

  async close() { },
}

module.exports = db
