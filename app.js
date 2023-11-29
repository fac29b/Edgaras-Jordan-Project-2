require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG,
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
  message.reply(
    `[${message.author.globalName}] - ${response.choices[0].message.content}`
  ); // Console log response
  console.log(response.choices);
  return;
};

// Export main()
module.exports = main;
