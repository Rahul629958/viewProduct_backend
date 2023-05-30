// index.js
const express = require("express");
const cors = require("cors");

const scraping = require("./modules/scrapeData");
const suggestionTitle = require("./modules/suggestionTitle");
const suggestionHighlight = require("./modules/suggestionHighlight");
const suggestionDescription = require("./modules/suggestionDescription");
const suggestionTag = require("./modules/suggestionTag");
const rating = require("./modules/rating");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.post("/", async (req, res) => {
  try {
    var scrapedData = await scraping(req.body.link);
    var response = await rating(scrapedData);

    scrapedData = {
      ...scrapedData,
      Response: response,
    };
    res.json(scrapedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while scraping the data.");
  }
});

app.post("/data", async function (req, res) {
  const suggTitleArr = await suggestionTitle(req.body);
  const suggTags = await suggestionTag(req.body);
  const suggHighlights = await suggestionHighlight(req.body);
  const suggDescription = await suggestionDescription(req.body);

  const object = {
    SuggTags: suggTags,
    suggTitle: suggTitleArr,
    SuggHighlights: suggHighlights,
    SuggDescription: suggDescription,
  };

  res.json(object);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, function (req, res) {
  console.log("Server is running on port : " + PORT);
});
