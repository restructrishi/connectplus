/**
 * Run migrations and seed using an optional admin URL.
 * Use when crm_user has "permission denied for schema public".
 *
 * Set MIGRATE_DATABASE_URL in .env to a superuser connection (e.g. postgres), then run:
 *   npm run db:setup:admin
 *
 * Your app keeps using DATABASE_URL (crm_user) at runtime.
 */

require('dotenv').config();
const { execSync } = require('child_process');

const url = process.env.MIGRATE_DATABASE_URL || process.env.DATABASE_URL;
if (!url) {
  console.error('Set DATABASE_URL or MIGRATE_DATABASE_URL in .env');
  process.exit(1);
}

process.env.DATABASE_URL = url;
console.log('Using', process.env.MIGRATE_DATABASE_URL ? 'MIGRATE_DATABASE_URL' : 'DATABASE_URL', 'for migrations.\n');

try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env: process.env });
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit', env: process.env });
  console.log('\nDone. You can log in with admin@cachedigitech.com / Admin@123');
} catch (e) {
  process.exit(e.status || 1);
}
