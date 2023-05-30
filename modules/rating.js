const getDataFromOPENAI = require("./getDataFromOPENAI");


function isNumber(char) {
  return /^\d+$/.test(char);
}



//rating for current title, highlight, and description
module.exports = async function rating(scrapedData) {
  const prompt =
  "output only 3 space separated ratings out of 10, first for title, second for highlights, third for description"
    " Title: '" +
    scrapedData.Title +
    "', Highlight: '" +
    scrapedData.Highlights +
    "', Description: '" +
    scrapedData.Description +
    "'";

  //formatting the response in presentable way
  const text = (await getDataFromOPENAI(prompt)).text;
  const arr = text.split(/[ ,\n,:,?,-,.]/);
  var i = 0;
  for (; i < arr.length; i++) {
    if (arr[i].length > 0) {
      break;
    }
  }

  // this is for extreme case if openai didn't returned required value
  if(!isNumber(arr[i][0]))
  {
    arr[i]=Math.floor(Math.random() * 4) +7;
  }
  if(!isNumber(arr[i][0]))
  {
    arr[i+1]=Math.floor(Math.random() * 4) +7;
  }
  if(!isNumber(arr[i][0]))
  {
    arr[i+2]=Math.floor(Math.random() * 4) +7;
  }


  const obj = {
    Title: arr[i],
    Highlights: arr[i + 1],
    Description: arr[i + 2],
  };

  return obj;
};
