import ExcelJS from 'exceljs';
import { CurriculumPart } from './data';

interface ExcelExportData {
    title: string;
    learningObjectives: string;
    duration: number; // in minutes
    parts: CurriculumPart[];
}

export async function exportCurriculumToExcel(data: ExcelExportData) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('커리큘럼');

    // Set column widths
    worksheet.getColumn('A').width = 8;  // 번호
    worksheet.getColumn('B').width = 30; // 파트명
    worksheet.getColumn('C').width = 60; // 상세 내용
    worksheet.getColumn('D').width = 12; // 시간

    // Convert minutes to hours
    const hours = data.duration / 60;

    // B2: 강의명
    const titleCell = worksheet.getCell('B2');
    titleCell.value = `■ 강의명: ${data.title}`;
    titleCell.font = { bold: true, size: 14 };

    // B3: 학습목표
    const objectiveCell = worksheet.getCell('B3');
    objectiveCell.value = `■ 학습목표: ${data.learningObjectives || '없음'}`;
    objectiveCell.font = { bold: true, size: 12 };
    objectiveCell.alignment = { wrapText: true, vertical: 'top' };
    worksheet.getRow(3).height = Math.max(20, Math.ceil(data.learningObjectives.length / 50) * 15);

    // B4: 진행시간
    const durationCell = worksheet.getCell('B4');
    durationCell.value = `■ 진행시간: ${hours.toFixed(1)}시간`;
    durationCell.font = { bold: true, size: 12 };

    // A7: Table Header
    const headerRow = worksheet.getRow(7);
    headerRow.values = ['번호', '파트명', '상세 내용', '시간(분)'];
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
    headerRow.height = 25;

    // Apply header background color
    ['A7', 'B7', 'C7', 'D7'].forEach(cell => {
        const c = worksheet.getCell(cell);
        c.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00A9BB' }
        };
        c.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
        };
    });

    // Add data rows
    let rowNumber = 8;
    let itemNumber = 1;

    data.parts.forEach((part) => {
        const startRow = rowNumber;
        const itemCount = part.items.length;

        if (itemCount === 0) return;

        part.items.forEach((item, index) => {
            const row = worksheet.getRow(rowNumber);

            // Column A: Number
            row.getCell(1).value = itemNumber;

            // Column B: Part name (will be merged later)
            if (index === 0) {
                row.getCell(2).value = part.title;
            }

            // Column C: Details
            row.getCell(3).value = item.details;

            // Column D: Duration
            row.getCell(4).value = item.duration || 0;

            // Set row alignment and height
            row.alignment = { vertical: 'top', wrapText: true };
            row.height = Math.max(20, Math.ceil(item.details.length / 80) * 15);

            // Apply borders
            ['A', 'B', 'C', 'D'].forEach(col => {
                const cell = worksheet.getCell(`${col}${rowNumber}`);
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            // Apply background color for practice/theory items
            if (item.type === '실습') {
                worksheet.getCell(`C${rowNumber}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFF4E6' } // Light yellow/orange for practice
                };
            } else if (item.type === '이론') {
                worksheet.getCell(`C${rowNumber}`).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE3F2FD' } // Light blue for theory
                };
            }

            // Center align number and duration columns
            worksheet.getCell(`A${rowNumber}`).alignment = { horizontal: 'center', vertical: 'middle' };
            worksheet.getCell(`D${rowNumber}`).alignment = { horizontal: 'center', vertical: 'middle' };

            rowNumber++;
            itemNumber++;
        });

        // Merge cells for part name (Column B)
        const endRow = rowNumber - 1;
        if (startRow < endRow) {
            worksheet.mergeCells(`B${startRow}:B${endRow}`);
        }

        // Center align merged part name cell
        const partCell = worksheet.getCell(`B${startRow}`);
        partCell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        partCell.font = { bold: true, size: 11 };
        partCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6F7F9' } // Light blue background for part names
        };
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.title || '커리큘럼'}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
