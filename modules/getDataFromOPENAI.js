const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.API_KEY
});

const openai = new OpenAIApi(configuration);

module.exports = async function getDataFromOPENAI(prompt) {
  try{
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 1,
    max_tokens: 1000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  return response.data.choices[0];
}
catch
{
  console.error()
  return {text:"***** Error Error"};
}
  
}
