
function commandEmbed(embed) {
    embed.setColor('0x0099ff').setTitle('Commands for the Bot:').addFields(
        {
            name: "=j",
            value: "Use this command to join the lobby."
        },
        {
            name: "=l",
            value: "Use this command to leave the lobby."
        },
        {
            name: "=who",
            value: "Use this command to know who is in the lobby."
        },
        {
            name: "=add @playername",
            value: "Use this command to add a player to the lobby. (Batcher and Council members can use it.)"
        },
        {
            name: "=remove @player",
            value: "Use this command to remove a player from the lobby. (Batcher and Council members can use it.)"
        },
        {
            name: "=cptred and =cptblue",
            value: "Use these command to be captain when the lobby is full."
        },
        {
            name: "=reset",
            value: "Use this command to reset the lobby. (Batcher and Council members can use it.)"
        },
        {
            name: "=cptreset",
            value: "Use this command to reset the captains and the cpt rule. It makes everybody unpicked. (Batcher and Council members can use it.)"
        },
        {
            name: "=bcrule, =caprule, =retrule, =supportrule",
            value: "Use this command to set the cpt rule when you are the captain."
        },
        {
            name: "=pick @playername",
            value: "Use this command to pick somebody."
        },
        {
            name: "=ct",
            value: "Use this command to check your luck with the cointoss."
        },
        {
            name: "=cap, =ret, =bc, =sup (Players can use it.) || same commands with one or more @playername (Batcher and Council members can use it.)",
            value: "Use this command to set your position."
        },
        {
            name: "=teams",
            value: "Use this command to check the cpt teams."
        },
        {
            name: "=switch",
            value: "Use this command to switch side."
        },
        {
            name: "=color #hexadecimal code",
            value: "Use this command to change the picking table color."
        },
        {
            name: "=roll",
            value: "Give a number between 1 and 100 cause why not."
        },
        {
            name: "=sub @Player1 @Player2",
            value: "Substitute Player1(joined) with Player2(substitutional) in an active match."
        },
        {
            name: "ping",
            value: "Use this command to find out that the bot is online or not."
        },
        );
    return embed;
}


module.exports = { commandEmbed };