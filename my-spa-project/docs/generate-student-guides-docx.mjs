/**
 * Converts student .txt guides to Word documents.
 * Run: npm run doc:student-guides
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  AlignmentType,
  WidthType,
  BorderStyle,
} from 'docx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'word');

function isSeparator(line) {
  const t = line.trim();
  return /^=+$/.test(t) || /^-+$/.test(t);
}

function isTableSeparator(line) {
  return /^\|?[\s\-:|]+\|?$/.test(line.trim()) && line.includes('-');
}

function parseTableRow(line) {
  if (!line.trim().startsWith('|')) return null;
  const parts = line
    .split('|')
    .slice(1, -1)
    .map((c) => c.trim());
  if (parts.length === 0) return null;
  if (parts.every((c) => /^-+$/.test(c.replace(/:/g, '')))) return null;
  return parts;
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 120 },
    children: [
      new TextRun({
        text,
        size: opts.size ?? 22,
        font: opts.font,
        bold: opts.bold,
      }),
    ],
  });
}

function bullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })],
  });
}

function codeLine(text) {
  return new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, font: 'Consolas', size: 20 })],
  });
}

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28 })],
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 180, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24 })],
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 120, after: 80 },
    children: [new TextRun({ text, bold: true, size: 22 })],
  });
}

function titlePara(text) {
  return new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, bold: true, size: 32 })],
  });
}

function buildTable(rows) {
  if (rows.length === 0) return [];
  const colCount = Math.max(...rows.map((r) => r.length));
  const tableRows = rows.map(
    (cells, rowIndex) =>
      new TableRow({
        children: Array.from({ length: colCount }, (_, i) => {
          const cellText = cells[i] ?? '';
          return new TableCell({
            width: { size: 100 / colCount, type: WidthType.PERCENTAGE },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: cellText,
                    bold: rowIndex === 0,
                    size: 20,
                  }),
                ],
              }),
            ],
          });
        }),
      }),
  );

  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
      },
      rows: tableRows,
    }),
    new Paragraph({ spacing: { after: 160 }, children: [] }),
  ];
}

function txtToParagraphs(raw) {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  let tableBuffer = [];
  let paraBuffer = [];

  const flushPara = () => {
    if (paraBuffer.length === 0) return;
    out.push(p(paraBuffer.join(' ')));
    paraBuffer = [];
  };

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    out.push(...buildTable(tableBuffer));
    tableBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushPara();
      flushTable();
      i += 1;
      continue;
    }

    if (isSeparator(trimmed)) {
      flushPara();
      flushTable();
      const inner = trimmed.replace(/[=|-]/g, '').trim();
      if (inner.length > 10 && !inner.startsWith('END OF')) {
        if (out.length === 0) {
          out.push(titlePara(inner));
        }
      }
      i += 1;
      continue;
    }

    if (trimmed.startsWith('END OF')) {
      flushPara();
      flushTable();
      out.push(p(trimmed, { italic: false }));
      i += 1;
      continue;
    }

    if (/^PART \d+/i.test(trimmed) || /^TABLE \d+/i.test(trimmed)) {
      flushPara();
      flushTable();
      out.push(heading1(trimmed));
      i += 1;
      continue;
    }

    if (trimmed === 'BASICS — EXPLAIN LIKE A CLASS NOTES') {
      flushPara();
      flushTable();
      out.push(heading1(trimmed));
      i += 1;
      continue;
    }

    const tableRow = parseTableRow(line);
    if (tableRow && !isTableSeparator(line)) {
      flushPara();
      tableBuffer.push(tableRow);
      i += 1;
      continue;
    }

    if (isTableSeparator(line)) {
      i += 1;
      continue;
    }

    if (
      /^[A-Z][A-Z0-9\s\-—]+$/.test(trimmed) &&
      trimmed.length < 60 &&
      !trimmed.includes('http') &&
      !trimmed.startsWith('ROOM')
    ) {
      flushPara();
      flushTable();
      out.push(heading2(trimmed));
      i += 1;
      continue;
    }

    if (/^[a-zA-Z0-9_.-]+\.jsx?$/.test(trimmed) || /^[a-zA-Z0-9_.-]+\.js$/.test(trimmed)) {
      flushPara();
      flushTable();
      out.push(heading3(trimmed));
      i += 1;
      continue;
    }

    if (
      trimmed.startsWith('Q:') ||
      trimmed.startsWith('A:') ||
      /^\d+\)/.test(trimmed)
    ) {
      flushPara();
      flushTable();
      out.push(p(trimmed, { bold: trimmed.startsWith('Q:') }));
      i += 1;
      continue;
    }

    if (
      trimmed.startsWith('- ') ||
      trimmed.startsWith('Step ') ||
      trimmed.startsWith('Check ') ||
      trimmed.startsWith('Terminal ')
    ) {
      flushPara();
      flushTable();
      out.push(bullet(trimmed.replace(/^- /, '')));
      i += 1;
      continue;
    }

    if (line.startsWith('  ') && (line.includes('→') || line.includes('- '))) {
      flushPara();
      flushTable();
      out.push(bullet(trimmed));
      i += 1;
      continue;
    }

    if (/[│├└]/.test(line) || trimmed.startsWith('my-spa-project')) {
      flushPara();
      flushTable();
      out.push(codeLine(line));
      i += 1;
      continue;
    }

    if (trimmed.startsWith('ROOM ')) {
      flushPara();
      flushTable();
      out.push(p(trimmed, { bold: true }));
      i += 1;
      continue;
    }

    paraBuffer.push(trimmed);
    i += 1;
  }

  flushPara();
  flushTable();
  return out;
}

async function writeDocx(txtFileName, docxFileName) {
  const txtPath = path.join(__dirname, txtFileName);
  const raw = await fs.readFile(txtPath, 'utf8');
  const children = txtToParagraphs(raw);
  const doc = new Document({ sections: [{ properties: {}, children }] });
  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(OUT_DIR, docxFileName);
  await fs.writeFile(outPath, buffer);
  console.log('Wrote', outPath);
}

await fs.mkdir(OUT_DIR, { recursive: true });
await writeDocx(
  'STUDENT_MERN_INTEGRATION_GUIDE.txt',
  'STUDENT_MERN_INTEGRATION_GUIDE.docx',
);
await writeDocx(
  'STUDENT_MERN_QUICK_REFERENCE.txt',
  'STUDENT_MERN_QUICK_REFERENCE.docx',
);
