const getDataFromOPENAI = require("./getDataFromOPENAI");

module.exports = async function SuggTitle(scrapedData) {
  const title = scrapedData.Title;
  const highlights = scrapedData.Highlights;

  const prompt =
    "suggest 10 better Titles (1- 2 words) than " +
    title +
    " for a product with description : " +
    highlights +
    " and give them rating out of 10, format should be title: single digit rating out of 10,no other symbols or format in required";

  const text = (await getDataFromOPENAI(prompt)).text;

  if (text.includes("Error Error Error")) {
    return [
      { data: "Error", rating: 0 },
      { data: "Error", rating: 0 },
      { data: "Error", rating: 0 },
    ];
  }

  //splitting the response text into different elements of array
  const textArr = text.split(/[., ,:,\n,(,),/,-]/);

  var FinalArr = [];

  const size = textArr.length;

  for (var i = 0; i < size; i++) {
    var data = ""; //data is suggested value of title.
    var rating = "8"; //this is rating of suggested title.

    //ignoring all elements of response(from openai) which are neither suggested title nor rating.
    while (i < size && textArr[i].length <= 2) {
      i++;
    }
    //assigning the value to data
    if (i < size) {
      data = textArr[i];
      i++;
    }
    //searching for next element whose length is more than 1 (i.e., for rating)
    while (i < size && textArr[i].length < 1) {
      i++;
    }

    if (i < size) {
      //considering the case if this element is second word for suggested title (instead of rating)
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
    if (i < size) {
      //creating the object of suggested title, and rating
      var obj = {
        data: data,
        rating: rating,
      };
      //pushing the object into final array
      FinalArr.push(obj);
    }
  }

  // returning final array
  return FinalArr;
};
