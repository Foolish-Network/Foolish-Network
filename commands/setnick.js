const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    data: {
        name: "setnick",
        description: "ニックネームを変更します。",
        options: [
          {
            type: "USER",
            name: "user",
            description: "設定するユーザー",
            required: true,
          },
          {
            type: "STRING",
            name: "nick",
            description: "設定するニックネーム",
            required: true,
          },
                 ],
    },
    async execute(interaction) {
      if (interaction.user.id !== process.env.ADMIN) {
        await interaction.reply({ content: '権限がありません。', ephemeral: true });
        return
      }
      const user = interaction.options.getUser('user');
      const nick = interaction.options.getString('nick');
      try {
        interaction.guild.members.cache.get(user.id).setNickname(nick);
      } catch (error) {
        interaction.reply({ content: 'ニックネームの変更中にエラーが発生しました。' + error, ephemeral: true})
      }
      await interaction.reply({ content: 'ニックネームの変更を実行しました。(Botのロールが変更者のロールの効力より弱い場合、キャンセルされます。)', ephemeral: true })
      return
    }
}
