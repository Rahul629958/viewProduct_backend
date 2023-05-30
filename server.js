// index.js
const express = require("express");
const cors = require("cors");

const scraping = require("./modules/scrapeData");
const suggestionTitle = require("./modules/suggestionTitle");
const suggestionHighlight = require("./modules/suggestionHighlight");
const suggestionDescription = require("./modules/suggestionDescription");
const suggestionTag = require("./modules/suggestionTag");
const rating = require("./modules/rating");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let scrapedData = {}; 
let linkObj = {};

async function setLink(link) {
  linkObj = {
    link: link,//setting the link in serverside
  };
}

app.post("/", async (req, res) => {
  try {
    setLink(req.body.link);
    res.json(linkObj);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while scraping the data.");
  }
});

app.get("/", async function (req, res) {
 
  scrapedData = await scraping(linkObj.link);
  const response = await rating(scrapedData);

  scrapedData = {
    ...scrapedData,
    Response: response,
  };
  res.json(scrapedData);
});

app.get("/data", async function (req, res) {
  const suggTitleArr = await suggestionTitle(scrapedData);
  const suggTags = await suggestionTag(scrapedData);
  const suggHighlights = await suggestionHighlight(scrapedData);
  const suggDescription = await suggestionDescription(scrapedData);

  const object = {
    SuggTags: suggTags,
    suggTitle: suggTitleArr,
    SuggHighlights: suggHighlights,
    SuggDescription: suggDescription,
  };
  res.json(object);
});

app.listen(PORT, function (req, res) {
  console.log("Server is running on port : " + PORT);
});
