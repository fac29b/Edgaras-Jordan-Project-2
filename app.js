require('dotenv').config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.apiKey,
});

const main = async () => {
  const response = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "" },
      { role: "user", content: "" },
    ],
    model: "gpt-3.5-turbo",
    temperature: 1,
    // stream: true
  });

  console.log(response.choices);
};

main();