const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Path to claude-mem database
const dbPath = path.join(os.homedir(), '.claude-mem', 'claude-mem.db').replace(/\\/g, '/');

function runSql(sql) {
  try {
    const escapedSql = sql.replace(/"/g, '\\"');
    const cmd = `sqlite3 "${dbPath}" "${escapedSql}"`;
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (err) {
    console.error(`Error executing SQL: ${err.message}`);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  
  if (!fs.existsSync(dbPath)) {
    console.log(`Database not found at ${dbPath}. Nothing to clean.`);
    process.exit(0);
  }

  const daysArg = getArgValue(args, '--days');
  const projectArg = getArgValue(args, '--project');
  const resetMode = args.includes('--reset');

  if (resetMode) {
    console.log("🧹 Resetting all claude-mem session memories...");
    runSql("DELETE FROM observations; DELETE FROM session_summaries; DELETE FROM user_prompts; DELETE FROM pending_messages; DELETE FROM sdk_sessions;");
    runSql("VACUUM;");
    console.log("✅ Database cleared and vacuumed successfully.");
    return;
  }

  if (projectArg) {
    console.log(`🧹 Deleting memories for project: ${projectArg}...`);
    const safeProject = projectArg.replace(/'/g, "''");
    runSql(`DELETE FROM observations WHERE project = '${safeProject}';`);
    runSql(`DELETE FROM session_summaries WHERE project = '${safeProject}';`);
    runSql(`DELETE FROM user_prompts WHERE project = '${safeProject}';`);
    runSql("VACUUM;");
    console.log(`✅ Project '${projectArg}' memory deleted successfully.`);
    return;
  }

  const days = daysArg ? parseInt(daysArg, 10) : 30;
  if (isNaN(days) || days <= 0) {
    console.error("Error: --days must be a positive number.");
    process.exit(1);
  }

  console.log(`🧹 Pruning session memories older than ${days} days...`);
  const cutoffMs = Date.now() - days * 24 * 60 * 60 * 1000;
  
  runSql(`DELETE FROM observations WHERE created_at_epoch < ${cutoffMs};`);
  runSql(`DELETE FROM session_summaries WHERE created_at_epoch < ${cutoffMs};`);
  runSql(`DELETE FROM user_prompts WHERE created_at_epoch < ${cutoffMs};`);
  runSql("VACUUM;");
  
  console.log(`✅ Pruning completed. Reclaimed space with SQL VACUUM.`);
}

function getArgValue(args, flag) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

main();
