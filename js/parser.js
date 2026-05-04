const LINE_RE = /^\s*(.+?)\s*\[\s*([\d.]+)\s*\]\s*(.+?)\s*$/;

function parse(text) {
  const nodeMap = new Map();
  const links = [];
  const errors = [];

  text.split('\n').forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) return;

    const m = trimmed.match(LINE_RE);
    if (!m) {
      errors.push(`Line ${i + 1}: unparseable`);
      return;
    }

    const [, source, valStr, target] = m;
    const value = +valStr;
    if (value <= 0) {
      errors.push(`Line ${i + 1}: value must be > 0`);
      return;
    }

    if (!nodeMap.has(source)) nodeMap.set(source, { name: source });
    if (!nodeMap.has(target)) nodeMap.set(target, { name: target });
    links.push({ source, target, value });
  });

  return { nodes: [...nodeMap.values()], links, errors };
}
