function doGet(e) {
  // This function serves the main HTML page of the web app.
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Proforma Invoice Generator')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  // This helper function allows us to include other HTML files (like our JS and CSS).
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getProductMasterData() {
  // The File ID for your 'product_master.csv' in Google Drive
  const fileId = '1A0MMiUarAH-JWcqgpy5NHPJLOOOF17ga'; 
  const file = DriveApp.getFileById(fileId);
  const csvData = Utilities.parseCsv(file.getBlob().getDataAsString());
  const headers = csvData[0];
  return csvData.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = row[i] ? row[i].trim() : "");
    return obj;
  });
}

function saveDataToSheet(invoiceData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = "Proforma Invoices";
    let sheet = ss.getSheetByName(sheetName);

    // If the sheet doesn't exist, create it and add headers.
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const headers = [
        "Timestamp", "PI Number", "PI Date", "Valid Till", "Client Company", "Client Name",
        "Currency", "Item Particulars", "Thickness (mm)", "Length (ft)", "Breadth (ft)",
        "Qty (Sheets)", "Qty (Sq.ft)", "Rate/SqFt", "Item Amount", "Subtotal", "Tax Amount", "Grand Total"
      ];
      sheet.appendRow(headers);
      sheet.getRange("A1:R1").setFontWeight("bold");
    }
    
    const timestamp = new Date();

    // Loop through each item in the invoice and create a row for it.
    invoiceData.items.forEach(item => {
      const row = [
        timestamp,
        invoiceData.invoiceNumber,
        invoiceData.invoiceDate,
        invoiceData.validTill,
        invoiceData.clientCompany,
        invoiceData.clientName,
        invoiceData.currency,
        item.particulars,
        item.thickness,
        item.length,
        item.breadth,
        item.qtySheets,
        parseFloat(item.qtySqft),
        item.rate,
        parseFloat(item.amount),
        parseFloat(invoiceData.subtotal),
        parseFloat(invoiceData.taxAmount),
        parseFloat(invoiceData.grandTotal)
      ];
      sheet.appendRow(row);
    });

    return "✅ Invoice " + invoiceData.invoiceNumber + " saved successfully!";
  } catch (e) {
    return "❌ Error: " + e.message;
  }
}