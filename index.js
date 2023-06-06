const fs = require('fs');
const { Client, Intents, WebhookClient } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });

const commands = {};
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands[command.data.name] = command;
}

// 禁止ワードのディレクトリとファイルパス
const pwlistDirectory = './pwlist';
const getProhibitedWordsFile = (guildId) => `${pwlistDirectory}/${guildId}.json`;

// 禁止ワードのリストを読み込む関数
function loadProhibitedWords(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`禁止ワードの読み込み中にエラーが発生しました: ${error}`);
    return [];
  }
}

// 禁止ワードのリスト
const prohibitedWords = {};

client.once('ready', async () => {
  console.log('Botが起動しました。');
  console.log('参加しているサーバー:');
  client.guilds.cache.forEach(async (guild) => {
    const updatedGuild = await guild.fetch(); // サーバーの情報を最新の状態に更新する
    const owner = await client.users.fetch(updatedGuild.ownerId); // オーナー情報を取得する
    console.log(`- サーバー名: ${updatedGuild.name}`);
    console.log(`- サーバーID: ${updatedGuild.id}`);
    console.log(`- オーナー名: ${owner.tag}`);
    console.log(`- オーナーID: ${updatedGuild.ownerId}`);
    console.log('--------------------------');

    // サーバーごとの禁止ワードリストを読み込む
    const prohibitedWordsFile = getProhibitedWordsFile(updatedGuild.id);
    prohibitedWords[updatedGuild.id] = loadProhibitedWords(prohibitedWordsFile);

    // 禁止ワードリストの監視
    fs.watchFile(prohibitedWordsFile, (curr, prev) => {
      if (curr.mtime > prev.mtime) {
        console.log('禁止ワードリストが更新されました。');

        // 禁止ワードリストを再読込
        prohibitedWords[updatedGuild.id] = loadProhibitedWords(prohibitedWordsFile);
      }
    });
  });
});

client.once('ready', async () => {
  const data = [];
  for (const commandName in commands) {
    data.push(commands[commandName].data);
  }
  await client.application.commands.set(data);
  console.log('DiscordBotが起動しました。');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = commands[interaction.commandName];
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'コマンドの内部でエラーが発生しました。',
      ephemeral: true,
    });
  }
});

client.on('messageCreate', async (message) => {
  // メッセージが禁止ワードを含んでいるかチェックする
  const guildId = message.guild.id;
  const prohibitedWordsFile = getProhibitedWordsFile(guildId);
  const prohibitedWordsForGuild = prohibitedWords[guildId] || loadProhibitedWords(prohibitedWordsFile);
  const hasProhibitedWord = prohibitedWordsForGuild.some((word) =>
    message.content.includes(word) || checkEmbedsForProhibitedWord(message, word)
  );

  if (hasProhibitedWord) {
    // メッセージを削除する
    await message.delete();

    // ユーザーに警告を送信する
    const warningMessage = `不適切な発言が見られたため、該当メッセージを削除しました。これによるKICKやBANの措置はありません。`;
    await message.author.send(warningMessage);
  }
});

function checkEmbedsForProhibitedWord(message, word) {
  if (message.embeds.length === 0) {
    return false;
  }

  for (const embed of message.embeds) {
    if (embed.description && embed.description.includes(word)) {
      return true;
    }

    if (embed.title && embed.title.includes(word)) {
      return true;
    }

    if (embed.fields && embed.fields.length > 0) {
      for (const field of embed.fields) {
        if (field.name && field.name.includes(word)) {
          return true;
        }

        if (field.value && field.value.includes(word)) {
          return true;
        }
      }
    }
  }

  return false;
}


// サーバー参加時のログ出力
client.on('guildCreate', (guild) => {
  logServerInfo(guild);
});

// サーバー情報のログ出力
function logServerInfo(guild) {
  console.log('サーバー参加:');
  console.log(`- サーバー名: ${guild.name}`);
  console.log(`- サーバーID: ${guild.id}`);
  console.log(`- オーナー名: ${guild.owner.user.tag}`);
  console.log(`- オーナーID: ${guild.ownerID}`);
  console.log('--------------------------');
}

// pwlistディレクトリが存在しない場合は作成する
if (!fs.existsSync(pwlistDirectory)) {
  fs.mkdirSync(pwlistDirectory);
}

client.login(process.env.DISCORD_TOKEN);
