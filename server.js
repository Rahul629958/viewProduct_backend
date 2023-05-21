// index.js
const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);

async function SuggTags(scrapedData) {
  const description = scrapedData.Description;
  const responseSugg = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "suggest 5 better tag(single word) for product with description " +
      description,
    // prompt: "say this is test",
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const text = responseSugg.data.choices[0].text;
  const textArr = text.split(/[\n,.,:]/);

  //  console.log(textArr);
  var finalArr = [];
  const size = textArr.length;
  for (var i = 0; i < size; i++) {
    while (i < size && textArr[i].length < 3) {
      i++;
    }
    if (i < size) {
      finalArr.push(textArr[i]);
    }
  }
  // console.log(finalArr);
  return finalArr;
}

async function SuggTitle(scrapedData) {
  const title = scrapedData.Title;
  const highlights = scrapedData.Highlights;
  const responseSugg = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "suggest 10 better Titles (1- 2 words) than " +
      title +
      " for a product with description : " +
      highlights +
      " and give them rating out of 10, format should be title: single digit rating out of 10,no other symbols or format in required",
    // prompt: "say this is test",
    temperature: 0,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const text = responseSugg.data.choices[0].text;
  const textArr = text.split(/[., ,:,\n,(,),/,-]/);
  // console.log(textArr);
  // console.log(textArr);
  var FinalArr = [];
  const size = textArr.length;
  for (var i = 0; i < size; i++) {
    var data = "Loading";
    var rating = "10";
    while (i < size && textArr[i].length <= 2) {
      i++;
    }
    if (i < size) {
      data = textArr[i];
      i++;
    }
    while (i < size && textArr[i].length < 1) {
      i++;
    }

    if (i < size) {
      if (textArr[i].length > 2) {
        data = data.concat(" ", textArr[i]);
        i++;
        while (i < size && textArr[i].length < 1) {
          i++;
        }
        if (i < size) {
          rating = textArr[i];
        }
      } else {
        rating = textArr[i];
      }
    }
    if(i<size){
    var obj = {
      data: data,
      rating: rating,
    };
    FinalArr.push(obj);}
  }

  // console.log(FinalArr);
  return FinalArr;
}

async function SuggHighlight(scrapedData) {
  const highlights = scrapedData.Highlights;
  const description = scrapedData.Description;
  const responseSugg = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "suggest 10 better one line(less than 12 words) description similar to but better than " +
      highlights +
      ". for a product with description : " +
      description +
      "",
    // prompt: "say this is test",
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const text = responseSugg.data.choices[0].text;
  const textArr = text.split(/[\n]/);

  // console.log(textArr);
  var finalArr = [];
  for (var i = 2; i < 12; i++) {
    var str;
    if (i == 11) {
      str = textArr[i].substring(4, textArr[i].length);
    } else {
      str = textArr[i].substring(3, textArr[i].length);
    }
    finalArr.push(str);
  }
  //  return FinalArr;
  // console.log(finalArr);
  return finalArr;
}

async function SuggDescription(scrapedData) {
  const highlights = scrapedData.Highlights;
  const description = scrapedData.Description;
  const responseSugg = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "suggest 10 better description  (less than 70 words) similar to but better than " +
      description +
      ". for a product with highlight : " +
      highlights +
      "",
    // prompt: "say this is test",
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const text = responseSugg.data.choices[0].text;
  const textArr = text.split(/[\n]/);

  //  console.log(textArr);
  var finalArr = [];
  var maxLim = 12;
  for (var i = 2; i < maxLim; i++) {
    var str;
    if (i == maxLim - 1) {
      str = textArr[i].substring(4, textArr[i].length);
    } else {
      str = textArr[i].substring(3, textArr[i].length);
    }
    if (str.length > 1) {
      finalArr.push(str);
    } else {
      maxLim++;
    }
  }
  //  return FinalArr;
  // console.log(finalArr);
  // return finalArr;
  return finalArr;
}

async function responseFunc(scrapedData) {
  const responseFromOpenAI = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "Title: " +
      scrapedData.Title +
      ", Highlight: " +
      scrapedData.Highlights +
      ", Description: " +
      scrapedData.Description +
      "\n output only 3 space separated ratings out of 10, first for title, second for highlights, third for description",
    // prompt: "say this is test",
    temperature: 1,
    max_tokens: 50,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const text = responseFromOpenAI.data.choices[0].text;
  const arr = text.split(/[ ,\n,:,?,-]/);
  var i = 0;
  for (; i < arr.length; i++) {
    if (arr[i].length > 0) {
      break;
    }
  }
  const obj = {
    Title: arr[i],
    Highlights: arr[i + 1],
    Description: arr[i + 2],
  };

  // console.log(obj);
  // console.log(i);
  return obj;
}

const PORT = process.env.PORT || 8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const cheerio = require("cheerio");
const axios = require("axios");

let scrapedData = {}; // define scrapedData outside of performScraping()
let linkObj = {};




let correctionCheck=true;

async function performScraping(link) {
 let axiosResponse;
  try{
 axiosResponse = await axios.request({
    method: "GET",
    url: link,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
    },
  }); correctionCheck=true;}
  catch(error)
  {
    correctionCheck=false;
    console.log("Error generated");
  }


  

  if(correctionCheck){


  var $ = cheerio.load(axiosResponse.data);







  var imgURL = $(".styles_mediaThumbnail__LDCQN").attr("src");
  var posterURL = $(".styles_mediaThumbnail__LDCQN").attr("poster");

  var ImgURL = imgURL ? imgURL : posterURL;
  var titleName = $("h1").text();
  var highlightName = $("h2").text();
  var descriptionName = $(
    ".styles_htmlText__d6xln, .color-darker-grey fontSize-16 fontWeight-400"
  ).text();

  var tagList = [];
  $(".styles_reset__opz7w").each((index, element) => {
    var tagVal = $(element).find("span").text();
    if (tagVal) {
      tagList.push(tagVal);
    }
  });



  var paymentReq = $('div[data-test="pricing-type"]').text();


}else
{
  var titleName="Error ! Something wrong with product link, please recheck :(";
 var ImgURL="";
 var highlightName="";
  var descriptionName="Make sure you've entered correct link of product. It should be in format: 'https://www.producthunt.com/posts/product_name'";
  var link="";
  var tagList=[". . ."];
 var paymentReq="Free";

  
}

  scrapedData = {
    link: link,
    ImgURL: ImgURL,
    Title: titleName,
    Highlights: highlightName,
    Description: descriptionName,
    Taglist: tagList,
    Plan:paymentReq
  };

  return scrapedData;
}

async function setLink(link) {
  linkObj = {
    link: link,
  };
}

app.post("/", async (req, res) => {
  try {
    // const scrapedData = await performScraping(req.body.link);
    setLink(req.body.link);
    res.json(linkObj);
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while scraping the data.");
  }
});

app.get("/", async function (req, res) {
  scrapedData = await performScraping(linkObj.link);

  const response = await responseFunc(scrapedData);
  // const response= { Title: '7', Highlights: '5', Description: '8' };
  // scrapedData = {
  //   link: "",
  //   ImgURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/330px-Image_created_with_a_mobile_phone.png",
  //   Title: "This is name",
  //   Highlights: "This is highlight for this product",
  //   Description: "This is description for this product, it shhould be long enough.",
  //   Taglist: ["first","second","third"],
  // };

  scrapedData = {
    ...scrapedData,
    Response: response,
  };

  // console.log(scrapedData);
  res.json(scrapedData);
});

app.get("/data", async function (req, res) {
  const suggTitleArr = await SuggTitle(scrapedData);
  // const suggTitleArr=[
  //   { data: 'AI-Master', rating: '10' },
  //   { data: 'AI-Advisor', rating: '10' },
  //   { data: 'AI-Guide', rating: '10' },
  //   { data: 'AI-Expert', rating: '10' },
  //   { data: 'AI-Mentor', rating: '10' },
  //   { data: 'AI-Instructor', rating: '10' },
  //   { data: 'AI-Teacher', rating: '10' },
  //   { data: 'AI-Coach', rating: '10' },
  //   { data: 'AI-Tutor', rating: '10' },
  //   { data: 'AI-Helper', rating: '10' }
  // ];
  // const suggHighlights = [
  //   'Take control of GPT-4 with my AI tool - own and make money.',
  //   'Be productive - access GPT-4 from anywhere with my AI tool.',
  //   'Step up productivity with my AI tool and GPT-4.',
  //   'Source code and control - unlock GPT-4 with my AI tool.',
  //   'GPT-4 ease of use - sync with my AI tool.',
  //   'Stop swiping tabs - access GPT-4 with own AI tool.',
  //   'Increase output - integrate GPT-4 with my AI tool.',
  //   'Monetize your logic - get ownership of my AI tool.',
  //   'Make your work flow - access GPT-4 with my AI tool.',
  //   'Be productive and make income - my AI tool and GPT-4.'
  // ];
  const suggTags = await SuggTags(scrapedData);
  // const suggTags =[
  //   'Tags',
  //   ' GPT-4 ',
  //   ' AI ',
  //   ' Productivity ',
  //   ' Automation ',
  //   ' Earnings'
  // ];
  // const suggDescription = ["this", "is", "description"];
  const suggHighlights = await SuggHighlight(scrapedData);
  const suggDescription = await SuggDescription(scrapedData);
  const object = {
    SuggTags: suggTags,
    suggTitle: suggTitleArr,
    SuggHighlights: suggHighlights,
    SuggDescription: suggDescription,
  };
  res.json(object);
});

// app.use(express.static(path.join(__dirname+ "/public")))
app.listen(PORT, function (req, res) {
  console.log("Server is running on port : " + PORT);
});
