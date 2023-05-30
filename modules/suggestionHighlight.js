const getDataFromOPENAI = require("./getDataFromOPENAI");

function isNumber(char) {
  return /^\d+$/.test(char);
}

module.exports = async function suggestionHighlight(scrapedData) {
  const highlights = scrapedData.Highlights;
  const description = scrapedData.Description;

  const prompt =
    "suggest 10 better one line(less than 12 words each) description similar to but better than '" +
    highlights +
    "'. for a product with description : '" +
    description +
    "'";
  //getting data from openai
  const text = (await getDataFromOPENAI(prompt)).text;
  //formatting the openai response in representable way
  const textArr = text.split(/[\n]/);

  var finalArr = [];
  for (var i = 0; i < textArr.length; i++) {

    var str = textArr[i];
    if(str.length>=4){
    var i_str = 0;
    while (i_str < str.length && isNumber(str[i_str])) {
      i_str++;
    }
    if (i_str < str.length) {
      str = str.substring(i_str + 2, str.length);
    }
    finalArr.push(str);
  }
  }

  return finalArr;
};
