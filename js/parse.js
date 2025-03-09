function createHeader(headers) {
    let columnHeaders = [];
    for (const column of headers) {
      if (column.toLowerCase() === "links") {
        columnHeaders.push({title: column, field: column, maxWidth: "150px", formatter:linkFormatter});//, editor:"input"});
      } else {
        columnHeaders.push({title: column, field: column});//, editor:"input"});
      }
    }
    return columnHeaders;
}

var linkFormatter = function(cell, formatterParams, onRendered){
    const value = cell.getValue();
    let result = "";
    if (value) {
      const valArr = value.split(":");
      if (valArr[0].startsWith("http")) {
        result = `<a target="_blank" href='${value}'>Website</a><br />`
      } else if (valArr[0] === "youtube") {
        result = `<a target="_blank" href='https://www.youtube.com/watch?v=${valArr[1]}'><img class="link-icon" src="images/youtube.svg" /></a>`
      } else {
        console.log(`Unrecognized link type (${valArr[0]})`)
      }
    } //else {
      let row = cell.getRow();
      console.log(row._row.data);
      let artist = (row._row.data.artist) ? row._row.data.artist.replace(/"/g, "").replace(/ /g, "+") : "";
      let song = (row._row.data.song) ? "+" + row._row.data.song.replace(/"/g, "").replace(/ /g, "+") : "";
      result += `<a target="_blank" href="https://www.youtube.com/results?search_query=${artist}${song}"><img class="link-icon" src="images/search.svg" /></a>`
    //}
    return result;
}

function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsText(file, "UTF-8")
  reader.onload = function(evt) {
    // const data = new Uint8Array(evt.target.result);
    // // Parse the file with SheetJS
    // const workbook = XLSX.read(data, { type: "array" });
    
    // // Take the first worksheet
    // const firstSheetName = workbook.SheetNames[0];
    // const worksheet = workbook.Sheets[firstSheetName];
    
    // // Convert worksheet to JSON
    // // { header: 1 } => returns arrays of arrays.
    // // If you want an array of objects with keys from the first row, remove {header:1}.
    // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const csvText = evt.target.result;
    parseCSV(csvText);
 
  // reader.readAsArrayBuffer(file);
  }
}

function loadCsvFromQueryString() {
    const params = new URLSearchParams(window.location.search);
    const csvUrl = params.get("url"); // or whatever name you prefer
    if (!csvUrl) return; // no param, nothing to do
  
    // Attempt to fetch the CSV from csvUrl
    fetch(csvUrl)
      .then(response => {
        // Make sure the fetch was successful
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // Read the data as text (so we preserve UTF-8 characters)
        return response.text();
      })
      .then(csvText => {
        parseCSV(csvText);
      })
      .catch(err => {
        console.error("Error fetching or parsing remote CSV:", err);
        alert("Could not load CSV from the specified URL.");
      });
  }
  
  function parseCSV(textString) {
        // Now parse it with SheetJS, specifying { type: "string" }
        let workbook;
      try {
        workbook = XLSX.read(textString, { type: "string" });
      } catch (err) {
        console.error("Error parsing CSV as UTF-8 text:", err);
        return;
      }
  
      // Access the first sheet, convert to JSON, etc.
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData);
     
      // If you want the first row to be your column headers, remove it from data
      // and let Tabulator use it:
      // e.g.:
      //    let headers = jsonData.shift(); // remove first row
      //    Then build columns from headers, or let autoColumns parse it
      //
  
      let headers = jsonData.shift();
      let metadata = {};
      // Check for comments at top
      while (headers[0].startsWith("#")) {
        let tempMeta = headers[0].substring(1).split(";");
        tempMeta.forEach((metaValue) => {
          let metaKVPair = metaValue.split(":");
          if (metaKVPair.length == 2)
            metadata[metaKVPair[0]] = metaKVPair[1];
        })
        headers = jsonData.shift();
      }
      table.setColumns(createHeader(headers));
      console.log(metadata);
  
      // Rebuild the data to map row arrays to objects, with keys matching header values
      const tabData = jsonData.map((rowArr) => {
        const rowObj = {};
        rowArr.forEach((cellValue, i) => {
          rowObj[headers[i]] = String(cellValue);
        });
        return rowObj;
      });
      
      // Set table data
      table.setData(tabData).then(() => {
        // Enable export buttons
        document.getElementById("saveXLSX").disabled = false;
        document.getElementById("saveCSV").disabled = false;
      });
    }