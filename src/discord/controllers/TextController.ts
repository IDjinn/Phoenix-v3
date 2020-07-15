import { Collection } from "discord.js";
import { readdirSync } from 'fs';
import { join as pathJoin } from 'path';
import { create as stringFormatCreate } from 'string-format';
import Constants from "../util/Constants";
import logger from "../util/logger/Logger";

export default class TextController {
    private texts = new Collection<Language, any>();
    private format = stringFormatCreate({
        invites: str => typeof str === 'string' ? str.replace(Constants.DISCORD_INVITES_REGEX, '*') : str,
        links: str => typeof str === 'string' ?  str.replace(Constants.DISCORD_INVITES_REGEX, '*').replace(Constants.LINKS_REGEX, '*') : str
    });
    public init() {
        const languagesPath = pathJoin(__dirname, '../lang');
        for (const file of readdirSync(languagesPath)) {
            const language = require(`${languagesPath}/${file}`);
            this.texts.set(this.parseStringToLanguage(file.replace('.json', ''), Language.en_US), language);
        }
    }

    public destroy() {
        this.texts.clear();
    }

    public t(lang: Language, key: string, ...args: any): string {
        try {
            const keys = key.split('.');
            let value = this.texts.get(lang) || this.texts.get(Language.en_US);
            for (const subKey of keys) {
                value = value[subKey];
            }
            return this.format(value, ...args);
        }
        catch (error) {
            logger.error(`Error while trying find the key ${key} from language ${this.parseLanguageToString(lang)}: `, error);
            return 'undefined';
        }
    }

    public allT(key: string, ...args: any): string[] {
        return [this.t(Language.en_US, key, ...args), this.t(Language.pt_BR, key, ...args)];
    }

    public parseStringToLanguage(str: string, defaultValue = 0) {
        switch (str.toLowerCase()) {
            case 'en_us':
            case 'en':
                return Language.en_US;
            case 'pt_br':
            case 'pt':
            case 'br':
                return Language.pt_BR;
        }
        return defaultValue;
    }
    public parseLanguageToString(language: Language, defaultValue = 'en_US'): string {
        switch (language) {
            case Language.en_US:
                return 'en_US';
            case Language.pt_BR:
                return 'pt_BR';
        }
        return defaultValue;
    }
}

export enum Language {
    en_US,
    pt_BR
}