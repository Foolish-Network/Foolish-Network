const fs = require('fs');
const { Client, Intents, WebhookClient } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const commands = {};
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands[command.data.name] = command;
}

// 禁止ワードのファイルパス
const prohibitedWordsFile = './prohibitedWords.json';

// 禁止ワードのリストを読み込む関数
function loadProhibitedWords() {
  try {
    const data = fs.readFileSync(prohibitedWordsFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`禁止ワードの読み込み中にエラーが発生しました: ${error}`);
    return [];
  }
}

// 禁止ワードのリスト
const prohibitedWords = loadProhibitedWords();

client.once('ready', async () => {
  const data = [];
  for (const commandName in commands) {
    data.push(commands[commandName].data);
  }
  await client.application.commands.set(data, process.env.SERVER);
  console.log('Ready!');
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
  const hasProhibitedWord = prohibitedWords.some((word) =>
    message.content.includes(word)
  );

  if (hasProhibitedWord) {
    // メッセージを削除する
    await message.delete();

    // ユーザーに警告を送信する
    const warningMessage = `不適切な発言が見られたため、該当メッセージを削除しました。これによるKICKやBANの措置はありません。`;

    await message.author.send(warningMessage);
  }
});

// 禁止ワードリストの自動更新
fs.watchFile(prohibitedWordsFile, (curr, prev) => {
  if (curr.mtime > prev.mtime) {
    console.log('禁止ワードリストが更新されました。');

    // 禁止ワードリストを再読込
    const updatedProhibitedWords = loadProhibitedWords();
    prohibitedWords.length = 0;
    Array.prototype.push.apply(prohibitedWords, updatedProhibitedWords);
  }
});

client.login(process.env.DISCORD_TOKEN);
