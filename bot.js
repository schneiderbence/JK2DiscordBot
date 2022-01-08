require("dotenv").config();
require('events').EventEmitter.prototype._maxListeners = 100;
const Discord = require('discord.js');
const client = new Discord.Client();
const commandSend = require('./commands.js');
//const config = require('./config.json');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
      msg.reply('Pong!');
    }
  });

client.login(process.env.TOKEN);

//First Lobby
var originalNames = [];
var lobbyId = [];
var tempLobby = [];
var unpicked = [];

//Second Lobby
var oNames = [];
var lobbyIdTwo = [];
var tempLobbyTwo = [];

var red_captain;
var red_name;
var blue_name;
var blue_captain;
const MAX_PLAYER = 12;
const CHANNEL_ID = '824737460230946888';
var pickRule;
var prefix = "=";
var taggedUser;
var taggedUsername;
var tagMembers = [];
var commandEmbed = new Discord.MessageEmbed();
var pickEmbed = new Discord.MessageEmbed();
var red_team = [];
var blue_team = [];

//For sub
var replaced_edited_playerName;
var replacer_edited_playerName;
var replaced_player;
var replacer_player;

//For positions
var cap = [];
var ret = [];
var bc = [];
var sup = [];
pickEmbed.setColor('#FF1493');

function resetLobby () {
    oNames = [];
    lobbyIdTwo = [];
    tempLobbyTwo = [];
    cap = [];
    ret = [];
    bc = [];
    sup = [];
    red_captain = '';
    blue_captain = '';
    red_team = [];
    blue_team = [];
    pickRule = '';
}

function tagLobbyMembers () {
    for (let i = 0; i < lobbyId.length; i++) {
        tagMembers[i] = `<@${lobbyId[i]}>`;
    }
}

function nameGenerator(name) {
    const generatedName = '`'+ name + '`';
    return generatedName;
}


function pickPrint (red_t, blue_t, unpicked_players, capper, returner, basecleaner, support) {
    if (red_t.length == 0 && blue_t.length == 0) {
        pickEmbed.fields = [];
        pickEmbed.setTitle('JK2 Champions League Teams').addFields({
            name: ':red_circle: Alpha Team:',
            value: '\u200b',
        },
        {
            name: ':blue_circle: Beta Team:',
            value: '\u200b' + 
            '\n\n\n **Unpicked:**\n' + unpicked_players.join(', '),
        },
        {
            name: '\nCappers: ' + capper.join(', ') + '\nReturners: ' + returner.join(', ') + '\nBCs: ' + basecleaner.join(', ') + '\nSupports: ' + support.join(', '),
            value: '\u200b',
        });
    } else if (red_t.length == 1 && blue_t.length == 0) {
        pickEmbed.fields = [];
        pickEmbed.setTitle('JK2 Champions League Teams').addFields({
            name: ':red_circle: Alpha Team:',
            value: red_t.join(', '),
        },
        {
            name: ':blue_circle: Beta Team:',
            value: '\u200b' + 
            '\n\n\n **Unpicked:**\n' + unpicked_players.join(', '),
        },
        {
            name: '\nCappers: ' + capper.join(', ') + '\nReturners: ' + returner.join(', ') + '\nBCs: ' + basecleaner.join(', ') + '\nSupports: ' + support.join(', '),
            value: '\u200b',
        });
    } else if (red_t.length == 0 && blue_t.length == 1) {
        pickEmbed.fields = [];
        pickEmbed.setTitle('JK2 Champions League Teams').addFields({
            name: ':red_circle: Alpha Team:',
            value: '\u200b',
        },
        {
            name: ':blue_circle: Beta Team:',
            value: blue_t.join(', ') + 
            '\n\n\n **Unpicked:**\n' + unpicked_players.join(', '),
        },
        {
            name: '\nCappers: ' + capper.join(', ') + '\nReturners: ' + returner.join(', ') + '\nBCs: ' + basecleaner.join(', ') + '\nSupports: ' + support.join(', '),
            value: '\u200b',
        });
    } else if (red_t.length >= 1 && blue_t.length >= 1) {
        pickEmbed.fields = [];
        pickEmbed.setTitle('JK2 Champions League Teams').addFields({
            name: ':red_circle: Alpha Team:',
            value: red_t.join(', '),
        },
        {
            name: ':blue_circle: Beta Team:',
            value: blue_t.join(', ') + 
            '\n\n\n **Unpicked:**\n' + unpicked_players.join(', '),
        },
        {
            name: '\nCappers: ' + capper.join(', ') + '\nReturners: ' + returner.join(', ') + '\nBCs: ' + basecleaner.join(', ') + '\nSupports: ' + support.join(', '),
            value: '\u200b',
        });
    }
    return pickEmbed;
}




client.on('message', (message) => { 
    if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    //Annoy people now its Dris
    if (command === "annoy") {
        client.users.fetch('407253368143085580').then(user => { 
            user.send('SURPRISE!');
        });
    }


//Position maker
    if (command === 'cap') {
        if (originalNames.includes(message.author.username) && originalNames.length == MAX_PLAYER) {
            if (!cap.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                ret = ret.filter(e => e != nameGenerator(message.author.username));
                bc = bc.filter(e => e != nameGenerator(message.author.username));
                sup = sup.filter(e => e != nameGenerator(message.author.username));
                cap.push(nameGenerator(message.author.username));
            } else if (cap.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                message.channel.send({embed: {
                    color: 0xff0000,
                    author: { name: 'You are already in this position!'},
                }});
            }
        }
        

        if (message.mentions.users.size && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
            message.mentions.users.forEach(e => {
                if(!cap.includes(nameGenerator(e.username)) && originalNames.includes(e.username)){
                    ret = ret.filter(g => g != nameGenerator(e.username));
                    bc = bc.filter(g => g != nameGenerator(e.username));
                    sup = sup.filter(g => g != nameGenerator(e.username));
                    cap.push(nameGenerator(e.username));
                } else if (cap.includes(nameGenerator(e.username))) {
                    message.channel.send({embed: {
                        color: 0xff0000,
                        author: { name: e.username + ' is already in this position!'},
                    }});
                }
            }); 
        }

    } else if (command === 'ret') {
        if (originalNames.includes(message.author.username) && originalNames.length == MAX_PLAYER) {
            if (!ret.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                cap = cap.filter(e => e != nameGenerator(message.author.username));
                bc = bc.filter(e => e != nameGenerator(message.author.username));
                sup = sup.filter(e => e != nameGenerator(message.author.username)); 
                ret.push(nameGenerator(message.author.username));
            } else if (ret.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                message.channel.send({embed: {
                    color: 0xff0000,
                    author: { name: 'You are already in this position!'},
                }});
            }
        }
        

        if (message.mentions.users.size && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
            message.mentions.users.forEach(e => {
                if(!ret.includes(nameGenerator(e.username)) && originalNames.includes(e.username)){
                    cap = cap.filter(g => g != nameGenerator(e.username));
                    bc = bc.filter(g => g != nameGenerator(e.username));
                    sup = sup.filter(g => g != nameGenerator(e.username));
                    ret.push(nameGenerator(e.username));
                } else if (ret.includes(nameGenerator(e.username))) {
                    message.channel.send({embed: {
                        color: 0xff0000,
                        author: { name: e.username + ' is already in this position!'},
                    }});
                }
            });
        }

    } else if (command === 'bc') {
        if (originalNames.includes(message.author.username) && originalNames.length == MAX_PLAYER) {
            if (!bc.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                cap = cap.filter(e => e != nameGenerator(message.author.username));
                ret = ret.filter(e => e != nameGenerator(message.author.username));
                sup = sup.filter(e => e != nameGenerator(message.author.username));
                bc.push(nameGenerator(message.author.username));
            } else if (bc.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                message.channel.send({embed: {
                    color: 0xff0000,
                    author: { name: 'You are already in this position!'},
                }});
            }
        }
        

        if (message.mentions.users.size && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
            message.mentions.users.forEach(e => {
                if(!bc.includes(nameGenerator(e.username)) && originalNames.includes(e.username)){
                    cap = cap.filter(g => g != nameGenerator(e.username));
                    ret = ret.filter(g => g != nameGenerator(e.username));
                    sup = sup.filter(g => g != nameGenerator(e.username));
                    bc.push(nameGenerator(e.username));
                } else if (bc.includes(nameGenerator(e.username))) {
                    message.channel.send({embed: {
                        color: 0xff0000,
                        author: { name: e.username + ' is already in this position!'},
                    }});
                }
            });
        }


    } else if (command === 'sup') {
        if (originalNames.includes(message.author.username) && originalNames.length == MAX_PLAYER) {
            if (!sup.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                cap = cap.filter(e => e != nameGenerator(message.author.username));
                ret = ret.filter(e => e != nameGenerator(message.author.username));
                bc = bc.filter(e => e != nameGenerator(message.author.username));
                sup.push(nameGenerator(message.author.username));
            } else if (sup.includes(nameGenerator(message.author.username)) && !message.mentions.users.size) {
                message.channel.send({embed: {
                    color: 0xff0000,
                    author: { name: 'You are already in this position!'},
                }});
            }
        }
        

        if (message.mentions.users.size && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
            message.mentions.users.forEach(e => {
                if(!sup.includes(nameGenerator(e.username)) && originalNames.includes(e.username)){
                    cap = cap.filter(g => g != nameGenerator(e.username));
                    ret = ret.filter(g => g != nameGenerator(e.username));
                    bc = bc.filter(g => g != nameGenerator(e.username));
                    sup.push(nameGenerator(e.username));
                } else if (sup.includes(nameGenerator(e.username))) {
                    message.channel.send({embed: {
                        color: 0xff0000,
                        author: { name: e.username + ' is already in this position!'},
                    }});
                }
            });
        }
    }    

    if (command === 'color') {
        let args = message.content.split(' ');
        let color = args[1];
        if (/^#[0-9A-F]{6}$/i.test(color)) {
            pickEmbed.setColor(color);
            message.channel.send({embed: {
                color: color,
                author: { name: 'This is the new color for picking!'},
            }});
        } else {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'Color has to be in hexadecimal like this: #00FF00'},
            }});
        }
    }

    //Prefix change
    if (command === 'prefix'&& message.member.hasPermission('ADMINISTRATOR')) {
        let args = message.content.split(' ');
        prefix = args[1];
        console.log(prefix);
    }

    //Reset lobby
    if (command === 'reset' && message.channel.id === CHANNEL_ID && message.member != null && message.member.hasPermission('MANAGE_ROLES')) {
        oNames = [];
        lobbyIdTwo = [];
        tempLobbyTwo = [];
        red_captain = '';
        blue_captain = '';
        red_team = [];
        blue_team = [];
        //unpicked = [];
        cap = [];
        ret = [];
        bc = [];
        sup = [];
        pickRule = '';
        console.log(message.author.username + ' reseted the lobby.');
        message.channel.send('> **Champions League** (' + oNames.length  + '/' + MAX_PLAYER + ')' + ' **|** ' + tempLobbyTwo.join('/'));
    } else if (command === 'reset' && message.channel.id === CHANNEL_ID && message.member != null && !message.member.hasPermission('MANAGE_ROLES')) {
        message.channel.send({embed: {
            color: 0xff0000,
            author: { name: 'You have no permission for this command!'},
        }});
    }

    //Join the lobby
    if (command === 'j' && message.channel.id === CHANNEL_ID) {
        if (!oNames.includes(message.author.username) && !lobbyIdTwo.includes(message.author.id) && oNames.length !== MAX_PLAYER) {
            oNames.push(message.author.username);
            lobbyIdTwo.push(message.author.id);
            console.log(message.author.username + ' joined the lobby.');
            tempLobbyTwo.push(nameGenerator(message.author.username));
            //unpicked.push(nameGenerator(message.author.username));
            if (oNames.length !== MAX_PLAYER) {
                message.channel.send('> **Champions League** (' + oNames.length  + '/' + MAX_PLAYER + ')' + ' **|** ' + tempLobbyTwo.join('/'));
            } else {
                originalNames = oNames;
                lobbyId = lobbyIdTwo;
                unpicked = tempLobbyTwo;
                tempLobby = tempLobbyTwo;
                resetLobby();
                pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
                message.channel.send(pickEmbed);
            }
        } else if (oNames.includes(message.author.username) && lobbyIdTwo.includes(message.author.id)) {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'You have already joined the lobby!'},
            }});
        }
    }

    //Leave the lobby
    if (command === 'l' && message.channel.id === CHANNEL_ID) {
        if (oNames.includes(message.author.username) && lobbyIdTwo.includes(message.author.id) && oNames.length !== MAX_PLAYER) {
            oNames = oNames.filter(e => e != message.author.username);
            lobbyIdTwo = lobbyIdTwo.filter(e => e != message.author.id);
            console.log(message.author.username + ' left the lobby.');
            tempLobbyTwo = tempLobbyTwo.filter(e => e != nameGenerator(message.author.username));
            //unpicked = unpicked.filter(e => e != nameGenerator(message.author.username));
            message.channel.send('> **Champions League** (' + oNames.length  + '/' + MAX_PLAYER + ')' + ' **|** ' + tempLobbyTwo.join('/'));
        } else if (oNames.length == MAX_PLAYER) {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'You cannot leave the lobby!'},
            }});
        } else {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'You are not in the lobby!'},
            }});
        }
    }

    //Who is in the lobby
    if (command === 'who' && message.channel.id === CHANNEL_ID) {
        message.channel.send('> **Champions League** (' + oNames.length  + '/' + MAX_PLAYER + ')' + ' **|** ' + tempLobbyTwo.join('/'));
        console.log(tempLobbyTwo.join('/'));
    }


    //Cointoss
    if (command === 'ct' && message.channel.id === CHANNEL_ID) {
        if (Math.random() >= 0.5 ) {
            message.channel.send(message.author.toString() + ' won, its heads!');
        } else {
            message.channel.send(message.author.toString() + ' lost, its tails!');
        }
    }

    //Remove player
    if (command === 'remove' && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
        if (message.mentions.users.size) {
            const taggedUsername = message.mentions.users.first();
            if (oNames.includes(taggedUsername.username) && lobbyIdTwo.includes(taggedUsername.id)) {
                oNames = oNames.filter(e => e != taggedUsername.username);
                lobbyIdTwo = lobbyIdTwo.filter(e => e != taggedUsername.id);
                console.log(taggedUsername.username + ' removed from the lobby.');
                tempLobbyTwo = tempLobbyTwo.filter(e => e != nameGenerator(taggedUsername.username));
                //unpicked = unpicked.filter(e => e != nameGenerator(taggedUsername.username));
                message.channel.send('> **Champions League** (' + oNames.length  + '/' + MAX_PLAYER + ')' + ' **|** ' + tempLobbyTwo.join('/'));
            } else {
                message.channel.send({embed: {
                    color: 0xff0000,
                    author: { name: taggedUsername.username + ' is not in the lobby!'},
                }});
            }
        } else {
            message.channel.send({embed: {
                color: 0x0099ff,
                author: { name: 'This command should look like this: "=remove @playername"'},
            }});
        }
    } else if (command === 'remove' && message.member != null && !message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
        message.channel.send({embed: {
            color: 0xff0000,
            author: { name: 'You have no permission for this command!'},
        }});
    }

    //Add player
    if (command === 'add' && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
        if (message.mentions.users.size) {
            const taggedUsername = message.mentions.users.first();
            if (!oNames.includes(taggedUsername.username) && !lobbyIdTwo.includes(taggedUsername.id) && oNames.length !== MAX_PLAYER) {
                oNames.push(taggedUsername.username);
                lobbyIdTwo.push(taggedUsername.id);
                console.log(taggedUsername.username + ' added to the lobby.');
                tempLobbyTwo.push(nameGenerator(taggedUsername.username));
                //unpicked.push(nameGenerator(taggedUsername.username));
                if (oNames.length !== MAX_PLAYER) {
                    message.channel.send('> **Champions League** (' + oNames.length  + '/' + MAX_PLAYER + ')' + ' **|** ' + tempLobbyTwo.join('/'));
                } else {
                    originalNames = oNames;
                    lobbyId = lobbyIdTwo;
                    unpicked = tempLobbyTwo;
                    tempLobby = tempLobbyTwo;
                    resetLobby();
                    pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
                    message.channel.send(pickEmbed);
                }
            } else {
                message.channel.send({embed: {
                    color: 0xff0000,
                    author: { name: taggedUsername.username + ' has already joined the lobby!'},
                }});
            }
        } else {
            message.channel.send({embed: {
                color: 0x0099ff,
                author: { name: 'This command should look like this: "=add @playername"'},
            }});
        }
    } else if (command === 'add' && message.member != null && !message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) {
        message.channel.send({embed: {
            color: 0xff0000,
            author: { name: 'You have no permission for this command!'},
        }});
    }

    //Replace
    if (command === 'sub' && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id === CHANNEL_ID) { 
        //Who we want to replace
        replaced_edited_playerName = nameGenerator(message.mentions.users.first().username);
        replaced_player = message.mentions.users.first().username;
        //Who is the replacer
        replacer_edited_playerName = nameGenerator(message.mentions.users.last().username);
        replacer_player = message.mentions.users.last().username;
        
        if (message.mentions.users.size == 2 && !unpicked.includes(replacer_edited_playerName)) {
            if (unpicked.includes(replaced_edited_playerName)) {
                unpicked = unpicked.filter(e => e != replaced_edited_playerName);
                originalNames = originalNames.filter(e => e != replaced_player);
                originalNames.push(replacer_player);
                unpicked.push(replacer_edited_playerName);
            } else if (red_team.includes(replaced_edited_playerName)) {
                red_team = red_team.filter(e => e != replaced_edited_playerName);
                originalNames = originalNames.filter(e => e != replaced_player);
                originalNames.push(replacer_player);
                red_team.push(replacer_edited_playerName);
            } else if (blue_team.includes(replaced_edited_playerName)) {
                blue_team = blue_team.filter(e => e != replaced_edited_playerName);
                originalNames = originalNames.filter(e => e != replaced_player);
                originalNames.push(replacer_player);
                blue_team.push(replacer_edited_playerName);
            } else {
                message.channel.send({embed: {
                    color: 0xff0000,
                    author: { name: 'The player you want to replace has not joined!'},
                }});
            }

            if (cap.includes(replaced_edited_playerName)) {
                cap = cap.filter(e => e != replaced_edited_playerName);
                cap.push(replacer_edited_playerName);
            } else if (ret.includes(replaced_edited_playerName)) {
                ret = ret.filter(e => e != replaced_edited_playerName);
                ret.push(replacer_edited_playerName);
            } else if (bc.includes(replaced_edited_playerName)) {
                bc = bc.filter(e => e != replaced_edited_playerName);
                bc.push(replacer_edited_playerName);
            } else if (sup.includes(replaced_edited_playerName)) {
                sup = sup.filter(e => e != replaced_edited_playerName);
                sup.push(replacer_edited_playerName);
            }

            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            message.channel.send(pickEmbed);
            console.log(replaced_edited_playerName + 'replaced by ' + replacer_edited_playerName);
        } else {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'Wrong Usage! Substitute Player1(joined) with Player2(substitutional) in an active match.'},
            }});
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            message.channel.send(pickEmbed);
        }
    }


    //Commands for the Bot
    if (command === "commands") {
        message.author.send(commandSend.commandEmbed(commandEmbed));
    }

    //Check teams
    if (command === 'teams' && originalNames.length == MAX_PLAYER) {
        pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
        message.channel.send(pickEmbed);
    }

    //Roll
    if (command === 'roll') {
        message.channel.send(message.author.toString() + ' :point_right: ' + (Math.floor(Math.random() * 100) + 1));
    }


    //Cpt rules
    if ((command === "caprule" && nameGenerator(message.author.username) == red_captain) || (command === "caprule" && nameGenerator(message.author.username) == blue_captain) && red_team.length != 0 && blue_team.length != 0) {
        pickRule = "caprule";
        message.channel.send({embed: {
            color: 0x0099ff,
            author: { name: 'Capper pickrule was chosen! ' + red_name + ' has to pick a capper!'},
        }});
        console.log("caprule");

    } else if ((command === "retrule" && nameGenerator(message.author.username) == red_captain) || (command === "retrule" && nameGenerator(message.author.username) == blue_captain && red_team.length != 0 && blue_team.length != 0)) {
        pickRule = "retrule";
        message.channel.send({embed: {
            color: 0x0099ff,
            author: { name: 'Returner pickrule was chosen! ' + red_name +' has to pick a returner!'},
        }});
        console.log("retrule");

    } else if ((command === "bcrule" && nameGenerator(message.author.username) == red_captain) || (command === "bcrule" && nameGenerator(message.author.username) == blue_captain && red_team.length != 0 && blue_team.length != 0)) {
        pickRule = "bcrule";
        message.channel.send({embed: {
            color: 0x0099ff,
            author: { name: 'BC pickrule was chosen! ' + red_name + ' has to pick a capper'},
        }});
        console.log("bcrule");

    } else if ((command === "supportrule" && nameGenerator(message.author.username) == red_captain) || (command === "supportrule" && nameGenerator(message.author.username) == blue_captain && red_team.length != 0 && blue_team.length != 0)) {
        pickRule = "supportrule";
        message.channel.send({embed: {
            color: 0x0099ff,
            author: { name: 'Support pickrule was chosen! ' + red_name + ' has to pick a capper'},
        }});
        console.log("supportrule");
    }



    //Reset cpt pick, cpt rule and captain
    if (command === "cptreset" && message.member != null && message.member.hasPermission('MANAGE_ROLES') && message.channel.id == CHANNEL_ID) {
        red_captain = '';
        blue_captain = '';
        red_team = [];
        blue_team = [];
        pickRule = '';
        unpicked = tempLobby;
        pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
        message.channel.send(pickEmbed);
        console.log('Cpt reset');
        
    } else if (command === 'cptreset' && message.channel.id === CHANNEL_ID && message.member != null && !message.member.hasPermission('MANAGE_ROLES')) {
        message.channel.send({embed: {
            color: 0xff0000,
            author: { name: 'You have no permission for this command!'},
        }});
    }



    //Captain choosing
    if (command === 'cptred' && originalNames.length == MAX_PLAYER && unpicked.includes(nameGenerator(message.author.username))) {
        if (red_captain !== '' && nameGenerator(message.author.username) == blue_captain) {
            blue_captain = '';
            blue_team.pop();
        }
        if (red_captain !== '' && nameGenerator(message.author.username) !== blue_captain) {
            red_team.pop();
            unpicked.push(red_captain);
        }
        red_captain = nameGenerator(message.author.username);
        unpicked = unpicked.filter(e => e != red_captain);
        red_name = message.author.username;
        red_team.push(red_captain);
        console.log('Red captain: ' + red_captain);
        pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
        message.channel.send(pickEmbed);

    } else if (command === 'cptblue' && originalNames.length == MAX_PLAYER && unpicked.includes(nameGenerator(message.author.username))) {
        if (blue_captain !== '' && nameGenerator(message.author.username) == red_captain) {
            red_captain = '';
            red_team.pop();
        }
        if (blue_captain !== '' && nameGenerator(message.author.username) !== red_captain) {
            blue_team.pop();
            unpicked.push(blue_captain);
        }
        blue_captain = nameGenerator(message.author.username);
        unpicked = unpicked.filter(e => e != blue_captain);
        blue_name = message.author.username;
        blue_team.push(blue_captain);
        console.log('Blue captain: ' + blue_captain);
        pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
        message.channel.send(pickEmbed);

    } else if ((command === 'cptblue' || command === 'cptred' || command === 'switch') && red_team.length >= 2) {
        message.channel.send({embed: {
            color: 0xff0000,
            author: { name: 'The picking has already begun!'},
        }});
    } else if (command === 'switch' && (red_captain == nameGenerator(message.author.username) || blue_captain == nameGenerator(message.author.username) || message.member.hasPermission('MANAGE_ROLES'))) {
        red_name = blue_name;
        blue_captain = red_team[0];
        red_captain = blue_team[0];
        red_team.pop();
        blue_team.pop();
        blue_team.push(blue_captain);
        red_team.push(red_captain);
        console.log('Red captain: ' + red_captain);
        console.log('Blue captain: ' + blue_captain);
        pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
        message.channel.send(pickEmbed);
    }


    //Picking
    if (command === 'pick' && message.channel.id == CHANNEL_ID && message.mentions.users.size == 1 && pickRule == "bcrule") {
        taggedUser = message.mentions.users.first();
        taggedUsername = nameGenerator(taggedUser.username);

        //First red pick, red_team has 2 member with captain  
        if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_team[0] && unpicked.length != 0 && red_team.length != 2 && blue_team.length == 1) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);
            
                
        //First blue pick, blue_team has 2 member with captain 
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_team[0] && unpicked.length != 0 && red_team.length == 2 && blue_team.length < 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);

        //Second blue pick, blue_team has 3 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 2 && blue_team.length == 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);    


        //Second red pick, red_team has 3 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_captain && unpicked.length != 0 && red_team.length == 2 && blue_team.length == 3) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);    

        //Third blue pick, blue_team has 4 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_captain && unpicked.length != 0 && red_team.length == 3 && blue_team.length == 3) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);    


        //Third red pick, red_team has 4 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 4 && blue_team.length == 3) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);

        //Fourth blue pick, blue_team has 5 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 4 && blue_team.length == 4) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);    

        //Fourth red pick, red_team has 5 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_captain && unpicked.length != 0 && red_team.length == 4 && blue_team.length == 5) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a support!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);

        //Fifth blue pick, blue_team has 6 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 5 && blue_team.length == 5) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            console.log("Blue picked " + taggedUsername);
            red_team.push(unpicked[0]);
            unpicked = [];
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            message.channel.send(pickEmbed);
            tagLobbyMembers();
            message.channel.send('**Game started! Good luck and have fun boys and girls!**\n' + tagMembers.join(', '));
            console.log('Red Team: ' + red_team.join(', ') + ' Blue Team: ' + blue_team.join(', ') + ' Unpicked: ' + unpicked.join(', '));
        } else {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'Not your turn!'},
            }});
        } 
    } else if (command === 'pick' && message.channel.id == CHANNEL_ID && message.mentions.users.size == 1 && pickRule == "caprule") {
        console.log("pick");
        taggedUser = message.mentions.users.first();
        taggedUsername = nameGenerator(taggedUser.username);

        //First red pick, red_team has 2 member with captain
        //A
        if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length != 2 && blue_team.length == 1) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 

        //First blue pick, blue_team has 2 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 2 && blue_team.length < 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Second blue pick, blue_team has 3 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 2 && blue_team.length == 2) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 

        //Second red pick, red_team has 3 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 3 && blue_team.length == 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Third blue pick, blue_team has 4 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 3 && blue_team.length == 3) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Third red pick, red_team has 4 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 3 && blue_team.length == 4) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a bc!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 

        //Fourth blue pick, blue_team has 5 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 4 && blue_team.length == 4) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a bc!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Fourth red pick, red_team has 5 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 4 && blue_team.length == 5) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a support!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 

        //Fifth blue pick, blue_team has 6 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 5 && blue_team.length == 5) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            console.log("Red picked " + taggedUsername); 
            blue_team.push(unpicked[0]);
            unpicked = [];
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            message.channel.send(pickEmbed);
            tagLobbyMembers();
            message.channel.send('**Game started! Good luck and have fun boys and girls!**\n' + tagMembers.join(', '));
            console.log('Red Team: ' + red_team.join(', ') + ' Blue Team: ' + blue_team.join(', ') + ' Unpicked: ' + unpicked.join(', '));

        } else {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'Not your turn!'},
            }});
        } 
    } else if (command === 'pick' && message.channel.id == CHANNEL_ID && message.mentions.users.size == 1 && pickRule == "retrule") {
        console.log("pick");
        taggedUser = message.mentions.users.first();
        taggedUsername = nameGenerator(taggedUser.username);

        //First red pick, red_team has 2 member with captain
        //A
        if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length != 2 && blue_team.length == 1) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 


        //First blue pick, blue_team has 2 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 2 && blue_team.length < 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Second blue pick, blue_team has 3 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 2 && blue_team.length == 2) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 

        //Second red pick, red_team has 3 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 3 && blue_team.length == 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Third blue pick, blue_team has 4 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 3 && blue_team.length == 3) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Third red pick, red_team has 4 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 3 && blue_team.length == 4) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a bc!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 

        //Fourth blue pick, blue_team has 5 member with captain
        //B
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === blue_captain && unpicked.length !== 0 && red_team.length == 4 && blue_team.length == 4) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a bc!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername); 

        //Fourth red pick, red_team has 5 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 4 && blue_team.length == 5) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a support!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername); 

        //Fifth blue pick, blue_team has 6 member with captain
        //A
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) === red_captain && unpicked.length !== 0 && red_team.length == 5 && blue_team.length == 5) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            console.log("Red picked " + taggedUsername); 
            blue_team.push(unpicked[0]);
            unpicked = [];
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            message.channel.send(pickEmbed);
            tagLobbyMembers();
            message.channel.send('**Game started! Good luck and have fun boys and girls!**\n' + tagMembers.join(', '));
            console.log('Red Team: ' + red_team.join(', ') + ' Blue Team: ' + blue_team.join(', ') + ' Unpicked: ' + unpicked.join(', '));

        } else {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'Not your turn!'},
            }});
        } 
    } else if (command === 'pick' && message.channel.id == CHANNEL_ID && message.mentions.users.size == 1 && pickRule == "supportrule") {
        console.log("pick");
        taggedUser = message.mentions.users.first();
        taggedUsername = nameGenerator(taggedUser.username);

        //First red pick, red_team has 2 member with captain  
        if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_team[0] && unpicked.length != 0 && red_team.length != 2 && blue_team.length == 1) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);
                
        //First blue pick, blue_team has 2 member with captain 
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_team[0] && unpicked.length != 0 && red_team.length == 2 && blue_team.length < 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);

        //Second blue pick, blue_team has 3 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 2 && blue_team.length == 2) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a capper!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);    


        //Second red pick, red_team has 3 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_captain && unpicked.length != 0 && red_team.length == 2 && blue_team.length == 3) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);    

        //Third blue pick, blue_team has 4 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_captain && unpicked.length != 0 && red_team.length == 3 && blue_team.length == 3) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);    


        //Third red pick, red_team has 4 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 4 && blue_team.length == 3) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);

        //Fourth blue pick, blue_team has 5 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 4 && blue_team.length == 4) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(red_captain + " pick a returner!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Blue picked " + taggedUsername);    

        //Fourth red pick, red_team has 5 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == red_captain && unpicked.length != 0 && red_team.length == 4 && blue_team.length == 5) {
            red_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            pickEmbed.addField(blue_captain + " pick a bc!", '\u200B');
            message.channel.send(pickEmbed);
            console.log("Red picked " + taggedUsername);

        //Fifth blue pick, blue_team has 6 member with captain
        } else if (unpicked.includes(taggedUsername) && nameGenerator(message.author.username) == blue_captain && unpicked.length != 0 && red_team.length == 5 && blue_team.length == 5) {
            blue_team.push(taggedUsername);
            unpicked = unpicked.filter(e => e != taggedUsername);
            console.log("Blue picked " + taggedUsername);
            red_team.push(unpicked[0]);
            unpicked = [];
            pickPrint(red_team, blue_team, unpicked, cap, ret, bc, sup);
            message.channel.send(pickEmbed);
            tagLobbyMembers();
            message.channel.send('**Game started! Good luck and have fun boys and girls!**\n' + tagMembers.join(', '));
            console.log('Red Team: ' + red_team.join(', ') + ' Blue Team: ' + blue_team.join(', ') + ' Unpicked: ' + unpicked.join(', '));    

        } else {
            message.channel.send({embed: {
                color: 0xff0000,
                author: { name: 'Not your turn!'},
            }});
        } 
    }
});
