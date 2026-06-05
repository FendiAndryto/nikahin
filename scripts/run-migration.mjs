/**
 * Supabase SQL Migration Runner
 * 
 * Runs SQL directly against Supabase PostgreSQL using the
 * Supabase Management API (api.supabase.com).
 * 
 * Requires: SUPABASE_ACCESS_TOKEN or SUPABASE_SERVICE_ROLE_KEY
 * 
 * Usage: node scripts/run-migration.mjs <path-to-sql-file>
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sqlFile = process.argv[2];
if (!sqlFile) {
  console.error("❌ Usage: node scripts/run-migration.mjs <path-to-sql-file>");
  process.exit(1);
}

const sqlPath = resolve(sqlFile);
console.log(`📄 Reading SQL from: ${sqlPath}`);

let sql;
try {
  sql = readFileSync(sqlPath, "utf-8");
} catch (err) {
  console.error(`❌ Could not read file: ${err.message}`);
  process.exit(1);
}

console.log(`🚀 Executing migration against ${SUPABASE_URL}...`);

// Create admin supabase client with service_role
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// Step 1: Ensure exec_sql function exists
const bootstrapFn = `
CREATE OR REPLACE FUNCTION public.exec_sql(query text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  EXECUTE query;
  RETURN '{"success": true}'::jsonb;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('error', SQLERRM, 'detail', SQLSTATE);
END;
$$;
`;

// Try calling exec_sql first to see if it exists
console.log("🔍 Checking for exec_sql helper function...");
const { error: checkError } = await supabase.rpc("exec_sql", { query: "SELECT 1" });

if (checkError && checkError.message.includes("Could not find")) {
  console.log("📦 exec_sql not found. Bootstrapping...");
  console.log("");
  console.log("⚠️  To enable CLI migrations, please run this ONE-TIME setup");
  console.log("   in Supabase Dashboard → SQL Editor:");
  console.log("");
  console.log("─".repeat(60));
  console.log(bootstrapFn.trim());
  console.log("─".repeat(60));
  console.log("");
  console.log("   After creating the function, re-run this script.");
  process.exit(1);
}

// Step 2: Execute the migration SQL
console.log("📝 Running migration SQL...");
const { data, error } = await supabase.rpc("exec_sql", { query: sql });

if (error) {
  console.error(`❌ Migration failed: ${error.message}`);
  process.exit(1);
}

if (data && data.error) {
  console.error(`❌ SQL Error: ${data.error} (${data.detail})`);
  process.exit(1);
}

console.log("✅ Migration executed successfully!");
console.log(JSON.stringify(data, null, 2));
