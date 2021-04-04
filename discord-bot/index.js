require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client();

const BOT_CHANNEL = "story-time-📚"
let PREFIX = '!'

client.login(process.env.BOT_TOKEN)

//joined a servers
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    var server = message.guild;
    var name = message.author.username;
    if(guild.channels.cache.find(x => x.name == BOT_CHANNEL) == null){
        guild.createChannel(BOT_CHANNEL)
    }
})

client.on("ready", () => {
    console.log("JankyBot is ONLINE")
})

client.on("message", msg => {
    if (msg.author.bot) return;
    // console.log(msg.content)
    // console.log(msg)
    if(msg.content === PREFIX+"createChannel"){
        const guild = msg.guild
        if(guild.channels.cache.find(channel => channel.name == BOT_CHANNEL) == null){
            guild.channels.create(BOT_CHANNEL, { type: 'text',  reason: 'Story Writing Channel' }).then(c =>{
                c.send("INFO ON HOW THE BOT WORKS, ETC.....")
                msg.reply("Channel Created")
            }).catch(e =>
                {
                    msg.reply("Error creating channel.")
                    console.log(e)
                }
            )
        }
        else{
            msg.reply("Channel Already Exists")
        }
    }
    else if(msg.channel.name == BOT_CHANNEL){
        if(!msg.content.startsWith(PREFIX)){
            msg.delete({ timeout: 100 });
            msg.reply('Only bot commands allowed!')
            .then(m => {
                m.delete({ timeout: 5000 })
            })
        }
        else{
            const words = msg.content.split(/\s+/)
            const command = words[0].substring(PREFIX.length,).toLowerCase()
            msg.reply(command)
            switch(command){
                case "write":
                    msg.reply('write')
                    .then(m => {
                        m.delete({ timeout: 5000 })
                    })
                    break;
                case "read":
                    // code block
                    break;
                default:
                    msg.reply('Invalid Command')
                    .then(m => {
                        m.delete({ timeout: 5000 })
                    })
                
            }
        }
    }

    // msg.channel.send(BOT_CHANNEL)
})