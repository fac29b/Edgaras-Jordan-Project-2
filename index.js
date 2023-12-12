// Load environment variables from a .env file
require("dotenv").config();
const path = require("path");
const fs = require("fs");
// Import main();
const { GenerateMessage, GenerateImage } = require("./app");
// Import necessary modules from the discord.js library
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

// Create a new instance of the Discord client
const client = new Client({
  // Specify the gateway intents that the bot will use
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

// Stored messages in the channel
let channelUserMessage = [];
// Stored diorect messages
let directUserMessage = [];

// Define the command prefix for the bot
const prefix = ["!bot", "!design"];

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
    if (message.content.startsWith(`${prefix[0]}`)) {
      message.channel.sendTyping();
      // Checks if message is dirrect
      if (message.channel.type === 1) {
        // Check if the user already exists in directUserMessage
        directUserMessage.some(
          (user) => user.username === message.author.username
        )
          ? directUserMessage
              .find((user) => user.username === message.author.username)
              .conversation.push({
                role: `user`,
                content: `${message.content}`,
              })
          : directUserMessage.push({
              username: `${message.author.username}`,
              conversation: [{ role: `user`, content: `${message.content}` }],
            });
        GenerateMessage(directUserMessage, message);
        return;
      } else if (message.channel.type === 0) {
        // Check if the user already exists in userMessage
        channelUserMessage.some(
          (user) => user.username === message.author.username
        )
          ? channelUserMessage
              .find((user) => user.username === message.author.username)
              .conversation.push({
                role: `user`,
                content: `${message.content}`,
              })
          : channelUserMessage.push({
              username: `${message.author.username}`,
              conversation: [{ role: `user`, content: `${message.content}` }],
            });
        GenerateMessage(channelUserMessage, message);
        return;
      }
    } else if (message.content.startsWith(`${prefix[1]}`)) {
      message.channel.sendTyping();
      GenerateImage(message);
    }
  } catch (error) {
    // Log any errors that occur during message processing
    console.log(error);
  }
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Log in to Discord using the provided token from the environment variables
client.login(process.env.DISCORD_TOKEN);
