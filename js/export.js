function exportTableData(format) {
    // Get data from Tabulator
    const data = table.getData(); // array of objects
  
    // Convert array-of-objects back to an array-of-arrays if we used "field0", "field1", etc.
    // Alternatively, if your table columns are named something else, adjust accordingly.
    // Let's first figure out the distinct fields in order from the table columns:
    const columns = table.getColumns();
    const fieldNames = columns.map(col => col.getField());
    // Create an array-of-arrays
    // First row: column headers
    const sheetData = [fieldNames];
    // Then each row
    data.forEach(row => {
      const rowArr = fieldNames.map(field => row[field]);
      sheetData.push(rowArr);
    });
  
    // Create a SheetJS worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Write file
    if (format === "xlsx") {
      XLSX.writeFile(workbook, "output.xlsx");
    } else if (format === "csv") {
      XLSX.writeFile(workbook, "output.csv", { bookType: "csv" });
    }
  }