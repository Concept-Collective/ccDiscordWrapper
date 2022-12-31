-- Resource Metadata
fx_version 'cerulean'
games { 'rdr3', 'gta5' }

author 'Concept Collective <admin@conceptcollective.net>'
description 'CC Discord Status'
version '1.0.0'

-- What to run
client_scripts {
    'client/main.js',
}
server_scripts { 
    'server/main.js',
    'env.js',
}

DiscordRPCEnabled 'true'
DiscordAppId '832645255286882305'
DiscordRPCAssetLarge 'ccLogo'
DiscordRPCTextLarge 'Large Text'
DiscordRPCAssetSmall 'ccLogo'
DiscordRPCTextSmall 'Small Text'
DiscordRPCAction1URL 'https://conceptcollective.net'
DiscordRPCAction1Text 'Website'
DiscordRPCAction2URL 'fivem://connect/cfx.re/join/jmxv9m'
DiscordRPCAction2Text 'Join Now!'

DiscordStatusEnabled 'true'
DiscordStatusChannelId '933964742651969556'
DiscordStatusPlayerNames 'true'
DiscordStatusEmbedTitle 'Concept Collective'
DiscordStatusEmbedURL 'https://conceptcollective.net'
DiscordStatusEmbedThumbnail 'https://cdn.discordapp.com/attachments/672308435534086149/1053879929848209418/idk.png'