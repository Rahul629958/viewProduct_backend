const cheerio = require("cheerio");
const axios = require("axios");

module.exports = async function performScraping(link) {
  var scrapedData = {
    link: "", //link of product
    ImgURL: "", //link of icon (img)
    Title: "", //title of product
    Highlights: "",
    Description: "",
    Taglist: [],
    Plan: "", //free or paid plan of product
    VideoURL: "", //video icon
    DemoList: [], //demo images/videos
    CountVid: 0, //number of videos in demo list
  };

  try {
    //fetching the html code from provided link.
    const axiosResponse = await axios.request({
      method: "GET",
      url: link,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    //loading that html in cheeio for data fetching
    var $ = cheerio.load(axiosResponse.data);

    //fetching all the relevant data
    var imgURL = $(".styles_mediaThumbnail__LDCQN").attr("src");
    var posterURL = $(".styles_mediaThumbnail__LDCQN").attr("poster");

    if (!imgURL) {
      scrapedData.VideoURL = $(".styles_mediaThumbnail__LDCQN")
        .find("source")
        .attr("src");
    }

    var ImgURL = imgURL ? imgURL : posterURL;

    var tagList = [];
    $(".styles_reset__opz7w").each((index, element) => {
      var tagVal = $(element).find("span").text();
      if (tagVal) {
        tagList.push(tagVal);
      }
    });

    var demoList = [];
    var countVidDemo = 0;
    $(".styles_image__aoRne").each((index, element) => {
      var demoVal = $(element).attr("src");
      if ($(element).hasClass("styles_videoImage__Afvws")) {
        countVidDemo = countVidDemo + 1;
      }
      if (demoVal) {
        demoList.push(demoVal);
      }
    });

    scrapedData.link = link;
    scrapedData.ImgURL = ImgURL;
    scrapedData.Title = $("h1").text();
    scrapedData.Highlights = $("h2").text();
    scrapedData.Description = $(
      ".styles_htmlText__d6xln, .color-darker-grey fontSize-16 fontWeight-400"
    ).text();
    scrapedData.Taglist = tagList;
    scrapedData.Plan = $('div[data-test="pricing-type"]').text();
    scrapedData.DemoList = demoList;
    scrapedData.CountVid = countVidDemo;

    return scrapedData;
  } catch (error) {
    //handling the error produced while scrapping the web
    scrapedData.link = "";
    scrapedData.ImgURL =
      "https://media.giphy.com/media/3osxY9kuM2NGUfvThe/giphy.gif";
    scrapedData.Title =
      "Error ! Something wrong with product link, please recheck :(";
    scrapedData.Highlights = "";
    scrapedData.Description =
      "Make sure you've entered correct link of product. It should be in format: 'https://www.producthunt.com/posts/product_name'";
    scrapedData.Taglist = [". . ."];
    scrapedData.Plan = "Free";

    return scrapedData;
  }
};
