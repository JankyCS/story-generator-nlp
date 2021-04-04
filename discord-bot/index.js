require('dotenv').config()
const fetch = require("node-fetch");

const Discord = require('discord.js')
const client = new Discord.Client();

const API = process.env.BACKEND_URL
const BOT_ID = process.env.BOT_ID

const CATEGORY = "📚story-time"
const BOT_CHANNEL = "📝writing-corner"
const STORAGE_CHANNEL = "📚completed-stories"



let PREFIX = '!'

const nextWordsEmbed = (nextWords) => {
    return new Discord.MessageEmbed()
	.setColor('#0099ff')
    .addField('Next Words', nextWords, false)
	// .addField('The Story So Far... ', nextWords, false)
    // .setFooter('Current Story Start Timestamp')
    // .setAuthor('JankyBot', 'https://jankycs.github.io/assets/jcs.png','https://jankycs.github.io')
}

const allWordsEmbed = (allWords) => {
    return new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Story')
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
        inputText:storyText+" ",
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

const getStorySoFar = (channel) => {
    channel.messages.fetch().then(msgs => {
        // console.log(msgs)
        // msgs.sort((a, b) => b.createdAt < a.createdAt)
        let sorted = Array.from(msgs.values())//.sort((a, b) => b.createdAt > a.createdAt)
        sorted.sort((a, b) => a.createdAt-b.createdAt)
        // console.log(msgs)
        let storyString = ""
        for(let i = 0;i<sorted.length;i++){
            let msg = sorted[i].content
            if(msg.startsWith(PREFIX)){
                const words = msg.split(/\s+/)
                const command = words[0].substring(PREFIX.length).toLowerCase()
                const rest = msg.substring(words[0].length+1)
                if(command == "write"){
                    storyString +=rest
                }
            }
            else if(sorted[i].author.bot && sorted[i].embeds.length>0){
                let embed = sorted[i].embeds[0]
                const words = embed.fields.filter(x => x.name = "Next Words")
                if (words.length>0){
                    const w = words[0].value
                    storyString += w
                }
            }



            
        }
        console.log("Wooo: "+storyString)
        // msgs.forEach(msg => console.log("Wooo: "+msg.content))
    }).catch(err => {
        console.log('Bruh');
        console.log(err);
    });
}

const readCurrentStory = (guild) => {
    let storage = guild.channels.cache.find(x => x.name == STORAGE_CHANNEL)
    if(storage == null) return
    return storage.messages.fetch().then(msgs => {
        let sorted = Array.from(msgs.values())//.sort((a, b) => b.createdAt > a.createdAt)
        sorted.sort((a, b) => b.createdAt-a.createdAt)
        // console.log(msgs)

        for(let i = 0;i<sorted.length;i++){
            if(sorted[i].author.bot && sorted[i].embeds.length>0){
                let embed = sorted[i].embeds[0]
                let words = embed.description
                if(!words.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().trim().endsWith("the end")){
                    return words
                }
            }
        }
        return ""
        // console.log(storyString)
        
    }).catch(err => {
        console.log('Bruh');
        console.log(err);
    });
}

const writeToStorage = async (text,guild) => {
    let storage = guild.channels.cache.find(x => x.name == STORAGE_CHANNEL)
    if(storage == null) return
    return storage.messages.fetch().then(async msgs => {
        let sorted = Array.from(msgs.values())//.sort((a, b) => b.createdAt > a.createdAt)
        sorted.sort((a, b) => b.createdAt-a.createdAt)
        // console.log(msgs)
        let storyString = null
        let currentStoryMsg = null

        for(let i = 0;i<sorted.length;i++){
            if(sorted[i].author.bot && sorted[i].embeds.length>0){
                let embed = sorted[i].embeds[0]
                let words = embed.description
                if(!words.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().trim().endsWith("the end") && words.length<2000){
                    storyString = words
                    currentStoryMsg = sorted[i]
                    break
                }
            }
        }

        if(currentStoryMsg != null){
            let stuff = storyString
            if(!(!!text.match(/^[.,:!?]/) || text.startsWith(" "))){
                stuff+=" "
            }
            stuff +=text
            
            let body = {
                inputText:stuff
            }

            let requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            }

            console.log(requestOptions)
            var i = await fetch(API+'/grammar', requestOptions)
            var r = await i.json()

            await currentStoryMsg.edit(allWordsEmbed(r.newText.substring(0,2000)))
        }
        else{
            storage.send(allWordsEmbed(text.substring(0,2000)))
        }
    }).catch(err => {
        console.log('Bruh');
        console.log(err);
    });
}

const createChannels = (guild) => {
    let cat = guild.channels.cache.find(x => x.name == CATEGORY && x.type == 'category')
    if(cat  == null){
        guild.channels.create(CATEGORY, {
            type: 'category',
        }).then( cat => {
            const writing = guild.channels.cache.find(x => x.name == BOT_CHANNEL)
            const storage = guild.channels.cache.find(x => x.name == STORAGE_CHANNEL)
            if(writing == null){
                guild.channels.create(BOT_CHANNEL,{
                    type: 'text', parent: cat.id ,
                })
                .then(channel => channel.send("INFO ON WHAT WRITING CHANNELS FOR").then(m => m.pin()))
            }
            else{
                writing.setParent(cat.id).catch(e=>console.log(e));
            }
            if(storage == null){
                guild.channels.create(STORAGE_CHANNEL,{
                    type: 'text', parent: cat.id,
                    permissionOverwrites: [
                        { 
                            id: guild.id,
                            deny: ['SEND_MESSAGES'],
                        },
                        { 
                            id: BOT_ID,
                            allow: ['SEND_MESSAGES'],
                        },
                    ],
                }).then(channel => channel.send("INFO ON WHAT STORAGE CHANNELS FOR").then(m => m.pin()))
            }
            else{
                storage.setParent(cat.id).catch(e=>console.log(e));;
            }
        })
    }
    else{
        const writing = guild.channels.cache.find(x => x.name == BOT_CHANNEL)
        const storage = guild.channels.cache.find(x => x.name == STORAGE_CHANNEL)
        if(writing == null){
            guild.channels.create(BOT_CHANNEL,{ type: 'text', parent: cat.id }).then(channel => channel.send("INFO ON WHAT WRITING CHANNELS FOR").then(m => m.pin()))
        }
        else{
            writing.setParent(cat.id).catch(e=>console.log(e));;
        }
        if(storage == null){
            guild.channels.create(STORAGE_CHANNEL,{
                type: 'text', parent: cat.id,
                permissionOverwrites: [
                { 
                    id: guild.id,
                    deny: ['SEND_MESSAGES'],
                },
                { 
                    id: BOT_ID,
                    allow: ['SEND_MESSAGES'],
                },
                
            ],
            }).then(channel => channel.send("INFO ON WHAT STORAGE CHANNELS FOR").then(m => m.pin()))
        }
        else{
            storage.setParent(cat.id).catch(e=>console.log(e));;
        }
    }
}


client.login(process.env.BOT_TOKEN)

//joined a servers
client.on("guildCreate", guild => {
    console.log("Joined a new guild: " + guild.name);
    createChannels(guild)    
})

client.on("ready", () => {
    console.log("JankyBot is ONLINE")
})

client.on("message", msg => {
    if (msg.author.bot) return;

    if(msg.content.toLowerCase() === PREFIX+"createchannels"){
        if(msg.channel.name.startsWith(BOT_CHANNEL)){
            badMessage(msg,"Cannot Create New Story In Story Channel")
            return
        }

        const guild = msg.guild
        createChannels(guild)
    }
    else if(msg.channel.name.startsWith(BOT_CHANNEL)){
        if(!msg.content.startsWith(PREFIX)){
            badMessage(msg,'Only bot commands allowed!')
        }
        else{
            const words = msg.content.split(/\s+/)
            const command = words[0].substring(PREFIX.length).toLowerCase()
            const rest = msg.content.substring(words[0].length+1)

            switch(command){
                case "write":
                    if(rest == ''){
                        badMessage(msg,'Missing Text')
                    }
                    else{
                        // write their words to the STORAGE channel
                        writeToStorage(rest,msg.guild).then(
                            w => {
                                // READ the storage channel for current full story
                                readCurrentStory(msg.guild).then(a => {
                                    console.log(a)
                                    if(a.length<2000 && !rest.trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").toLowerCase().trim().endsWith("the end")){
                                        getWords(a).then(k => {
                                            msg.channel.send(nextWordsEmbed(k))
                                            writeToStorage(k,msg.guild)
                                        })
                                    }
                                    
                                })
                            }
                        )
                        
                        // Call API to get prediction

                        // write prediction to story channel, and send the embed
                        // msg.channel.send(nextWordsEmbed("woah"))
                    }
                    break;
                case "read":
                    // msg.channel.send(allWordsEmbed("poggers"))
                    readCurrentStory(msg.guild).then(a => {
                        msg.channel.send(allWordsEmbed(a))
                    })
                    break;
                default:
                    badMessage(msg,'Invalid Command')
            }
        }
    }

    // msg.channel.send(BOT_CHANNEL)
})