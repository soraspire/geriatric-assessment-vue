import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
} from 'docx';

const FONT = 'Times New Roman';
const COLOR_RISK = 'DC2626';
const COLOR_NORMAL = '16A34A';
const COLOR_H2 = '1E40AF';
const COLOR_H3 = '1E3A8A';
const COLOR_MUTED = '64748B';

// A4 width (11906) minus 2cm margins each side (1134 twips each).
const PAGE_MARGIN = 1134;
const CONTENT_WIDTH = 11906 - PAGE_MARGIN * 2;
const RESULT_COLS = [2900, 2100, 1600, 3038];

const yesNo = (v: unknown) => (v ? 'Có' : 'Không');

const labelValue = (label: string, value: unknown, indent = 0) =>
  new Paragraph({
    spacing: { after: 80 },
    indent: indent ? { left: indent } : undefined,
    children: [
      new TextRun({ text: `${label}: `, bold: true }),
      new TextRun({ text: value === null || value === undefined || value === '' ? 'N/A' : String(value) }),
    ],
  });

const plain = (text: string, opts: { indent?: number; italics?: boolean } = {}) =>
  new Paragraph({
    spacing: { after: 80 },
    indent: opts.indent ? { left: opts.indent } : undefined,
    children: [new TextRun({ text, italics: opts.italics })],
  });

const h2 = (text: string, pageBreakBefore = false) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    pageBreakBefore,
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0', space: 4 } },
    children: [new TextRun({ text, bold: true, color: COLOR_H2, size: 30 })],
  });

const h3 = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 100 },
    children: [new TextRun({ text, bold: true, color: COLOR_H3, size: 24 })],
  });

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };

const cell = (width: number, lines: string[], opts: { bold?: boolean; color?: string; header?: boolean } = {}) =>
  new TableCell({
    borders: cellBorders,
    width: { size: width, type: WidthType.DXA },
    shading: opts.header ? { type: ShadingType.CLEAR, color: 'auto', fill: 'F1F5F9' } : undefined,
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: lines.map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line, bold: opts.bold || opts.header, color: opts.color })],
        }),
    ),
  });

/** Two-column grid without borders, mirroring the .patient-info grid on the page. */
const infoGrid = (items: [string, unknown][]) => {
  const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
  const noBorders = { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none };
  const rows: TableRow[] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(
      new TableRow({
        children: [items[i], items[i + 1]].map(
          (item) =>
            new TableCell({
              borders: noBorders,
              width: { size: CONTENT_WIDTH / 2, type: WidthType.DXA },
              children: [item ? labelValue(item[0], item[1]) : new Paragraph('')],
            }),
        ),
      }),
    );
  }
  return new Table({
    width: { size: CONTENT_WIDTH, type: WidthType.DXA },
    columnWidths: [CONTENT_WIDTH / 2, CONTENT_WIDTH / 2],
    layout: TableLayoutType.FIXED,
    borders: noBorders,
    rows,
  });
};

const resultRow = (domain: string, r: any, normalCol: string, extra?: string) => {
  const color = r.is_risk ? COLOR_RISK : COLOR_NORMAL;
  const resultLines = [String(r.status ?? '')];
  if (extra) resultLines.push(extra);
  return new TableRow({
    cantSplit: true,
    children: [
      cell(RESULT_COLS[0], [domain]),
      cell(RESULT_COLS[1], [normalCol]),
      cell(RESULT_COLS[2], [String(r.score ?? '')]),
      cell(RESULT_COLS[3], resultLines, { bold: true, color }),
    ],
  });
};

export async function exportAssessmentDocx(assessment: any, results: any) {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: 'Kết Quả Đánh Giá Lão Khoa Toàn Diện', bold: true, size: 36, color: '000000' })],
    }),
  );

  children.push(
    infoGrid([
      ['Bệnh nhân', assessment.patientName],
      ['Năm sinh', assessment.birthYear],
      ['Giới tính', assessment.gender === 1 ? 'Nam' : 'Nữ'],
      ['Điện thoại', assessment.phoneNumber],
      ['Nghề nghiệp', assessment.previousJob],
      ['BMI', assessment.bmi],
    ]),
  );

  const od = assessment.otherDetails;
  if (od) {
    children.push(
      new Paragraph({
        spacing: { before: 200 },
        border: { top: { style: BorderStyle.SINGLE, size: 6, color: 'E2E8F0', space: 8 } },
        children: [],
      }),
    );
    let allergy = 'Không';
    if (od.has_drug_allergy) allergy = od.drug_allergy_detail ? `Có (${od.drug_allergy_detail})` : 'Có';
    children.push(labelValue('Dị ứng thuốc', allergy));
    children.push(labelValue('Giác quan (khiếm khuyết)', yesNo(od.has_sensory_impairment)));
    children.push(labelValue('Tiểu không tự chủ', yesNo(od.has_incontinence)));
    children.push(labelValue('Người chăm sóc', yesNo(od.has_caregiver)));
    children.push(labelValue('Nguy cơ loét', yesNo(od.has_pressure_ulcer_risk)));
    if (results?.padua?.has_pressure_ulcer_risk) children.push(plain(`- ${results.padua.interpretation}`, { indent: 300 }));
    if (results?.improve?.show_improve && results?.improve?.interpretation)
      children.push(plain(`- ${results.improve.interpretation}`, { indent: 300 }));
  }

  children.push(h2('KẾT QUẢ TEST'));

  if (results) {
    const rows: TableRow[] = [
      new TableRow({
        tableHeader: true,
        children: ['Lĩnh vực (Domains)', 'Điểm bình thường / Tối đa', 'Điểm bệnh nhân', 'Kết quả'].map((t, i) =>
          cell(RESULT_COLS[i], [t], { header: true }),
        ),
      }),
      resultRow('Đa bệnh lý (CCI)', results.cci, `0 / ${results.cci.max}`),
    ];
    if (results.minicog)
      rows.push(
        resultRow('Sàng lọc sa sút trí tuệ (Mini-Cog)', results.minicog, `${results.minicog.normal} / ${results.minicog.max}`),
      );
    rows.push(resultRow('Dinh dưỡng bệnh nhân (MNA)', results.mna, `${results.mna.normal} / ${results.mna.max}`));
    rows.push(
      resultRow('Suy yếu (CFS)', results.cfs, `${results.cfs.normal} / ${results.cfs.max}`, `Mức độ: ${results.cfs.interpretation}`),
    );
    rows.push(
      resultRow(
        'Đánh giá nguy cơ té ngã (Morse)',
        results.morse,
        `${results.morse.normal} / ${results.morse.max}`,
        `Mức độ: ${results.morse.interpretation}`,
      ),
    );
    children.push(
      new Table({ width: { size: CONTENT_WIDTH, type: WidthType.DXA }, columnWidths: RESULT_COLS, layout: TableLayoutType.FIXED, rows }),
    );

    children.push(h2('ĐÁNH GIÁ CHI TIẾT'));
    const n = (withMinicog: number, without: number) => (results.minicog ? withMinicog : without);

    children.push(h3('1. Tiền sử bản thân (CCI)'));
    children.push(labelValue('Kết luận', results.cci.interpretation));
    if (results.cci.activeCciList) children.push(labelValue('Các bệnh lý ghi nhận', results.cci.activeCciList));
    else children.push(plain('Không ghi nhận bệnh lý đồng diễn nào.', { italics: true }));

    if (results.minicog) {
      children.push(h3('2. Sàng lọc sa sút trí tuệ (Mini-Cog)'));
      children.push(labelValue('Kết luận', results.minicog.interpretation));
    }
    children.push(h3(`${n(3, 2)}. Dinh dưỡng (MNA)`));
    children.push(labelValue('Kết luận', results.mna.interpretation));
    children.push(h3(`${n(4, 3)}. Suy yếu lâm sàng (CFS)`));
    children.push(labelValue('Kết luận', results.cfs.interpretation));
    children.push(h3(`${n(5, 4)}. Nguy cơ té ngã (Morse)`));
    children.push(labelValue('Kết luận', results.morse.interpretation));
  }

  const dateStr = new Date(assessment.createdAt).toLocaleDateString('vi-VN');
  children.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 480 },
      children: [new TextRun({ text: `Ngày đánh giá: ${dateStr}`, italics: true, color: COLOR_MUTED })],
    }),
  );

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 24 } } } },
    sections: [
      {
        properties: { page: { margin: { top: PAGE_MARGIN, bottom: PAGE_MARGIN, left: PAGE_MARGIN, right: PAGE_MARGIN } } },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = String(assessment.patientName || 'BenhNhan')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const fileDate = dateStr.replace(/\//g, '-');

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${safeName}_${fileDate}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
