const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
} = require("discord.js");

const { GenerateImage } = require("../app");

const imageSizes = ["256x256", "512x512", "1024x1024"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("design")
    .setDescription("Design images with the help of AI."),
  async execute(interaction) {
    const modal = new ModalBuilder({
      customId: `imageGenerator-${interaction.user.id}`,
      title: "Generate image",
    });

    const descriptionInput = new TextInputBuilder({
      customId: "descriptionInput",
      label: "Describe the desired image to generate.",
      placeholder: "Description",
      style: TextInputStyle.Paragraph,
    });

    const styleInput = new TextInputBuilder({
      customId: "styleInput",
      label: "Add style to your image.",
      placeholder: "Futuristic, realistic etc.",
      style: TextInputStyle.Short,
    });

    const additionalInput = new TextInputBuilder({
      customId: "additionalInput",
      label: "Additional information about the image.",
      placeholder: "Additional information",
      style: TextInputStyle.Short,
    });

    const nameInput = new TextInputBuilder({
      customId: "nameInput",
      label: "Image name.",
      placeholder: "Name",
      style: TextInputStyle.Short,
    });

    const sizeInput = new TextInputBuilder({
      customId: "sizeInput",
      label: "Image size.",
      placeholder: "256x256, 512x512, 1024x1024",
      style: TextInputStyle.Short,
    });

    const firstActionRow = new ActionRowBuilder().addComponents(
      descriptionInput
    );
    const secondActionRow = new ActionRowBuilder().addComponents(styleInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(
      additionalInput
    );
    const fourthActionRow = new ActionRowBuilder().addComponents(nameInput);
    const fifthActionRow = new ActionRowBuilder().addComponents(sizeInput);

    modal.addComponents(
      firstActionRow,
      secondActionRow,
      thirdActionRow,
      fourthActionRow,
      fifthActionRow
    );

    await interaction.showModal(modal);

    const filter = (interaction) =>
      interaction.customId === `imageGenerator-${interaction.user.id}`;

    interaction
      .awaitModalSubmit({ filter, time: 0 })
      .then((modalInteraction) => {
        const descriptionValue =
          modalInteraction.fields.getTextInputValue("descriptionInput");
        const styleValue =
          modalInteraction.fields.getTextInputValue("styleInput");
        const additionalValue =
          modalInteraction.fields.getTextInputValue("additionalInput");
        const nameValue =
          modalInteraction.fields.getTextInputValue("nameInput");
        const sizeValue =
          modalInteraction.fields.getTextInputValue("sizeInput");

        if (!imageSizes.includes(sizeValue)) {
          modalInteraction.reply({
            content: `**This size [ ${sizeValue} ] is not supported try again.\nSupported sizes: ${imageSizes.join(
              " "
            )}**`,
            ephemeral: true, // Only visible to the user who initiated the interaction
          });
          return;
        }

        modalInteraction.reply({
          content: `Image generator options:\n **Description**: ${descriptionValue}\n **Style**: ${styleValue}\n **Additional information**: ${additionalValue}\n **Image name**: ${nameValue}\n **Image size**: ${sizeValue}`,
          ephemeral: true, // Only visible to the user who initiated the interaction
        });

        GenerateImage(
          interaction,
          descriptionValue,
          styleValue,
          additionalValue,
          nameValue,
          sizeValue
        );
      })
      .catch((error) => {
        console.log(`Error: ${error}`);
      });
  },
};
