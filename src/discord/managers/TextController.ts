import { Collection } from "discord.js";
import { readdirSync } from 'fs';
import { join as pathJoin } from 'path';
import format from 'string-format';

export default class TextController {
    private texts = new Collection<Language, any>();

    public init() {
        const languagesPath = pathJoin(__dirname, '../lang');
        for (const file of readdirSync(languagesPath)) {
            const language = require(`${languagesPath}/${file}`);
            this.texts.set(this.parseLanguage(file.replace('.json', '')), language);
        }
    }

    public destroy() {
        this.texts.clear();
    }

    public t(lang: Language, key: string, ...args: any[]): string {
        const keys = key.split('.');
        let value = this.texts.get(lang) || this.texts.get(Language.en_US);
        for (const subKey of keys) {
            value = value[subKey];
        }
        return format(value, args);
    }

    public parseLanguage(str: string) {
        switch (str.toLowerCase()) {
            default:
            case 'en_us':
                return Language.en_US;
        }
    }
}

export enum Language {
    en_US
}