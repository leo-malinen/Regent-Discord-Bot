const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Project is running!");
})

app.get("/", (req, res) => {
  res.send("I'm up!");
})

const Discord = require("discord.js");
let client = new Discord.Client({ intents: ["Guilds", "GuildMessages", "MessageContent"]})

client.on("messageCreate", message => {
  // Check if the bot was mentioned
  if (message.mentions.has(client.user)) {
    if(message.content.includes("Foo")) {
      message.channel.send("Bar")
    }
  }
})

client.login(process.env.token);
