// Load environment variables from a .env file
require("dotenv").config();

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

// Event listener for when a message is created in a guild
client.on("messageCreate", async function (message) {
  try {
    // Ignore messages from other bots
    if (message.author.bot) return;

    // Check if the message starts with the specified command prefix
    if (message.content.startsWith(`${prefix}`)) {
      // Reply to the message with the author's global name and the content of the message
      message.reply(`${message.author.globalName} message: ${message}`);
    }
  } catch (error) {
    // Log any errors that occur during message processing
    console.log(error);
  }
});

// Log in to Discord using the provided token from the environment variables
client.login(process.env.DISCORD_TOKEN);
