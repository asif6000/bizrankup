require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const tables = [
  'users', 'categories', 'brands', 'products', 'orders',
  'reviews', 'blog_posts', 'offers', 'addresses', 'expenses',
  'hero_slides', 'notifications', 'faq', 'order_statuses',
  'shipping_rates', 'payment_gateways', 'social_login_providers'
]

async function check() {
  console.log('=== Supabase Connection Check ===\n')

  const { data: apiInfo, error: apiErr } = await supabase.from('_idk').select('count', { count: 'exact', head: true }).maybeSingle()
  if (apiErr && apiErr.message) {
    console.log('✅ API reachable (got expected error for fake table)')
  }

  console.log('Checking all tables:\n')
  let existing = 0
  for (const table of tables) {
    const { error } = await supabase
      .from(table)
      .select('count', { count: 'exact', head: true })
    
    if (!error) {
      console.log(`  ✅ ${table}`)
      existing++
    } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.log(`  ❌ ${table} — does not exist`)
    } else {
      console.log(`  ⚠️  ${table} — ${error.message}`)
    }
  }

  console.log(`\n${existing}/${tables.length} tables exist`)

  if (existing >= tables.length) {
    console.log('\n✅ All tables exist! Just need the DB password for the pg driver.')
  } else {
    console.log('\n❌ Some tables are missing.')
    console.log('Run the SQL in Supabase SQL Editor:')
    console.log('  1. Open https://supabase.com/dashboard/project/rgynnjrnblrqnafnqcco/sql/new')
    console.log('  2. Copy contents of backend/config/schema.sql')
    console.log('  3. Paste and run')
  }

  console.log('\nDATABASE_URL:', (process.env.DATABASE_URL || '').replace(/:[^@]+@/, ':****@'))
}

check().catch(console.error)
