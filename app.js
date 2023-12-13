require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const GenerateMessage = async (userMessage, message) => {
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
const GenerateImage = async (
  message,
  descriptionValue,
  styleValue,
  additionalValue,
  nameValue,
  sizeValue
) => {
  const response = await openai.images.generate({
    model: "dall-e-2",
    prompt: `Description: ${descriptionValue}\nImage style: ${styleValue}\nAdditional information about image: ${additionalValue}`,
    size: sizeValue,
    n: 1,
  });
  // imageData is image url
  const imageData = response.data[0].url;
  // Type = 0 is channel, Type = 1 is direct message
  if (message.channel.type === 0) {
    message.channel.send({
      files: [{ attachment: imageData, name: `${nameValue}.png` }],
    });
  } else if (message.channel.type === 1) {
    message.author.send({
      files: [{ attachment: imageData, name: `${nameValue}.png` }],
    });
  }
};
const ListColours = async (imageSrc) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Give me a list of all the colours used in this image.`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageSrc,
            },
          },
        ],
      },
    ],
  });
  return response;
};

const Overview = async (imageSrc, riskFactor) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    // max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Give me a summary of the given image.`,
          },
          {
            type: "image_url",
            image_url: {
              url: imageSrc,
            },
          },
        ],
      },
    ],
    temperature: riskFactor,
  });
  return response;
};

// Export functions to use in different files
module.exports = { GenerateMessage, GenerateImage, ListColours, Overview };
