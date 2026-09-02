import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Format date values to a clean, human-readable format: '02-Sep-2026 18:30' or '02-Sep-2026'
 */
export const formatReportDate = (dateVal, includeTime = false) => {
  if (!dateVal) return 'N/A';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  if (includeTime) {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  return `${day}-${month}-${year}`;
};

/**
 * Format currency to clean string e.g. '₹8,447.00'
 */
export const formatReportCurrency = (val) => {
  const num = Number(val || 0);
  return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Export data as a genuine .xlsx Excel workbook
 * Sets proper MIME type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 * Auto-calculates column widths so Excel NEVER displays ### for dates or IDs
 */
export const exportToExcel = (headers, data, filename) => {
  // Create worksheet from data objects
  const ws = XLSX.utils.json_to_sheet(data, { header: headers });

  // Compute column widths: max length of headers and values, with min width 22
  const colWidths = headers.map(header => {
    let maxLen = header.length;
    data.forEach(row => {
      const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
      if (val.length > maxLen) {
        maxLen = val.length;
      }
    });
    // Add extra padding and set minimum width of 22 to guarantee no '###' in Excel
    return { wch: Math.max(maxLen + 4, 22) };
  });

  ws['!cols'] = colWidths;

  // Create workbook and append sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');

  // Generate array buffer
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Create Blob with correct OpenXML Excel MIME type
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data as genuine CSV file with UTF-8 BOM (\uFEFF)
 */
export const exportToCSV = (headers, data, filename) => {
  const csvRows = [
    headers.map(h => `"${(h ?? '').replace(/"/g, '""')}"`).join(','),
    ...data.map(row => 
      headers.map(h => `"${('' + (row[h] ?? '')).replace(/"/g, '""')}"`).join(',')
    )
  ];
  
  // Include UTF-8 BOM (\uFEFF) so Excel opens UTF-8 files correctly
  const blob = new Blob(['\uFEFF' + csvRows.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export data as direct downloadable PDF file (application/pdf)
 * Generates genuine PDF binary and triggers programmatic browser download
 */
export const exportToPDF = (reportType, dateRange, headers, data, filename) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Header Title & Branding
  doc.setFontSize(16);
  doc.setTextColor(130, 13, 242); // BeatBox primary purple #820df2
  doc.text('BEATBOX ADMIN PORTAL', 14, 15);

  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59);
  doc.text(`${reportType} Business Report`, 14, 22);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated: ${formatReportDate(new Date(), true)}  |  Filter Scope: ${dateRange}  |  Total Records: ${data.length}`, 14, 28);

  // Table Data mapping
  const tableRows = data.map(row => 
    headers.map(h => row[h] !== undefined && row[h] !== null ? String(row[h]) : '-')
  );

  autoTable(doc, {
    startY: 33,
    head: [headers],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { top: 33, left: 14, right: 14, bottom: 18 },
    didDrawPage: (pageData) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      const pageSize = doc.internal.pageSize;
      const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
      
      doc.text(`Page ${pageCount}`, pageData.settings.margin.left, pageHeight - 8);
      doc.text('BeatBox E-Commerce Admin System • Confidential Report', pageSize.width - 14, pageHeight - 8, { align: 'right' });
    }
  });

  // Output blob with application/pdf type and trigger direct download
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename || `beatbox_report_${reportType.toLowerCase()}`}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
