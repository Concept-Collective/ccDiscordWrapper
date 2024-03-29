const fs = require('node:fs');
const path = require('node:path');
const fetch = require('node-fetch');
const sleep = m => new Promise(r => setTimeout(r, m))

// Serverside Configuration
const root = GetResourcePath(GetCurrentResourceName());
let env_config = require(path.join(root, 'env.js'));

// Requires external module due to JSONC not being a standard JSON format
const parser = require('jsonc-parser');
const config = parser.parse(LoadResourceFile('ccDiscordWrapper', 'config.jsonc'))

// Framework stuff
let ESX = undefined
let QBCore = undefined

if (config.General.IsServerUsingQBCore === true) {
	QBCore = exports['qb-core'].GetCoreObject()
} if (config.General.IsServerUsingESX === true) {
	ESX = exports['es_extended'].getSharedObject()
}

// Discord.js initialisation for Discord Bot Module
const { Client, Collection, GatewayIntentBits, EmbedBuilder, WebhookClient } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers] });

// Support Checker - Checks if the resource is named correctly
on("onResourceStart", async (resourceName) => {
	if (GetCurrentResourceName() !== "ccDiscordWrapper" && config.supportChecker === true) {
		return console.warn(`^6[Warning]^0 For better support, it is recommended that "${GetCurrentResourceName()}" be renamed to "ccDiscordWrapper"^0`);
	}
	if (GetCurrentResourceName() === resourceName && config.versionChecker === true){
		const response = await fetch('https://api.github.com/repos/Concept-Collective/ccDiscordWrapper/releases/latest')
		const json = await response.json()
		if (json.message && json.message.includes('API rate limit exceeded')) {
			return console.warn(`^6[Warning]^0 ccDiscordWrapper version checker is currently unavailable due to GitHub API rate limiting. Please try again later.^0`)
		}
		if (json.tag_name !== `v${GetResourceMetadata(GetCurrentResourceName(), 'version', 0)}`){
			console.warn(`^3[WARNING]^0 ccDiscordWrapper is out of date! Please update to the latest version: ^2${json.tag_name}^0`)
		} else {
			console.log(`^2[INFO]^0 ccDiscordWrapper is up to date [^2v${GetResourceMetadata(GetCurrentResourceName(), 'version', 0)}^0]!`)
		}
	}

	if (GetCurrentResourceName() === resourceName && config.General.disableHardCap === true) {
		StopResource("hardcap");
	}
	
	if (GetCurrentResourceName() === resourceName && config.General.compatibilityMode === true) {
		StopResource("connectqueue");
		StopResource("zqueue");
		StopResource("bad-discordqueue");
	}
});

// Discord Bot Module
if (config.DiscordBot.enabled === true){
	discordProcess();
}

function discordProcess() {
	client.commands = new Collection();
	client.QBCore = QBCore;
	client.ESX = ESX;
	client.discord = require('discord.js');
	client.config = config;
	client.players = {};
	client.statusMessage = null;
	
	const commandsPath = path.join(root, 'server', 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	
	const eventsPath = path.join(root, 'server', 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
	
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
	
	client.login(env_config.Discord_Token);
	
	// Discord Bot Module - senNewMessage function
	async function botSendNewMessage(channelId, message){
		const channel = await client.channels.cache.get(channelId);
		getGuildUsersandRolesforIngamePlayers(channel.guild.id)
		let newEmbed = new client.discord.EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`${message[0]}`)
		.setDescription(`${message[1]}`)
		.setTimestamp()
		.setFooter({ text: 'This message was generated by ccDiscordWrapper', iconURL: 'https://conceptcollective.net/img/icon.png', URL: 'https://conceptcollective.net' });
		await channel.send({embeds: [newEmbed]});
	}
	
	async function webhookSendNewMessage(color, name, message, footer) {
		const webhookClient = new WebhookClient({ url: env_config.Discord_Webhook });
		let embed = new EmbedBuilder()
			.setColor(color)
			.setTitle(name)
			.setDescription(message)
			.setTimestamp()
			.setFooter({ text: `${footer} | Generated by ccDiscordWrapper`, iconURL: 'https://conceptcollective.net/img/icon.png', URL: 'https://conceptcollective.net' });

		webhookClient.send({embeds: [embed]});
	}

	function isPlayerInDiscord(source) {
		let playerName = GetPlayerName(source);
		let isPlayerInGuild = client.players[playerName].inGuild
		return isPlayerInGuild
	}

	function getPlayerDiscordAvatar(source) {
		let playerName = GetPlayerName(source);
		let avatarURL = client.players[playerName].avatarURL
		return avatarURL
	}

	function getPlayerDiscordRoles(source) {
		let playerName = GetPlayerName(source);
		let roles = client.players[playerName].roles
		return roles
	}

	function getPlayerDiscordHighestRole(source, type) {
		let playerName = GetPlayerName(source);
		if (type === "name") {
			let highestRole = client.players[playerName].roles[0].name
			return highestRole
		} else {
			let highestRole = client.players[playerName].roles[0]
			return highestRole
		}
	}
	
	function checkIfPlayerHasRole(source, role, type) {
		let playerName = GetPlayerName(source);
		if (type === "name"){
			let hasRole = client.players[playerName].roles.filter(rolef => rolef.name === role)
			return hasRole
		} else if (type === "id"){
			let hasRole = client.players[playerName].roles.filter(rolef => rolef.id === role)
			return hasRole
		}
	}

	function checkIfPlayerIsWhitelisted(discordID, response) {
		const serverGuild = client.guilds.cache.get(client.config.General.serverID);
		const serverGuildMember = serverGuild.members.cache.get(discordID);
		const doesPlayerHaveRole = serverGuildMember.roles.cache.get(client.config.DiscordBot.DiscordWhitelist.roleID)

		if (config.Debug === true) {
			console.log(`[DEBUG] Guild Data: ${JSON.stringify(serverGuild.toJSON())}`);
			console.log(`[DEBUG] Guild Member Data: ${JSON.stringify(serverGuildMember.toJSON())}`)
		}
		if (response === 'roles'){
			let memberRoles = serverGuildMember.roles.cache.map(role => role)
			return JSON.stringify(memberRoles)
		}
		if (doesPlayerHaveRole !== undefined) {
			if (doesPlayerHaveRole.id === client.config.DiscordBot.DiscordWhitelist.roleID) {
				return true
			}
		} else {
			return false
		}
	}

	exports('botSendNewMessage', botSendNewMessage);
	exports('webhookSendNewMessage', webhookSendNewMessage);
	exports('getPlayerDiscordAvatar', getPlayerDiscordAvatar);
	exports('getPlayerDiscordHighestRole', getPlayerDiscordHighestRole);
	exports('isPlayerInDiscord', isPlayerInDiscord);
	exports('checkIfPlayerHasRole', checkIfPlayerHasRole);
	exports('getPlayerDiscordRoles', getPlayerDiscordRoles);
	exports('checkIfPlayerIsWhitelisted', checkIfPlayerIsWhitelisted)
}

let Queue = {}
Queue.MaxPlayers = GetConvarInt("sv_maxclients", 48)
Queue.Players = []

Queue.QueuePriority = config.DiscordBot.DiscordConnectQueue.rolePriority.length
if (config.onJoinAdaptiveCard.enabled === true){

	on('playerConnecting', async (playerName, setKickReason, deferrals) => {
		let playerDiscordID = '';
		let playerSteamID = '';
		if (config.General.IsServerUsingQBCore === true) {
			playerDiscordID = QBCore.Functions.GetIdentifier(source, 'discord')
		} else {
			playerDiscordID = GetPlayerIdentifierByType(source, 'discord')
		}
		if (config.General.IsDiscordRequired === true){
			if (!playerDiscordID) {
				setKickReason(`\n\n🚧 Border Patrol\n\nDiscord was not found please relaunch FiveM with Discord running\n\nFor further support visit ${config.General.serverInviteURL}!`)
				CancelEvent()
				return
			}
		}
		if (config.General.IsSteamRequired === true){
			if (config.General.IsServerUsingQBCore === true) {
				playerSteamID = QBCore.Functions.GetIdentifier(source, 'steam')
			} else { 
				playerSteamID = GetPlayerIdentifierByType(source, 'steam')
			}
			if (!playerSteamID) {
				if (config.General.IsServerUsingQBCore === true) {
					console.warn('[WARN] QBCore has removed the ability to get steam identifiers, please use a different framework or disable the steam requirement in config.jsonc!')
				} else {
					setKickReason(`\n\n🚧 Border Patrol\n\nSteam was not found please relaunch FiveM with Steam running\n\nFor further support visit ${config.General.serverInviteURL}!`)
					CancelEvent()
					return
				}
			}
		}
		playerDiscordID = playerDiscordID.substring(8)
		playerSteamID = playerSteamID.substring(7)
		if (config.DiscordBot.DiscordWhitelist.enabled === true && config.DiscordBot.enabled === true){
			let isPlayerWhitelisted = exports.ccDiscordWrapper.checkIfPlayerIsWhitelisted(playerDiscordID, 'boolean')
			if (isPlayerWhitelisted === false){
				console.warn(`^5Player ^3${playerName} ^5has attempted to join the server but ^8is not whitelisted and has been kicked^0!`)
				setKickReason(`\n\n🚧 Border Patrol\n\nYou are not whitelisted therefore access to this server is prohibited\n\nFor further support visit ${config.General.serverInviteURL}!`)
				CancelEvent()
				return
			}
		} else if (config.DiscordBot.DiscordWhitelist.enabled === true && config.DiscordBot.enabled !== true) {
			return console.warn('Discord Whitelist is enabled but Discord Bot module is not enabled therefor it will not work!')
		}
		let adaptiveCard = {
			"type": "AdaptiveCard",
			"version": "1.6",
			"body": [
				{
					"type": "ColumnSet",
					"columns": [
						{
							"type": "Column",
							"width": "20px"
						},
						{
							"type": "Column",
							"width": "stretch",
							"items": [
								{
									"type": "TextBlock",
									"text": `${config.onJoinAdaptiveCard.mainTitle}`,
									"wrap": true,
									"style": "heading",
									"horizontalAlignment": "Center",
									"size": "ExtraLarge",
									"maxLines": 1
								}
							]
						}
					]
				},
				{
					"type": "Container",
					"items": [
						{
							"type": "ColumnSet",
							"columns": [
								{
									"type": "Column",
									"width": "auto",
									"items": [
										{
											"type": "Image",
											"url": `${config.onJoinAdaptiveCard.logoURL}`,
											"size": "Medium",
											"altText": "Concept Collective Logo",
											"spacing": "None",
											"horizontalAlignment": "Center"
										},
										{
											"type": "TextBlock",
											"text": `${config.onJoinAdaptiveCard.logoText}`,
											"horizontalAlignment": "Center",
											"weight": "Bolder",
											"wrap": true
										}
									]
								},
								{
									"type": "Column",
									"width": "stretch",
									"separator": true,
									"spacing": "Medium",
									"items": [
										{
											"type": "TextBlock",
											"text": `${new Date().toLocaleString(config.onJoinAdaptiveCard.timeLocale.timeFormat, { timeZone: config.onJoinAdaptiveCard.timeLocale.timeZone })}`,
											"horizontalAlignment": "Center",
											"wrap": true
										},
										{
											"type": "TextBlock",
											"text": `${config.onJoinAdaptiveCard.mainDescription}`,
											"size": "Medium",
											"horizontalAlignment": "Center",
											"wrap": true
										},
										{
											"type": "TextBlock",
											"text": `${config.onJoinAdaptiveCard.otherDescription}`,
											"size": "Large",
											"horizontalAlignment": "Center",
											"style": "heading",
											"wrap": true
										}
									]
								},
								{
									"type": "Column",
									"width": "100px"
								}
							]
						}
					]
				},
				{
					"type": "ColumnSet",
					"columns": [
						{
							"type": "Column",
							"width": "240px"
						},
						{
							"type": "Column",
							"width": "150px",
							"items": [
								{
									"type": "ActionSet",
									"actions": [
										{
											"type": "Action.OpenUrl",
											"title": "Discord",
											"url": "https://discord.conceptcollective.net",
											"style": "positive"
										}
									],
									"spacing": "None",
									"horizontalAlignment": "Center"
								}
							]
						},
						{
							"type": "Column",
							"width": "135px",
							"items": [
								{
									"type": "ActionSet",
									"actions": [
										{
											"type": "Action.Submit",
											"title": "Play Now!",
											"style": "positive",
											"id": "playSubmit"
										}
									]
								}
							]
						},
						{
							"type": "Column",
							"width": "150px",
							"items": [
								{
									"type": "ActionSet",
									"actions": [
										{
											"type": "Action.OpenUrl",
											"title": "Website",
											"style": "positive",
											"url": "https://conceptcollective.net"
										}
									]
								}
							]
						}
					]
				}
			]
		}
		deferrals.defer()
		deferrals.update(`Hello ${playerName}. Your Discord ID is being checked...`)
		await sleep(1000);
		deferrals.presentCard(adaptiveCard, function(data, rawData) {
			if (config.Debug === true) {
				console.log(`[DEBUG] Adaptive Card Data: ${JSON.stringify(data)}`)
			}
			if (data.submitId === 'playSubmit') {
				if (config.DiscordBot.DiscordConnectQueue.enabled === true) {
					deferrals.update(`You have been added to the queue - Please wait...`)
					let playerDiscordRoles = JSON.parse(exports.ccDiscordWrapper.checkIfPlayerIsWhitelisted(playerDiscordID, 'roles'))
					let queuePriority = config.DiscordBot.DiscordConnectQueue.rolePriority.length + 1
					config.DiscordBot.DiscordConnectQueue.rolePriority.forEach((role, index) => {
						let doesPlayerHavePriorityRole = playerDiscordRoles.filter(rolef => rolef.id === role)
						if (doesPlayerHavePriorityRole.length > 0) {
							if (index < queuePriority) {
								queuePriority = index / Queue.QueuePriority.length
								queueMath = Math.round(queuePriority * Queue.Players.length)
								let newArray = [...Queue.Players.slice(0, queueMath), playerName, ...Queue.Players.slice(queueMath)]
								Queue.Players = newArray
							}
						}
					})
					if (Queue.Players.filter(player => player === playerName).length === 0) {
						Queue.Players.push(playerName)
					}
					const queueCheck = setInterval(function() {
						if (Queue.Players[0] === playerName) {
							if (config.Debug === true) {
								console.log(`[DEBUG] Player ${playerName} has just finished in the queue.`)
							}
							deferrals.done()
							Queue.Players.shift()
							clearInterval(queueCheck)
						} else {
							deferrals.update(`You are currently ${Queue.Players.indexOf(playerName) + 1} out of ${Queue.Players.length} in the queue - Please wait...`)
						}
					}, 1000)
				} else {
					deferrals.done()
				}
			}
		})
	});

}