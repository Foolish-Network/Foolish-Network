// commands/mute.js

const { Permissions } = require('discord.js');
const dotenv = require('dotenv');

module.exports = {
  data: {
    name: 'mute',
    description: '指定されたユーザーをミュートする',
    options: [
      {
        name: 'user',
        description: 'ミュートするユーザー',
        type: 'USER',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const { user } = interaction.options.get('user');
    const member = interaction.guild.members.cache.get(user.id);
    if (interaction.user.id !== process.env.ADMIN) {
      await interaction.reply({ content: '権限がありません。', ephemeral: true });
      return
    }
    // ミュートロールを取得または作成
    let muteRole = interaction.guild.roles.cache.find(role => role.name === 'mute');
    if (!muteRole) {
      try {
        muteRole = await interaction.guild.roles.create({
          name: 'mute',
          permissions: []
        });

        // ミュートロールが作成されたことを通知
        await interaction.reply({ content: 'ミュートロールが作成されました。', ephemeral: true });
      } catch (error) {
        console.log('ミュートロールの作成中にエラーが発生しました:', error);
        await interaction.reply({ content: 'ミュートロールを作成できませんでした。', ephemeral: true });
        return;
      }
    }
    
    // ミュートロールをメンバーに追加
    await member.roles.add(muteRole)
      .then(() => {
        interaction.reply({ content: `${member} をミュートしました。`, ephemeral: true });
      })
      .catch(error => {
        console.log('ミュート中にエラーが発生しました:', error);
        interaction.reply({ content: `${member} をミュートできませんでした。`, ephemeral: true });
      });
  },
};
