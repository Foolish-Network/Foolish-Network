module.exports = {
  data: {
    name: 'delete',
    description: '選択したメッセージを削除します。',
        options:[
      {
        name: 'message',
        description: '送信するメッセージ',
        type: 'STRING',
        required: true,
      }]
  },
  async execute(interaction) {
    const isAdmin = interaction.user.id === process.env.ADMIN;
    
    if (!isAdmin) {
      await interaction.reply({
        content: 'このコマンドは実行する権限がありません。',
        ephemeral: true,
      });
      return;
    }
    
    const targetMessage = interaction.options.getMessage('message');
    
    try {
      await targetMessage.delete();
      await interaction.reply({
        content: 'メッセージが削除されました。',
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'メッセージの削除中にエラーが発生しました。',
        ephemeral: true,
      });
    }
  },
};
