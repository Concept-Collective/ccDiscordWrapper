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

DiscordRPCEnabled 'true'                                                                                            -- Whether or not to enable CC-DiscordStatus Discord Rich Presence modules
DiscordAppId '832645255286882305'                                                                                   -- Discord Application ID (can be found at the Discord Developer Portal: https://discord.com/developers/applications)
DiscordRPCAssetLarge 'ccLogo'                                                                                       -- Discord Rich Presence Large Asset Name (https://discord.com/developers/applications/xxxxxxxxxxxxxxxxxxxx/rich-presence/assets)
DiscordRPCTextLarge 'Large Text'                                                                                    -- Discord Rich Presence Large Asset Hover Text 
DiscordRPCAssetSmall 'ccLogo'                                                                                       -- Discord Rich Presence Small Asset Name (https://discord.com/developers/applications/xxxxxxxxxxxxxxxxxxxx/rich-presence/assets)
DiscordRPCTextSmall 'Small Text'                                                                                    -- Discord Rich Presence Small Asset Hover Text 
DiscordRPCAction1URL 'https://conceptcollective.net'                                                                -- Discord Rich Presence Action #1 URL
DiscordRPCAction1Text 'Website'                                                                                     -- Discord Rich Presence Action #1 Text 
DiscordRPCAction2URL 'fivem://connect/cfx.re/join/jmxv9m'                                                           -- Discord Rich Presence Action #2 URL
DiscordRPCAction2Text 'Join Now!'                                                                                   -- Discord Rich Presence Action #2 Text 

DiscordStatusEnabled 'true'                                                                                         -- Whether or not to enable the CC-DiscordStatus Discord Player Count module
DiscordStatusChannelId '933964742651969556'                                                                         -- Discord Channel ID to send embed messages to (https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)
DiscordStatusPlayerNames 'true'                                                                                     -- True: Will show player names along side players Discord || False: Will only show player count
DiscordStatusEmbedTitle 'Concept Collective'                                                                        -- Discord message embed Title
DiscordStatusEmbedURL 'https://conceptcollective.net'                                                               -- Discord message embed URL
DiscordStatusEmbedThumbnail 'https://cdn.discordapp.com/attachments/672308435534086149/1053879929848209418/idk.png' -- Discord message embed Thumbnail

supportChecker 'true'                                                                                               -- Automatic checker to help fix and problems you may be facing.
versionChecker 'true'                                                                                               -- Automatic version checker to keep this script up-to-date