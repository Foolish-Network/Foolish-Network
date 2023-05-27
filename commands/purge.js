const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  data: {
    name: 'purge',
    description: '指定した量のメッセージを削除します。',
    options: [
      {
        name: 'amount',
        description: '削除するメッセージの量を指定してください。',
        type: 'INTEGER',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const isAdmin = interaction.user.id === process.env.ADMIN || '932244204032233483';
    if (!isAdmin) {
      await interaction.reply({ content: '権限がありません。', ephemeral: true });
      return
    }
    
    const amount = interaction.options.getInteger('amount');
    if (amount < 1 || amount > 100) {
      return interaction.reply({
        content: '削除するメッセージの量は1から100の間で指定してください。',
        ephemeral: true,
      });
    }

    const channel = interaction.channel;
    const messages = await channel.messages.fetch({ limit: amount + 1 });
    channel.bulkDelete(messages);

    interaction.reply({
      content: `${amount}件のメッセージを削除しました。`,
      ephemeral: true,
    });
  },
};
