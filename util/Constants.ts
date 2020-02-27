export default class Constants {
    public static getXpFromLevel = (nivel: number) => Math.floor(((nivel / 0.2) * (nivel / 0.3)) * Math.PI);
    public static OWNERS_LIST = ['376460601909706773'];
    public static WHITE_PHOENIX = '#f2f2f2';
    public static DUPLICATED_CHARS_REGEX = /(.)\1{2,}/gi;
    public static CAPS_LOCK_REGEX = /([A-Z])\1{2,}/gi;
    public static DISCORD_INVITES_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)? ((?:discord\.gg|discordapp\.com))/gi;
    public static LINKS_REGEX = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    public static VERSION = '0.0.1 - ALPHA'
}