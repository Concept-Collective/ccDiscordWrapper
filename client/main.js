on('onClientResourceStart', () => {
    if (GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCEnabled') === true){
        SetDiscordAppId(GetResourceMetadata(GetCurrentResourceName(), 'DiscordAppId'));
        SetDiscordRichPresenceAction(0, GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCAction1Text'), GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCAction1URL'));
        SetDiscordRichPresenceAction(1, GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCAction2Text'), GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCAction2URL'));
        SetDiscordRichPresenceAsset(GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCAssetLarge'));
        SetDiscordRichPresenceAssetText(GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCTextLarge'));
        SetDiscordRichPresenceAssetSmall(GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCAssetSmall'));
        SetDiscordRichPresenceAssetSmallText(GetResourceMetadata(GetCurrentResourceName(), 'DiscordRPCTextSmall'));
        SetRichPresence('Custom Presence');
    } else {
        return;
    }
});