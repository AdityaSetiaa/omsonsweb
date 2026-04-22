const XLSX = require("xlsx");
const fs = require("fs");

// load file
const workbook = XLSX.readFile("C:/Users/jojon/job work/omsons/frontend/public/data/nested_products.csv");

// get first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// convert to JSON
const data = XLSX.utils.sheet_to_json(sheet);

// group by main SKU (e.g., 163, 164)
const grouped = {};

data.forEach((row) => {
  const mainSKU = String(row["CAT NO"]).split("/")[0];

  if (!grouped[mainSKU]) {
    grouped[mainSKU] = {
      SKU: Number(mainSKU),
      Name: row["PRODUCT NAME"] || "",
      "Short description": row["SHORT DESCRIPTION"] || "",
      Description: row["DESCRIPTION"] || "",
      variants: []
    };
  }

  grouped[mainSKU].variants.push({
    SKU: row["CAT NO"],
    Name: `${row["PRODUCT NAME"]} - ${row["CAT NO"]}`,
    socket_size: row["SOCKET SIZE"],
    cone_size: row["CONE SIZE"],
    pack_of: row["PACK OF"],
    price: row["PRICE"] || 0,
    images: row["IMAGE"] ? [row["IMAGE"]] : [],
    "Short description": "",
    Description: ""
  });
});

// final output
const result = Object.values(grouped);

// save file
fs.writeFileSync("output.json", JSON.stringify(result, null, 2));

console.log("JSON file created: output.json");