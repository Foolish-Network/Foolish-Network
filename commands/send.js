const { CommandInteraction, MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  data: {
    name: 'send',
    description: '他のユーザーにDMを送信します。',
    options: [
      {
        name: 'user',
        description: '宛先ユーザー',
        type: 'USER',
        required: true,
      },
      {
        name: 'message',
        description: '送信するメッセージ',
        type: 'STRING',
        required: true,
      },
    ],
  },
  async execute(interaction = new CommandInteraction()) {
    try {
      const adminID = process.env.ADMIN;
      const user = interaction.options.getUser('user');
      const messageContent = interaction.options.getString('message');

      if (interaction.user.id !== adminID) {
        await interaction.reply('このコマンドは管理者のみが使用できます。');
        return;
      }

      await user.send(messageContent);

      await interaction.reply(`ユーザーにDMを送信しました: ${messageContent}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('DMの送信中にエラーが発生しました。');
    }
  },
};
