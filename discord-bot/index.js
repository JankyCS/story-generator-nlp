require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client();

const API = process.env.BACKEND_URL
const BOT_CHANNEL = "story-time-📚"
let PREFIX = '!'

const nextWordsEmbed = (nextWords) => {
    return new Discord.MessageEmbed()
	.setColor('#0099ff')
	.addField('Next Words', nextWords, true)
}

const allWordsEmbed = (allWords) => {
    return new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('The Story So Far...')
	.setAuthor('JankyBot', 'https://jankycs.github.io/assets/jcs.png','https://jankycs.github.io')
	.setDescription(allWords)
}

const badMessage = (msg,errorMessage)=>{
    msg.delete({ timeout: 5000 });
    msg.reply(errorMessage)
    .then(m => {
        m.delete({ timeout: 5000 })
    })
}

const getWords = async (storyText) => {
    let body = {
        inputText:storyText,
        numWords:5
    }

    let requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    console.log(requestOptions)
    var i = await fetch(API+'/predict', requestOptions)
    var r = await i.json()

    if(r.addedText==="consul "){
        r.addedText = "thing "
    }
    return r.addedText
}

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
            badMessage(msg,"Channel Already Exists")
        }
    }
    else if(msg.channel.name == BOT_CHANNEL){
        if(!msg.content.startsWith(PREFIX)){
            badMessage(msg,'Only bot commands allowed!')
        }
        else{
            const words = msg.content.split(/\s+/)
            const command = words[0].substring(PREFIX.length,).toLowerCase()
            const rest = msg.content.substring(words[0].length+1)

            switch(command){
                case "write":
                    if(rest == ''){
                        badMessage('Missing Text')
                    }
                    else{

                    }
                    break;
                case "read":

                    msg.channel.send(allWordsEmbed("poggers"))
                    break;
                default:
                    badMessage(msg,'Invalid Command')
            }
        }
    }

    // msg.channel.send(BOT_CHANNEL)
})