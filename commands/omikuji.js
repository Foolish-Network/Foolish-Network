module.exports = {
	data: {
        name: "omikuji",
        description: "おみくじを引くことができます。",
    },
	async execute(interaction) {
        let arr = ["大吉", "吉", "中吉", "https://i.ibb.co/26LtJB6/Screenshot-2023-05-15-19-39-56.png", "末吉", "凶", "大凶"];
        let weight = [15, 25, 20, 20, 15, 10, 5];
        let totalWeight = 0;
        for (var i = 0; i < weight.length; i++){
          totalWeight += weight[i];
        }
        let random = Math.floor( Math.random() * totalWeight);
        for (var i = 0; i < weight.length; i++){
          if (random < weight[i]){
            await interaction.reply(arr[i]);
            return;
          }else{
            random -= weight[i];
          }
        }
        console.log("lottery error");
	}
}
