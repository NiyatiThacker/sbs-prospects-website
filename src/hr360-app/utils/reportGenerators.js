import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDuration } from './formatters';

export function generateCSV(data, title) {
  if (!data || data.length === 0) return;

  const headers = ['Employee', 'Department', 'Total Hours', 'Productive Hours', 'Productivity Score', 'Days Present', 'Days Absent'];
  
  const csvRows = [
    headers.join(','),
    ...data.map(row => [
      `"${row.name}"`,
      `"${row.department}"`,
      row.totalHours,
      row.productiveHours,
      row.score,
      row.present,
      row.absent
    ].join(','))
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${title.replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generatePDF(data, title) {
  if (!data || data.length === 0) return;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // --- BRAND HEADER ---
  doc.setFillColor(15, 23, 42); // Very dark slate
  doc.rect(0, 0, pageWidth, 28, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('HR360 Analytics', 14, 18);
  
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(title, pageWidth - 14, 18, { align: 'right' });

  // --- KPI SUMMARY CARDS ---
  let totalScore = 0;
  let totalHours = 0;
  data.forEach(d => {
    totalScore += d.score;
    totalHours += d.totalHours;
  });
  const avgScore = Math.round(totalScore / data.length);
  const formattedHours = formatDuration(Math.round(totalHours * 60));

  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(14, 34, 56, 22, 2, 2, 'FD');
  doc.roundedRect(77, 34, 56, 22, 2, 2, 'FD');
  doc.roundedRect(140, 34, 56, 22, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Active Employees', 20, 42);
  doc.text('Total Time Tracked', 83, 42);
  doc.text('Avg Productivity', 146, 42);

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(data.length.toString(), 20, 51);
  doc.text(formattedHours, 83, 51);
  doc.text(`${avgScore}%`, 146, 51);

  // --- DEPARTMENT CHART ---
  const deptMap = {};
  data.forEach(d => {
    if (!deptMap[d.department]) deptMap[d.department] = { count: 0, totalScore: 0 };
    deptMap[d.department].count++;
    deptMap[d.department].totalScore += d.score;
  });

  const depts = Object.keys(deptMap).sort();
  let startY = 66;

  if (depts.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Department Productivity Analysis", 14, startY + 6);
    
    let currentY = startY + 16;
    const chartX = 45;
    const maxBarWidth = 120;
    
    // Draw Axis
    doc.setDrawColor(226, 232, 240);
    doc.line(chartX, currentY - 4, chartX, currentY + (depts.length * 12));
    
    // Grid Lines
    [0, 25, 50, 75, 100].forEach(mark => {
      const x = chartX + (mark / 100) * maxBarWidth;
      doc.setDrawColor(241, 245, 249);
      doc.line(x, currentY - 4, x, currentY + (depts.length * 12));
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(mark.toString(), x, currentY - 6, { align: 'center' });
    });
    
    depts.forEach((dept, idx) => {
      const avg = Math.round(deptMap[dept].totalScore / deptMap[dept].count);
      const barWidth = (avg / 100) * maxBarWidth;
      
      // Dept label
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(dept, chartX - 4, currentY + 4, { align: 'right' });
      
      // Colored bar
      // Use different colors for top performers
      if (avg >= 85) doc.setFillColor(16, 185, 129); // Emerald
      else if (avg >= 60) doc.setFillColor(99, 102, 241); // Indigo
      else doc.setFillColor(245, 158, 11); // Amber
      
      doc.roundedRect(chartX, currentY, barWidth, 6, 1, 1, 'F');
      
      // Score text inside or outside
      doc.setFontSize(8);
      if (barWidth > 15) {
        doc.setTextColor(255, 255, 255);
        doc.text(`${avg}%`, chartX + barWidth - 2, currentY + 4, { align: 'right' });
      } else {
        doc.setTextColor(71, 85, 105);
        doc.text(`${avg}%`, chartX + barWidth + 2, currentY + 4);
      }
      
      currentY += 12;
    });
    
    startY = currentY + 12;
  }

  // --- DETAILED TABLE ---
  doc.setFontSize(14);
  doc.setTextColor(30, 41, 59);
  doc.text("Employee Breakdown", 14, startY + 6);
  
  const tableColumn = ['Employee', 'Department', 'Total Time', 'Productive Time', 'Score', 'Present', 'Absent'];
  const tableRows = data.map(row => [
    row.name,
    row.department,
    formatDuration(Math.round(row.totalHours * 60)),
    formatDuration(Math.round(row.productiveHours * 60)),
    `${row.score}%`,
    row.present.toString(),
    row.absent.toString()
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: startY + 10,
    theme: 'grid',
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didDrawPage: function (data) {
      // Footer with page number and timestamp
      const str = 'Page ' + doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(str, data.settings.margin.left, pageHeight - 10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 14, pageHeight - 10, { align: 'right' });
    }
  });

  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
}
