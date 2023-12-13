module.exports = (client) => {
  const channelId = "1184530865590632448";
  client.on("guildMemberAdd", (member) => {
    const message = `Welcome to the Server! <@${member.id}> 🎉\n\nShort explanation of my capabilities:\n\n🤖 **Slash Commands:**\n- **/ping:** Returns "pong" to check if the bot is responsive.\n- **/design:** Generates an image using AI image generator.\n- **/list_colours:** This feature tells you the associated colours within an image sent via a URL or base64 code.\n\n💬 **Talk to the AI:**\n- Use **!bot** 'text text text' to have a conversation with the AI. The AI will respond based on the input.\n\nFeel free to explore and enjoy your time in the server! If you have any questions or need assistance, don't hesitate to ask. Have a great time! 😊`;

    const channel = member.guild.channels.cache.get(channelId);

    channel.send(message);
  });
};
