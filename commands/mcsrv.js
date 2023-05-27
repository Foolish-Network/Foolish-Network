const axios = require('axios');

module.exports = {
  data: {
    name: 'mcsrv',
    description: 'Minecraftサーバーのステータスを確認します。',
    options: [
      {
        name: 'address',
        description: 'サーバーアドレス',
        type: 'STRING',
        required: true,
      },
    ],
  },
  async execute(interaction) {
    const address = interaction.options.getString('address');

    try {
      const response = await axios.get(`https://api.mcsrvstat.us/2/${encodeURIComponent(address)}`);
      const data = response.data;

      if (data.online) {
        const { ip, port, players, version, motd } = data;
        const playerCount = players.online;
        const maxPlayers = players.max;

        let cleanMotd = '';
        if (motd && motd.clean) {
          cleanMotd = motd.clean.join('\n');
        }

        const embed = {
          title: 'Minecraftサーバーステータス',
          fields: [
            { name: 'アドレス', value: `${ip}:${port}` },
            { name: 'オンラインプレイヤー', value: `${playerCount}/${maxPlayers}` },
            { name: 'バージョン', value: version },
          ],
          timestamp: new Date(),
        };

        if (cleanMotd) {
          embed.fields.push({ name: 'MOTD', value: cleanMotd });
        }

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply('指定されたサーバーアドレスのサーバーはオフラインです。');
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'ステータスの取得中にエラーが発生しました。',
        ephemeral: true,
      });
    }
  },
};
