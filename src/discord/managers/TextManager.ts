/*import AbstractManager from "../structures/AbstractManager";
import { Collection } from "discord.js";
import { format as stringFormat } from 'util';

export default class TextManager extends AbstractManager{
    private static texts = new Collection<Languages, Collection<string, string>>();
    constructor() {
        super('TextManager');
    }
    public init(): void {
        TextManager.texts.set()
    }
    public destroy(): void {
        throw new Error("Method not implemented.");
    }
    public static t(language: Languages, key: string, values: any[]): string{
        const texts = this.texts.get(language);
        if (texts) {
            return stringFormat(texts.get(key), values);
        }
        return stringFormat(key, values);
    }
}

export enum Languages{
    ptBr
}*/