const { SlashCommandBuilder } = require("discord.js");
const { ListColours } = require("../app");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("list_colours")
    .setDescription("Reveals all colours within an image")
    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("URL or Base64 Code to the image")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("colour-format")
        .setDescription("Select colour format")
        .setRequired(false)
        .addChoices(
          { name: "HEX", value: "HEX" },
          { name: "RGB", value: "RGB" },
          { name: "PMS", value: "PMS" }
        )
    ),
  async execute(interaction) {
    const { _hoistedOptions: interactionOptions } = interaction.options;
    const imageSrc = interactionOptions[0];
    try {
      const gptResponse = await ListColours(imageSrc.value);
      await interaction.reply(gptResponse.choices[0].message.content);
    } catch (error) {
      console.log(error);
    }
  },
};
