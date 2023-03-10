-- Resource Metadata
fx_version 'cerulean'
games { 'rdr3', 'gta5' }

author 'Concept Collective <contact@conceptcollective.net>'
description 'ccDiscordWrapper - Discord Wrapper for FiveM'
version '0.1.0'

-- What to run
client_scripts {
    'client/main.js',
}
server_scripts { 
    'server/main.js',
    'env.js',
}

server_exports {
    'sendNewMessage'
}

IsServerUsingESX 'true'

DiscordRPCEnabled 'true'                                                                                            -- Whether or not to enable ccDiscordWrapper Discord Rich Presence modules
DiscordAppId '832645255286882305'                                                                                   -- Discord Application ID (can be found at the Discord Developer Portal: https://discord.com/developers/applications)
DiscordRPCAssetLarge 'cclogo'                                                                                       -- Discord Rich Presence Large Asset Name (https://discord.com/developers/applications/xxxxxxxxxxxxxxxxxxxx/rich-presence/assets)
DiscordRPCTextLarge 'Large Text'                                                                                    -- Discord Rich Presence Large Asset Hover Text 
DiscordRPCAssetSmall 'cclogo'                                                                                       -- Discord Rich Presence Small Asset Name (https://discord.com/developers/applications/xxxxxxxxxxxxxxxxxxxx/rich-presence/assets)
DiscordRPCTextSmall 'Small Text'                                                                                    -- Discord Rich Presence Small Asset Hover Text 
DiscordRPCAction1URL 'https://conceptcollective.net'                                                                -- Discord Rich Presence Action #1 URL
DiscordRPCAction1Text 'Website'                                                                                     -- Discord Rich Presence Action #1 Text 
DiscordRPCAction2URL 'fivem://connect/cfx.re/join/jmxv9m'                                                           -- Discord Rich Presence Action #2 URL
DiscordRPCAction2Text 'Join Now!'                                                                                   -- Discord Rich Presence Action #2 Text 

DiscordStatusEnabled 'true'                                                                                         -- Whether or not to enable the ccDiscordWrapper Discord Player Count module
DiscordStatusChannelId '1060555091838521445'                                                                        -- Discord Channel ID to send embed messages to (https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
DiscordStatusPlayerNames 'true'                                                                                     -- True: Will show player names along side players Discord || False: Will only show player count
DiscordStatusEmbedTitle 'Concept Collective'                                                                        -- Discord message embed Title
DiscordStatusEmbedURL 'https://conceptcollective.net'                                                               -- Discord message embed URL
DiscordStatusEmbedThumbnail 'https://cdn.discordapp.com/attachments/672308435534086149/1053879929848209418/idk.png' -- Discord message embed Thumbnail
DiscordStatusChannelCount '1060555091838521445'                                                                     -- Enables FiveM Player Count to update the specified Discord Channel Name, set to 'false' to disable

supportChecker 'true'                                                                                               -- Automatic checker to help fix and problems you may be facing.
versionChecker 'true'                                                                                               -- Automatic version checker to keep this script up-to-date