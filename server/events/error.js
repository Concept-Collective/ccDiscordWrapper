const { Events } = require('discord.js');

module.exports = {
	name: Events.Error,
	execute(error) {
		console.warn(`An error event was sent by Discord.js: \n${JSON.stringify(error)}`)
	},
};