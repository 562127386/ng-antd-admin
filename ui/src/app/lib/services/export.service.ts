import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() {}

  /**
   * Export data to CSV format
   * @param data Array of data to export
   * @param columns Column configuration
   * @param filename Output filename
   */
  exportToCsv(data: any[], columns: any[], filename: string = 'export'): void {
    if (!data || data.length === 0) return;

    // Get headers from column configuration
    const headers = columns.map(col => col.headerName);
    const fields = columns.map(col => col.field);

    // Create CSV content
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    data.forEach(row => {
      const rowData = fields.map(field => {
        const value = row[field];
        // Handle special characters and commas
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
      });
      csvContent += rowData.join(',') + '\n';
    });

    // Create blob and download
    this.downloadFile(csvContent, filename, 'text/csv');
  }

  /**
   * Export data to Excel format (simplified version)
   * @param data Array of data to export
   * @param columns Column configuration
   * @param filename Output filename
   */
  exportToExcel(data: any[], columns: any[], filename: string = 'export'): void {
    if (!data || data.length === 0) return;

    // Get headers from column configuration
    const headers = columns.map(col => col.headerName);
    const fields = columns.map(col => col.field);

    // Create HTML table for Excel export
    let htmlContent = '<table border="1">';
    
    // Add header row
    htmlContent += '<tr>';
    headers.forEach(header => {
      htmlContent += `<th>${header}</th>`;
    });
    htmlContent += '</tr>';

    // Add data rows
    data.forEach(row => {
      htmlContent += '<tr>';
      fields.forEach(field => {
        const value = row[field];
        htmlContent += `<td>${value || ''}</td>`;
      });
      htmlContent += '</tr>';
    });

    htmlContent += '</table>';

    // Create blob and download
    this.downloadFile(htmlContent, filename, 'application/vnd.ms-excel');
  }

  /**
   * Download file from content
   * @param content File content
   * @param filename Output filename
   * @param contentType MIME type
   */
  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.${contentType.includes('csv') ? 'csv' : 'xls'}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
