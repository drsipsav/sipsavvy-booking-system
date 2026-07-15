// js/features/pdfExport.js
// --------------------------------------------------
// Unified PDF Export Engine
// Used by BOTH Booking Modal + Customer Profile Modal
// --------------------------------------------------

/**
 * Exports a timeline container as a printable PDF.
 * Opens a new window, injects HTML, and triggers print().
 *
 * @param {HTMLElement} timelineContainer - The UL element containing timeline items
 * @param {string} title - Title displayed at the top of the PDF
 */
export function exportTimelinePDF(timelineContainer, title = "Timeline") {
  if (!timelineContainer) return;

  const timelineHTML = timelineContainer.innerHTML;

  const win = window.open("", "_blank");
  win.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            padding: 20px; 
            color: #333;
          }
          h2 { 
            color: #5C1228; 
            margin-bottom: 20px;
          }
          ul { 
            list-style: none; 
            padding: 0; 
          }
          li { 
            margin-bottom: 12px; 
            font-size: 14px;
          }
          small {
            color: #666;
          }
        </style>
      </head>
      <body>
        <h2>${title}</h2>
        <ul>${timelineHTML}</ul>
      </body>
    </html>
  `);

  win.document.close();
  win.print();
}
