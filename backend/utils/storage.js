const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function ensureFile(fileName) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8');
  return filePath;
}

function readAll(fileName) {
  const filePath = ensureFile(fileName);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function appendEntry(fileName, entry) {
  const filePath = ensureFile(fileName);
  const all = readAll(fileName);
  all.push(entry);
  fs.writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf-8');
  return entry;
}

module.exports = { readAll, appendEntry };
