// pdfExport.js — Unified PDF Export Engine // Clean, modular, production‑ready // Supports: Booking Timeline + Customer Timeline // Style: Clean Minimal (white, wine headers, gold accents)

/**

Export a timeline container as a printable PDF.

Works for both booking modal + customer modal.



@param {HTMLElement} timelineContainer - UL element containing timeline items

@param {string} title - Title displayed at the top of the PDF */ export function exportTimelinePDF(timelineContainer, title = "Timeline Export") { if (!timelineContainer) return;

const timelineHTML = timelineContainer.innerHTML;

const win = window.open("", "_blank"); win.document.write(` <html> <head> <title>${title}</title> <style> body { font-family: Arial, sans-serif; padding: 24px; background: #ffffff; color: #333; }

yyyyy

      h2 {
        color: #5C1228;
        border-bottom: 2px solid #FFD700;
        padding-bottom: 8px;
        margin-bottom: 20px;
        font-size: 22px;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        margin-bottom: 14px;
        padding: 10px;
        border-left: 4px solid #5C1228;
        background: rgba(92, 18, 40, 0.05);
        border-radius: 6px;
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

yyyyy

`);

win.document.close(); win.print(); }