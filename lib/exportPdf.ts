import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CurriculumPart } from './data';

interface PdfExportData {
    title: string;
    learningObjectives: string;
    duration: number; // in minutes
    parts: CurriculumPart[];
}

export async function exportCurriculumToPdf(data: PdfExportData) {
    const doc = new jsPDF();

    // Convert minutes to hours
    const hours = data.duration / 60;

    // Set font size and add title
    doc.setFontSize(18);
    doc.text(`커리큘럼: ${data.title}`, 15, 20);

    // Add learning objectives
    doc.setFontSize(12);
    doc.text(`학습목표: ${data.learningObjectives || '없음'}`, 15, 35);

    // Add duration
    doc.text(`진행시간: ${hours.toFixed(1)}시간`, 15, 45);

    // Prepare table data
    const tableData: any[] = [];
    let itemNumber = 1;

    data.parts.forEach((part) => {
        part.items.forEach((item, index) => {
            tableData.push([
                itemNumber.toString(),
                index === 0 ? part.title : '', // Only show part title on first item
                item.details,
                (item.duration || 0).toString(),
                item.type || '시연'
            ]);
            itemNumber++;
        });
    });

    // Create table
    autoTable(doc, {
        startY: 55,
        head: [['번호', '파트명', '상세 내용', '시간(분)', '타입']],
        body: tableData,
        styles: {
            font: 'helvetica',
            fontSize: 9,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [0, 169, 187], // Teal color
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        columnStyles: {
            0: { cellWidth: 15, halign: 'center' }, // 번호
            1: { cellWidth: 35, halign: 'center' }, // 파트명
            2: { cellWidth: 90 }, // 상세 내용
            3: { cellWidth: 20, halign: 'center' }, // 시간
            4: { cellWidth: 20, halign: 'center' }, // 타입
        },
        didParseCell: function (data) {
            // Color code based on type
            if (data.section === 'body' && data.column.index === 2) {
                const rowData = tableData[data.row.index];
                const type = rowData[4];

                if (type === '실습') {
                    data.cell.styles.fillColor = [255, 244, 230]; // Light yellow/orange
                } else if (type === '이론') {
                    data.cell.styles.fillColor = [227, 242, 253]; // Light blue
                }
            }
        },
    });

    // Sanitize filename to handle special characters
    const sanitizeFilename = (filename: string): string => {
        return filename
            .replace(/[<>:"/\\|?*]/g, '-')
            .replace(/\s+/g, '_')
            .trim();
    };

    const safeFilename = sanitizeFilename(data.title || '커리큘럼');
    console.log('💾 Saving PDF as:', `${safeFilename}.pdf`);

    // Use Blob for proper Korean filename support
    const pdfBlob = doc.output('blob');
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFilename}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Delay cleanup to allow browser to process the download
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 1000);
}
