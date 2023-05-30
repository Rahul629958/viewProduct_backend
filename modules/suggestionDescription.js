const getDataFromOPENAI = require("./getDataFromOPENAI");

function isNumber(char) {
  return /^\d+$/.test(char);
}

module.exports = async function SuggDescription(scrapedData) {
  const highlights = scrapedData.Highlights;
  const description = scrapedData.Description;

  const prompt =
    "suggest 10 better description  (strictly between 35 to 80 words) similar to but better than " +
    description +
    ". for a product with highlight : " +
    highlights +
    "";
  //getting data from openai
  const text = (await getDataFromOPENAI(prompt)).text;
  //formatting the response in representable way
  const textArr = text.split(/[\n]/);

  const size = textArr.length;
  var finalArr = [];

  for (var i = 0; i < size; i++) {

   var str = textArr[i];
    if(str.length>=45){
    var i_str = 0;
   var isFirstNum=false;
    while (i_str < str.length && isNumber(str[i_str])) {
      i_str++;
      isFirstNum=true;
    }
    if (i_str < str.length && isFirstNum) {
      str = str.substring(i_str + 2, str.length);
    }
    finalArr.push(str);
  }
}

  return finalArr;
};
