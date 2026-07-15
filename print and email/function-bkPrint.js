function bkPrint() {
  const summary = document.getElementById("container4");

  if (!summary) {
    alert("Summary container not found — cannot print.");
    return;
  }

  const html = `
    <html>
      <head>
        <title>Booking Summary</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { font-size: 20px; margin-bottom: 10px; }
          .section { margin-bottom: 15px; }
        </style>
      </head>
      <body>
        ${summary.innerHTML}
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=900,height=700");

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = function () {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
}
