// Fix seed files where content/explanation fields use template literals
// with unescaped inner backticks.
// Strategy: for each affected line, the LAST backtick is the closing delimiter.
// Everything between first and last backtick = inner content to escape.
const fs = require('fs');

function fixFile(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const fieldRe = /^(\s*(?:content|explanation)\s*:\s*)`(.*)`(,?\s*)$/;

  const fixed = lines.map((line, idx) => {
    const m = line.match(fieldRe);
    if (!m) return line;

    const prefix = m[1]; // e.g. "        content: "
    const inner  = m[2]; // everything between first and last backtick
    const suffix = m[3]; // trailing comma/spaces

    // Now build a double-quoted string from inner:
    // 1. Unescape \` -> ` (backtick no longer needs escaping)
    // 2. Escape bare " -> \"
    // 3. Escape bare $ followed by { -> \${  (template expression artefacts)
    let safe = '';
    let i = 0;
    while (i < inner.length) {
      const ch = inner[i];
      if (ch === '\\' && i + 1 < inner.length) {
        const nx = inner[i + 1];
        if (nx === '`') {
          safe += '`';      // \` -> `
          i += 2;
        } else if (nx === '"') {
          safe += '\\"';    // \" stays
          i += 2;
        } else {
          safe += ch + nx;
          i += 2;
        }
      } else if (ch === '"') {
        safe += '\\"';
        i++;
      } else if (ch === '$' && inner[i + 1] === '{') {
        // Escape template expression
        safe += '\\${';
        i += 2;
        // copy until matching }
        let depth = 1;
        while (i < inner.length && depth > 0) {
          const c = inner[i++];
          if (c === '{') depth++;
          else if (c === '}') depth--;
          if (depth > 0) safe += c;
          else safe += '}';
        }
      } else {
        safe += ch;
        i++;
      }
    }

    return `${prefix}"${safe}"${suffix}`;
  });

  fs.writeFileSync(filePath, fixed.join('\n'), 'utf8');
  console.log('Fixed: ' + filePath);
}

for (const f of process.argv.slice(2)) fixFile(f);
