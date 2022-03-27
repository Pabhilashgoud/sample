/**
 * Module Imports
 */
const express = require('express')
const app = express();
const port = 3000

app.get('/', (require, res) => res.send('Hi Bro! My heart Is Beating'))

app.listen(port, () =>
console.log('your app is listening a http://localhost:${port}')
);


const { Client, Collection } = require("discord.js");
const { readdirSync } = require("fs");
const { join } = require("path");
const { TOKEN, PREFIX } = require("./util/Util");
const i18n = require("./util/i18n");

const client = new Client({
  disableMentions: "everyone",
  restTimeOffset: 0
});

client.login(process.env.TOKEN);
client.commands = new Collection();
client.prefix = PREFIX;
client.queue = new Map();
const cooldowns = new Collection();
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Client Events
 */
client.on("ready", () => {
    console.log(`${client.user.username} ready!`);
    console.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);
  
    client.user.setActivity(`In ${client.guilds.cache.size} Servers of ${client.users.cache.size} Users | m!invite m!play|`,{ type: "PLAYING" }); 
     
    setInterval(() => {
        client.user.setActivity(`In ${client.guilds.cache.size} Servers of ${client.users.cache.size} Users `,{ type: "PLAYING" }); 
    }, 10000); // Runs this every 10 seconds.
  });

console.log(`Ready on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users`);

//setMaxListeners(number)
//getMaxListeners();

const EventEmitter = require("events");
class MyEmitter extends EventEmitter{}

EventEmitter.defaultMaxListeners = 500;

var emitter = new MyEmitter();
var emitter2 = new MyEmitter();
var emitter3 = new MyEmitter();
var emitter4 = new MyEmitter();
var emitter5 = new MyEmitter();
var emitter6 = new MyEmitter();
var emitter7 = new MyEmitter();
var emitter8 = new MyEmitter();
var emitter9 = new MyEmitter();
var emitter10 = new MyEmitter();
var emitter11 = new MyEmitter();
var emitter12 = new MyEmitter();
var emitter13 = new MyEmitter();
var emitter14 = new MyEmitter();
var emitter15 = new MyEmitter();

// emitter.setMaxListeners(40);
console.log(`emitter: ${emitter.getMaxListeners()}`);
console.log(`emitter2: ${emitter2.getMaxListeners()}`);
console.log(`emitter3: ${emitter3.getMaxListeners()}`);
console.log(`emitter4: ${emitter4.getMaxListeners()}`);
console.log(`emitter5: ${emitter5.getMaxListeners()}`);
console.log(`emitter15: ${emitter5.getMaxListeners()}`);

emitter.emit("data");
emitter.emit("message");


client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	//client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	//client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

/**
 * Import all commands
 */
const commandFiles = readdirSync(join(__dirname, "commands")).filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, matchedPrefix] = message.content.match(prefixRegex);

  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        i18n.__mf("common.cooldownMessage", { time: timeLeft.toFixed(1), name: command.name })
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(i18n.__("common.errorCommand")).catch(console.error);
  }
});
