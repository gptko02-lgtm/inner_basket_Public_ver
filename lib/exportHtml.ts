import { CurriculumPart } from './data';

interface HtmlExportData {
    title: string;
    learningObjectives: string;
    duration: number; // in minutes
    parts: CurriculumPart[];
}

export function exportCurriculumToHtml(data: HtmlExportData) {
    const hours = data.duration / 60;

    // Build HTML content
    const htmlContent = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
            line-height: 1.6;
            padding: 40px;
            max-width: 1200px;
            margin: 0 auto;
            background-color: #f5f5f5;
        }
        
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        h1 {
            color: #00a9bb;
            font-size: 28px;
            margin-bottom: 20px;
            border-bottom: 3px solid #00a9bb;
            padding-bottom: 10px;
        }
        
        .info-section {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin-bottom: 30px;
        }
        
        .info-item {
            margin-bottom: 12px;
            font-size: 14px;
        }
        
        .info-label {
            font-weight: bold;
            color: #333;
            display: inline-block;
            width: 100px;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        thead {
            background-color: #00a9bb;
            color: white;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }
        
        th {
            font-weight: bold;
            font-size: 14px;
        }
        
        td {
            font-size: 13px;
        }
        
        .number-col {
            text-align: center;
            width: 60px;
        }
        
        .part-col {
            text-align: center;
            width: 150px;
            font-weight: bold;
            background-color: #e6f7f9;
        }
        
        .duration-col {
            text-align: center;
            width: 80px;
        }
        
        .type-col {
            text-align: center;
            width: 80px;
        }
        
        .practice {
            background-color: #fff4e6;
        }
        
        .theory {
            background-color: #e3f2fd;
        }
        
        .demo {
            background-color: #ffffff;
        }
        
        tbody tr:hover {
            background-color: #f8f9fa;
        }
        
        @media print {
            body {
                padding: 20px;
                background: white;
            }
            
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>■ 강의명: ${data.title}</h1>
        
        <div class="info-section">
            <div class="info-item">
                <span class="info-label">학습목표:</span>
                <span>${data.learningObjectives || '없음'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">진행시간:</span>
                <span>${hours.toFixed(1)}시간</span>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th class="number-col">번호</th>
                    <th class="part-col">파트명</th>
                    <th>상세 내용</th>
                    <th class="duration-col">시간(분)</th>
                    <th class="type-col">타입</th>
                </tr>
            </thead>
            <tbody>
${generateTableRows(data.parts)}
            </tbody>
        </table>
    </div>
</body>
</html>`;

    // Sanitize filename to handle Korean characters properly
    const sanitizeFilename = (filename: string): string => {
        // Replace problematic characters
        return filename
            .replace(/[<>:"/\\|?*]/g, '-') // Replace invalid characters
            .replace(/\s+/g, '_') // Replace spaces with underscores
            .trim();
    };

    const safeFilename = sanitizeFilename(data.title || '커리큘럼');
    console.log('💾 Saving HTML as:', `${safeFilename}.html`);

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${safeFilename}.html`;
    document.body.appendChild(link);
    link.click();

    // Delay cleanup to allow browser to process the download
    setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }, 1000);
}

function generateTableRows(parts: CurriculumPart[]): string {
    let rows = '';
    let itemNumber = 1;

    parts.forEach((part) => {
        const itemCount = part.items.length;

        part.items.forEach((item, index) => {
            const typeClass = item.type === '실습' ? 'practice' :
                item.type === '이론' ? 'theory' : 'demo';

            rows += `
                <tr>
                    <td class="number-col">${itemNumber}</td>
                    ${index === 0 ? `<td class="part-col" rowspan="${itemCount}">${part.title}</td>` : ''}
                    <td class="${typeClass}">${item.details}</td>
                    <td class="duration-col">${item.duration || 0}</td>
                    <td class="type-col">${item.type || '시연'}</td>
                </tr>`;

            itemNumber++;
        });
    });

    return rows;
}
