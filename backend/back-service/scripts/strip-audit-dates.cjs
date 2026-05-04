/**
 * Removes manual created_date / updated_date / modified_date assignments so DB triggers own them.
 * Does NOT touch createdDate: new Date() (pagination metadata) or auth last_seen.
 */
const fs = require('fs');
const path = require('path');

function walkServiceFiles(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walkServiceFiles(p, acc);
    else if (name.endsWith('.service.ts')) acc.push(p);
  }
  return acc;
}

const srcDir = path.join(__dirname, '../src');
const files = walkServiceFiles(srcDir);

const removeLine = (line) => {
  if (line.includes('createdDate: new Date()')) return false;
  if (line.includes('last_seen') && line.includes('new Date()')) return false;
  if (/^\s*created_date:\s*new Date\(\),?\s*$/.test(line)) return true;
  if (/^\s*updated_date:\s*new Date\(\),?\s*$/.test(line)) return true;
  if (/^\s*modified_date:\s*new Date\(\),?\s*$/.test(line)) return true;
  if (/^\s*created_date:\s*now,?\s*$/.test(line)) return true;
  if (/^\s*updated_date:\s*now,?\s*$/.test(line)) return true;
  if (/^\s*[\w.]+\.updated_date\s*=\s*new Date\(\);\s*$/.test(line)) return true;
  if (/^\s*user\.modified_date\s*=\s*new Date\(\);\s*$/.test(line)) return true;
  if (/^\s*'[^']*\.created_date',?\s*$/.test(line)) return true;
  if (/^\s*'[^']*\.updated_date',?\s*$/.test(line)) return true;
  if (/^\s*"[^"]*\.created_date",?\s*$/.test(line)) return true;
  if (/^\s*"[^"]*\.updated_date",?\s*$/.test(line)) return true;
  return false;
};

for (const file of files) {
  if (file.endsWith(`${path.sep}app.service.ts`)) continue;

  let s = fs.readFileSync(file, 'utf8');
  const orig = s;
  const lines = s.split(/\r?\n/);
  const out = lines.filter((ln) => !removeLine(ln));
  s = out.join('\n');

  s = s.replace(/orderBy \?\? 'created_date'/g, "orderBy ?? 'id'");
  s = s.replace(
    /const sortColumn = orderBy \?\? 'created_date'/g,
    "const sortColumn = orderBy ?? 'id'",
  );

  // Drop standalone `const now = new Date()` when file no longer references `now`
  if (file.includes('approval-workflow.service.ts')) {
    s = s.replace(/\n\s*const now = new Date\(\);\s*\n/g, '\n');
    if (!/\bnow\b/.test(s)) {
      s = s.replace(/\s*const now = new Date\(\);\s*\n/g, '\n');
    }
  }

  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log('patched', path.relative(srcDir, file));
  }
}
