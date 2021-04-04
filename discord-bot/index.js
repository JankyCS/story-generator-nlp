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
    if(guild.channels.find(x => x.name == BOT_CHANNEL) == null){
        guild.createChannel(BOT_CHANNEL)
    }
})

client.on("ready", () => {
    console.log("JankyBot is ONLINE")
})

client.on("message", msg => {
    
    // console.log(msg.content)
    // console.log(msg)
    if(msg.content === PREFIX+"createChannel"){
        const guild = msg.guild

        if(guild.channels.cache.find(channel => channel.name == BOT_CHANNEL) == null){
            guild.channels.create(BOT_CHANNEL, { type: 'text',  reason: 'New channel added for fun!' }).then(c =>{
                msg.reply("Channel Created")
                console.log(guild.channels.cache)
                // msg.reply(guild.channels.cache.toString())
            }).catch(e =>
                {
                    console.log(e)
                }
            )
        }
        else{
            msg.reply("Channel Already Exists")
        }
    }

    if(msg.channel.name == BOT_CHANNEL){
        console.log("poggers")
    }
    // msg.channel.send(BOT_CHANNEL)
})