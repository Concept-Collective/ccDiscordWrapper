onNet('onServerConfigLoad', (config) => {
    SetDiscordAppId(config.General.appID);
    SetDiscordRichPresenceAction(0, config.DiscordRPC.actions.action1.name, config.DiscordRPC.actions.action1.url);
    SetDiscordRichPresenceAction(1, config.DiscordRPC.actions.action2.name, config.DiscordRPC.actions.action2.url);
    SetDiscordRichPresenceAsset(config.DiscordRPC.assetLarge);
    SetDiscordRichPresenceAssetText(config.DiscordRPC.textLarge);
    SetDiscordRichPresenceAssetSmall(config.DiscordRPC.assetSmall);
    SetDiscordRichPresenceAssetSmallText(config.DiscordRPC.textSmall);
    SetRichPresence(`${GetNumberOfPlayers()} player(s) connected`);
});