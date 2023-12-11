require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const main = async (userMessage, message) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: userMessage.some(
      (user) => user.username === message.author.username
    )
      ? userMessage.find((user) => user.username === message.author.username)
          .conversation
      : [{ role: "user", content: `${message.content}` }],
    max_tokens: 400, // 400 limit is set because Discord has limit on the reply length that is (2000)
    temperature: 1,
    // stream: true
  });
  // Update userMessage with the system message from GPT
  if (userMessage.some((user) => user.username === message.author.username)) {
    const userIndex = userMessage.findIndex(
      (user) => user.username === message.author.username
    );
    userMessage[userIndex].conversation.push({
      role: `system`,
      content: `${response.choices[0].message.content}`,
    });
  }
  // Type = 0 is channel, Type = 1 is direct message
  if (message.channel.type === 0) {
    message.channel.send(`${response.choices[0].message.content}`);
  } else if (message.channel.type === 1) {
    message.author.send(`${response.choices[0].message.content}`);
  }
};
// Generates images using openai
const GenerateImage = async (message) => {
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: message.content,
    size: "256x256",
    n: 1,
  });
  // imageData is image url
  const imageData = response.data[0].url;
  // Type = 0 is channel, Type = 1 is direct message
  if (message.channel.type === 0) {
    message.channel.send({
      files: [{ attachment: imageData, name: "image.png" }],
    });
  } else if (message.channel.type === 1) {
    message.author.send({
      files: [{ attachment: imageData, name: "image.png" }],
    });
  }
};

// Export functions to use in different files
module.exports = { main, GenerateImage };
