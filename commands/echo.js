const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  data: {
    name: 'echo',
    description: '指定したメッセージを指定したチャンネルに送信します。',
    options: [
      {
        name: 'message',
        description: '送信するメッセージ',
        type: 'STRING',
        required: true,
      },
      {
        name: 'channel',
        description: 'メッセージを送信するチャンネル',
        type: 'CHANNEL',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const message = interaction.options.getString('message');
    const channel = interaction.options.getChannel('channel');
    if (interaction.user.id !== process.env.ADMIN) {
      await interaction.reply({ content: '権限がありません。', ephemeral: true });
      return
    }

    try {
      await channel.send(message);
      await interaction.reply({
        content: 'メッセージを送信しました。',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'メッセージの送信中にエラーが発生しました。',
        ephemeral: true,
      });
    }
  },
};
