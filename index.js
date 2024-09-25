const express = require("express");
const app = express();

app.listen(3000, () => {
  console.log("Project is running!");
});

app.get("/", (req, res) => {
  res.send("I am up!");
});

const Discord = require("discord.js");
let client = new Discord.Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});
let bots = ["Other Bot 1", "Other Bot 2", "Other Bot 3"];
let events = [
  "Event 1",
  "Event 2",
  "Event 3",
  "Event 4",
  "Event 5",
];
let appointees = [
  "Appointee 1",
  "Appointee 2",
  "Appointee 3",
  "Appointee 4",
  "Appointee 5",
];

client.on("messageCreate", (message) => {
  if (message.mentions.has(client.user)) {
    if (message.content.includes("who are you?")) {
      message.channel.send(
        "I am [Create botname here]. This description should be changed to whatever you like and should seem like either a boast or something this regent would say about him or herself.",
      );
    }
  }
});

let morale = 100;
let towns = ["Town1", "Town2", "Town3", "Town4", "Town5"];
let troops = {
  Infantry: 200,
  Archers: 100,
  Cavalry: 50,
};
let resources = {
  Food: 1024,
  Lumber: 512,
  Stone: 0,
  Metal: 0,
  Livestock: 0,
};

client.on("messageCreate", async (message) => {
  if (message.mentions.has(client.user)) {
    let channel = client.channels.cache.find(channel => channel.name === "royal-kingdom-declarations");
    if (!channel) {
      console.log('The channel "royal-kingdom-declarations" does not exist!');
      return;
    }

    if (message.content.includes("say")) {
      let echoMessage = message.content.split("say")[1].trim();
      await channel.send(echoMessage);
    } else if (message.content.includes("trade")) {
      let availableResources = Object.keys(resources).filter(
        (resource) => resources[resource] > 0,
      );
      if (availableResources.length > 0) {
        let offeredResource =
          availableResources[
            Math.floor(Math.random() * availableResources.length)
          ];
        let offerAmount =
          Math.floor(Math.random() * resources[offeredResource]) + 1;
        await channel.send(
          `@${message.author.username} I can offer you ${offerAmount} ${offeredResource}.`,
        );
        resources[offeredResource] -= offerAmount;
      } else {
        await channel.send(`I am sorry, I cannot offer anything at the moment, so I must decline.`);
      }
    } else if (message.content.includes("sorry") && message.content.includes("decline")) {
      await channel.send(`That is a shame.`);
      morale -= Math.floor(Math.random() * 10) + 1;
    } else if (message.content.includes("initiate action")) {
      let otherBot = bots[Math.floor(Math.random() * bots.length)];
      let action = Math.floor(Math.random() * 100);
      towns.forEach((town) => {
        resources["Lumber"] += 10;
        resources["Metal"] += 10;
        resources["Food"] -= 10;
        resources["Stone"] += 20;
      });
      if (morale < 25) {
        if (action < 50) {
          let demandedResource = Object.keys(resources)[ Math.floor(Math.random() * Object.keys(resources).length)];
          await channel.send(`@${otherBot} You must meet my demands and give me ${demandedResource} as tribute.`);
        } else {
          await channel.send(`@${otherBot} I hereby declare war on you!`);
          morale = 100;
          resources["Food"] -= 4992;
        }
      } else {
        if (action < 25) {
          let appointee =
            appointees[Math.floor(Math.random() * appointees.length)];
          await channel.send(
            `I now choose a new appointee for the position of ${appointee}`
          );
        } else if (action >= 25 && action < 75) {
          let tradedResource = Object.keys(resources).filter(
            (resource) => resources[resource] > 0,
          );
          if (tradedResource.length > 0) {
            tradedResource =
              tradedResource[Math.floor(Math.random() * tradedResource.length)];
            let tradeAmount = Math.floor(resources[tradedResource] / 5);
            await channel.send(
              `@${otherBot} I wish to trade ${tradeAmount} ${tradedResource} with you.`,
            );
            resources[tradedResource] -= tradeAmount;
          } else {
            let woodAmount = Math.floor(resources["Lumber"] / 5);
            await channel.send(
              `I wish to trade ${woodAmount} lumber to you.`,
            );
            resources["Lumber"] -= woodAmount;
          }
        } else {
          let randomEvent = events[Math.floor(Math.random() * events.length)];
          await channel.send(`I will soon be hosting a ${randomEvent}`);
        }
      }
    } else if (message.content.includes("battle result,")) {
      let moraleChange;
      if (message.content.includes("decisive victory")) {
        moraleChange = Math.floor(Math.random() * 11) + 10;
        morale += moraleChange;
      } else if (message.content.includes("victory")) {
        moraleChange = Math.floor(Math.random() * 10) + 1;
        morale += moraleChange;
      } else if (message.content.includes("stalemate")) {
        moraleChange = 0;
      } else if (message.content.includes("defeat")) {
        moraleChange = Math.floor(Math.random() * 10) + 1;
        morale -= moraleChange;
      } else if (message.content.includes("decisive loss")) {
        moraleChange = Math.floor(Math.random() * 11) + 10;
        morale -= moraleChange;
      }
      morale = Math.max(0, Math.min(morale, 100));
    } else if (message.content.includes("declare war")) {
      await channel.send(`So be it, the caliphate will meet you with their blades and bows!`);
    }
  }
});

client.on("messageCreate", (message) => {
  // Check if the bot was mentioned and command was given of listing the status
  if (message.mentions.has(client.user)) {
    if (message.content.includes("status")) {
      let resourceList = Object.entries(resources).map(([key, value]) => `${key}: ${value}`).join("\n");
      let troopList = Object.entries(troops).map(([key, value]) => `${key}: ${value}`).join("\n");
      let townList = towns.join(", ");

      let statusMessage = `**Morale**: ${morale}%\n**Towns**: ${townList}\n**Troops**: ${troopList}\n\n**Resources**:\n${resourceList}`;
      message.channel.send(statusMessage);
    }
  }
});

client.login(process.env.token);
