# discord-birthdays
An NPM Module allowing you to setup birthday messages when it is a users birthday automatically!

---

## Support

* [Discord](https://hyperz.dev/discord)

* [Website](https://hyperz.dev/)

---

## Installation

`npm i discord-birthdays@latest`

---

## Check SQL Table Status

Check if the required SQL table(s) are imported

| Entry        | Type | Definition | 
|----------------|---------------|---------------|
| #1   | SQL VAR  | Your SQL Connection Variable (con, db, etc)

---

## Initialization

con, client, format, guildid, channels, header, footer, color

The nodelogger function offers a fair amount of customization.

| Entry        | Type | Definition | 
|----------------|---------------|---------------|
| #1   | SQL VAR     | Your SQL Connection Variable (con, db, etc)
| #2   | CLIENT VAR  | Your bots "client" variable (client, bot, etc)
| #3   | STRING      | The format you want bdays checked as (MM-DD-YYYY)
| #4   | STRING      | The guild id for the birthday
| #5   | ARRAY       | The channels to send the alert to
| #6   | STRING      | The header of the birthday embed
| #7   | STRING      | The footer of the birthday embed
| #8   | STRING      | The color of the birthday embed

---

## Add Birthdays

Add a birthday to the database function info

| Entry        | Type | Definition | 
|----------------|---------------|---------------|
| #1   | SQL VAR  | Your SQL Connection Variable (con, db, etc)
| #2   | STRING  | A User ID to add to the bdays table
| #3   | STRING  | The date of the users birthday

---

## Remove Birthdays

Remove a birthday from the database function info

| Entry        | Type | Definition | 
|----------------|---------------|---------------|
| #1   | SQL VAR  | Your SQL Connection Variable (con, db, etc)
| #2   | STRING  | A User ID to remove from the bdays table

---

## Code Example

```js
const Discord = require('discord.js')
const client = new Discord.Client({
    intents: ['GUILDS', 'GUILD_MESSAGES', "GUILD_MESSAGE_REACTIONS", "DIRECT_MESSAGES", "GUILD_MEMBERS", "GUILD_BANS", "GUILD_INTEGRATIONS", "GUILD_WEBHOOKS", "GUILD_INVITES", "GUILD_VOICE_STATES", "GUILD_PRESENCES", "GUILD_MESSAGE_TYPING", "DIRECT_MESSAGE_REACTIONS", "DIRECT_MESSAGE_TYPING"],
    partials: ["CHANNEL", "MESSAGE", "REACTIONS"],
    allowedMentions: { parse: ['users', 'roles', 'everyone'], repliedUser: true }
});

let con;
const mysql = require('mysql')
client.utils = require('discord-birthdays')

client.on(`ready`, () => {
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "dbname"
    });

    console.log(`I AM READY WOOOOO`)

    setTimeout(async () => {
        await client.utils.dbcheck(con)
        await client.utils.init(con, client, 'MM-DD-YYYY', '832721829822857296', ['879012702222168064'], `HAPPY BIRTHDAY`, `Happy BDay Lol`, `#ffffff`)
    }, 3000)
});

client.on('messageCreate', message => {
    let prefix = '!'
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        let command = args.shift().toLowerCase();

        if(command === 'ping') {
            message.channel.send({ content: "pong!" })
        } else if(command === 'add') {
            let check = client.utils.addbday(con, message.author.id, args[0])
            if(check) {
                message.channel.send({ content: "Bday Added!" })
            } else {
                message.channel.send({ content: "Bday Add Failed!" })
            }
        } else if(command === 'remove') {
            let check2 = client.utils.removebday(con, message.author.id)
            if(check2) {
                message.channel.send({ content: "Bday Removed!" })
            } else {
                message.channel.send({ content: "Failed to remove bday!" })
            }
        }
    }
});

client.login(`YOUR_TOKEN_HERE`)
```
