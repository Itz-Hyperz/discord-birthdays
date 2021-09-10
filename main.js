// CREATED BY HYPERZ DEVELOPMENT ++ Hyperz#0001
// CREATED BY HYPERZ DEVELOPMENT ++ Hyperz#0001
// CREATED BY HYPERZ DEVELOPMENT ++ Hyperz#0001

const moment = require('moment-timezone');
const Discord = require('discord.js') // V13

async function dbcheck(con) {
    await con.query(`SELECT * FROM birthdays`, async (err, row) => {
        if(err) {
            await con.query(`CREATE TABLE birthdays ( userid TEXT, deDate TEXT );`, async (err, row) => {
                if(err) {
                    console.log(`Birthdays Issue Importing Table: `, err)
                } else {
                    console.log(`Imported Birthdays Table.`)
                }
            })
        }
    });
}

async function init(con, client, format, guildid, channels, header, footer, color) {
        // Get current date
        let datetime = moment().tz('America/New_York').format(format).toString()
            // Select all from table
        await con.query(`SELECT * FROM birthdays`, async(err, rows) => {
            if (err) throw err; // throw err
            if (rows[0]) { // if there is any data
                rows.forEach(async r => { // go through each bit of data
                    if (r.deDate.toString().includes(datetime)) { // If there birthday is equal to the current date
                        let guild = await client.guilds.cache.get(guildid) // find guild id
                        let user = await client.users.fetch(r.userid) // find user
                        if (guild.members.cache.get(user.id)) { // if the member is in the server
                            let bdayembed = new Discord.MessageEmbed() // create embed
                                .setColor(color || `BLUE`)
                                .setTitle(header || `🥳 Happy Birthday!`)
                                .setThumbnail(user.avatarURL({ dynamic: true }) || `https://images.emojiterra.com/google/android-11/512px/1f389.png`)
                                .setDescription(`It's **${user.tag} (<@${user.id}>)'s** Birthday today! Wish them a happy birthday and let's celebrate!\n**Date:** ${r.deDate}`)
                                .setTimestamp()
                                .setFooter(footer || 'Happy Birthday!')
                            channels.forEach(async c => { // get each channel
                                let thechannel = await client.channels.cache.get(c)
                                if (thechannel !== undefined) {
                                    thechannel.send({ embeds: [bdayembed] }).catch(e => {}) // send to each channel
                                } else {
                                    console.log(`A Birthday system channel ID is invalid...`) // log error
                                }
                            });
                        }
                    }
                });
            }
            setTimeout(() => { init(con, client, format, guildid, channels, header, footer, color) }, 46800000);
        });
    }

async function addbday(con, userid, date) {
    await con.query(`SELECT * FROM birthdays WHERE userid='${userid}'`, async (err, row) => {
        if(err) {
            console.log(`Failed to import birthday for userid ${userid} with date ${date}`);
            return false;
        }
        if(!row[0]) {
            await con.query(`INSERT INTO birthdays (userid, deDate) VALUES ("${userid}", "${date}")`, async (err, row) => {
                if(err) {
                    console.log(`Failed to import birthday for userid ${userid} with date ${date}`);
                    return false;
                } else {
                    return true;
                }
            });
        }
    });
}

async function removebday(con, userid) {
    await con.query(`SELECT * FROM birthdays WHERE userid='${userid}'`, async (err, row) => {
        if(err) {
            console.log(`Failed to delete birthday for userid ${userid}`);
            return false;
        }
        if(row[0]) {
            await con.query(`DELETE FROM birthdays WHERE userid='${userid}'`, async (err, row) => {
                if(err) {
                    console.log(`Failed to delete birthday for userid ${userid}`);
                    return false;
                } else {
                    return true;
                }
            });
        }
    });
}

exports.dbcheck = dbcheck;
exports.init = init;
exports.addbday = addbday;
exports.removebday = removebday;

// CREATED BY HYPERZ DEVELOPMENT ++ Hyperz#0001
// CREATED BY HYPERZ DEVELOPMENT ++ Hyperz#0001
// CREATED BY HYPERZ DEVELOPMENT ++ Hyperz#0001
