const { WebhookClient, MessageEmbed, Client, Intents } = require('discord.js');

module.exports = {
  data: {
    name: 'ktt',
    description: 'KTTを召喚したり退出させたりします。',
  },
  async execute(interaction) {
    const channel = interaction.channel;
    const webhooks = await channel.fetchWebhooks();
    const kttWebhook = webhooks.find((webhook) => webhook.name === 'かんざk');

    if (kttWebhook) {
      // KTTが既に召喚されている場合は退出させる
      await kttWebhook.delete(); // Webhookを削除する
      await interaction.reply({ content: 'KTTを退出させました。' });
    } else {
      // KTTが召喚されていない場合は召喚する
      const userId = '1062565968959774761'; // 使用するユーザーIDを指定する
      const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); // 使用するインテントを指定する
      await client.login(process.env.BOT_TOKEN); // BOT_TOKENはご自身のボットトークンに置き換えてください

      const user = await client.users.fetch(userId); // 指定されたユーザーIDを使用してユーザー情報を取得する
      const webhook = await channel.createWebhook(user.username, {
        avatar: user.displayAvatarURL(), // ユーザーのアイコンを取得してWebhookのアイコンに設定する
      });

      // メッセージのリスト
      const messages = ['改心した？病気？どこかぶつけた？彼女できた？', 'きっっっしょ', '可哀想www', 'わかる！！！！！！！', '大丈夫！！？お大事に！！'];

      const filter = (message) => !message.author.bot; // メッセージがBot自身のものでないことを確認する
      const collector = channel.createMessageCollector({ filter });

      collector.on('collect', async (message) => {
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        var special_message = message.content; // メッセージの内容を取得する
        if (special_message.includes('シュクダイ') || special_message.includes('宿題')) {
          await webhook.send('シュクダイ？ナニソレオイシイノ？'); 
        } else if (special_message.includes('漢字')){
          await webhook.send('漢字きもい！！！'); 
        } else if (message.author.id === '1051707463302381589'){
          await webhook.send('はるかぜくんかっこいい〜(棒)'); 
        } else {
          await webhook.send(randomMessage);
        }
      });

      collector.on('webhookUpdate', async () => {
        // Webhookが更新された場合の処理
        await webhook.delete(); // 古いWebhookを削除する
        await channel.send('Webhookが更新されたため、KTTを退出させました。');
        collector.stop(); // コレクターを停止する
      });

      await interaction.reply({ content: 'KTTを召喚しました。' });

      await client.destroy(); // クライアントを破棄する
    }
  },
};
