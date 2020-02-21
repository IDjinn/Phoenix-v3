export default class Constants {
    public static getXpFromLevel = (nivel: number) => Math.floor(((nivel / 0.2) * (nivel / 0.3)) * Math.PI);
}