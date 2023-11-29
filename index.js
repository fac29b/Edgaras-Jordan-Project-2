// Load environment variables from a .env file
require("dotenv").config();
// Import main();
const main = require("./app");
// Import necessary modules from the discord.js library
const { Client, GatewayIntentBits } = require("discord.js");

// Create a new instance of the Discord client
const client = new Client({
  // Specify the gateway intents that the bot will use
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Define the command prefix for the bot
const prefix = "!";

// Event listener for when the bot is ready and connected
client.once("ready", () => {
  console.log(`Bot is now connected.`);
});

let userMessage = [];

// Event listener for when a message is created in a guild
client.on("messageCreate", async function (message) {
  try {
    // Ignore messages from other bots
    if (message.author.bot) return;

    // Check if the message starts with the specified command prefix
    if (message.content.startsWith(`${prefix}`)) {
      // Check if the user already exists in userMessage
      userMessage.some((user) => user.username === message.author.username)
        ? userMessage
            .find((user) => user.username === message.author.username)
            .conversation.push({ role: `user`, content: `${message.content}` })
        : userMessage.push({
            username: `${message.author.username}`,
            conversation: [{ role: `user`, content: `${message.content}` }],
          });
      // GPT Response
      main(userMessage, message);
    }
  } catch (error) {
    // Log any errors that occur during message processing
    console.log(error);
  }
});

// Log in to Discord using the provided token from the environment variables
client.login(process.env.DISCORD_TOKEN);
