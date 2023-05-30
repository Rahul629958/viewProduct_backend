const getDataFromOPENAI = require("./getDataFromOPENAI");

module.exports = async function suggestionTags(scrapedData) {
  const description = scrapedData.Description;

  const prompt =
    "output 5 suggested tag words(strictly 1 word each(use hyphen in between words only if it is more than one word)) for product with description: '" + description+"'";

  //getting data from openai api
  const text = (await getDataFromOPENAI(prompt)).text;

  //formatting the data in representable way
  var textArr = text.split(/[\n,.,: ,#]/);

  var finalArr = [];
  const size = textArr.length;
  for (var i = 0; i < size; i++) {
    while (i < size && textArr[i].length < 3) {
      i++;
    }
    if (i < size) {
      if(textArr[i][1]=='-')
      {
        textArr[i]=textArr[i].substring(2,textArr[i].length);
      }
      finalArr.push(textArr[i]);
    }
  }
  return finalArr;
};
