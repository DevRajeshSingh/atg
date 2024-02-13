const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

let data = {
  mode: "normal",
  on: false,
  waterPercentage: 0,
};

// Function to read data from file
const readDataFromFile = () => {
  try {
    const jsonData = fs.readFileSync("data.json", "utf8");
    return JSON.parse(jsonData);
  } catch (error) {
    console.error("Error reading data from file:", error);
    return null;
  }
};

// Function to write data to file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing data to file:", error);
  }
};

// Initialize data from file
data = readDataFromFile() || data;

app.get("/", (req, res) => {
  res.render("index", { data });
});

app.post("/update", (req, res) => {
  const { mode, on } = req.body;
  data.mode = mode;
  data.on = on === "on";
  writeDataToFile(data); // Update data in file
  res.redirect("/");
});

app.get("/updateWaterPercentage/:percent", (req, res) => {
  const { percent } = req.params;
  data.waterPercentage = parseFloat(percent);
  writeDataToFile(data); // Update data in file
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
