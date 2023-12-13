const { SlashCommandBuilder } = require("discord.js");
const { Overview } = require("../app");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("overview")
    .setDescription("Gives a description about the given image")
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("URL or Base64 Code to the image")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("risk-factor")
        .setDescription(
          "Select a value from 0-1 to determine how strongly the bot will consider its answers"
        )
        .setRequired(false)
    ),
  async execute(interaction) {
    const { _hoistedOptions: interactionOptions } = interaction.options;
    const imageSrc = interactionOptions[0];
    const risk = interactionOptions[1] === undefined ? 0.4 : interactionOptions[1];

    console.log(imageSrc, risk)

    try {
      const gptResponse = await Overview(imageSrc.value, parseFloat(risk.value));
      await interaction.reply(gptResponse.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  },
};
