import {Schema, model} from 'mongoose';
import { ILogger } from '../modules/LoggerModule';
import { IAutomod } from '../modules/AutomodModule';
import { IRole } from '../modules/PermissionsModule';
import { ICounter } from '../modules/CounterModule';
import { ILevelModule } from '../modules/LevelModule';
import { IWelcome } from '../modules/WelcomeModule';

const ServerSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        default: '>'
    },
    level: {
        enabled: {
            type: Boolean,
            default: false
        },
        serverXpMultiplier: {
            type: Number,
            default: 0
        },
        channel: {
            type: String,
            default: ''
        },
        embed: {
            type: JSON,
            default: ''
        },
        levels: {
            type: Array,
            default: []
        }
    },
    punishment: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: ''
        },
        embed: {
            type: JSON,
            default: ''
        }
    },
    announce: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: ''
        },
        embed: {
            type: JSON,
            default: ''
        }
    },
    commands: {
        enabled: {
            type: Boolean,
            default: false
        },
        whitelist: {
            type: Array,
            default: []
        },
        blacklist: {
            type: Array,
            default: []
        },
        embed: {
            type: JSON,
            default: ''
        }
    },
    counter: {
        users: {
            enabled: {
                type: Boolean,
                default: false
            },
            channel: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            }
        },
        bots: {
            enabled: {
                type: Boolean,
                default: false
            },
            channel: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            }
        },
        channels: {
            enabled: {
                type: Boolean,
                default: false
            },
            channel: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            }
        }
    },
    welcome: {
        join: {
            enabled: {
                type: Boolean,
                default: false
            },
            channel: {
                type: String,
                default: ''
            },
            embed: {
                type: JSON,
                default: ''
            }
        },
        leave: {
            enabled: {
                type: Boolean,
                default: false
            },
            channel: {
                type: String,
                default: ''
            },
            embed: {
                type: JSON,
                default: ''
            }
        },
        autorole: {
            enabled: {
                type: Boolean,
                default: false
            },
            roles: {
                type: Array,
                default: []
            },
        },
    },
    roles: {
        type: Array,
        default: []
    },
    invites: {
        enabled: {
            type: Boolean,
            default: false
        },
        channel: {
            type: String,
            default: ''
        },
        embed: {
            type: JSON,
            default: ''
        },
    },
    economy: {
        currency: {
            singular: {
                type: String,
                default: 'dolar'
            },
            plural: {
                type: String,
                default: 'dolars'
            },
            valor: {
                type: Number,
                default: 10
            },
        }
    },
    automod: {
        invites: {
            enabled: {
                type: Boolean,
                default: false
            },
            whitelist: {
                type: Array,
                default: []
            },
            blacklist: {
                type: Array,
                default: []
            }
        },
        links: {
            enabled: {
                type: Boolean,
                default: false
            },
            whitelist: {
                type: Array,
                default: []
            },
            blacklist: {
                type: Array,
                default: []
            }
        },
        dupChars: {
            enabled: {
                type: Boolean,
                default: true
            },
            percent: {
                type: Number,
                default: 0.1
            }
        },
        capsLock: {
            enabled: {
                type: Boolean,
                default: true
            },
            percent: {
                type: Number,
                default: 0.1
            }
        },
        massMention: {
            enabled: {
                type: Boolean,
                default: true
            },
            count: {
                type: Number,
                default: 5
            }
        },
        actions: {
            type: Array,
            default: []
        },
        warnsChannel: {
            type: String,
            default: ''
        },
        whitelist: {
            type: Array,
            default: []
        }
    },
    logger: {
        logChannelId: {
            type: String,
            default: ''
        },
        messageDeletedEnabled: {
            type: Boolean,
            default: false
        },
        messageUpdatedEnabled: {
            type: Boolean,
            default: false
        },
        guildUpdatedEnabled: {
            type: Boolean,
            default: false
        },
        roleUpdatedEnabled: {
            type: Boolean,
            default: false
        },
        roleCreatedEnabled: {
            type: Boolean,
            default: false
        },
        roleDeletedEnabled: {
            type: Boolean,
            default: false
        },
        memberUpdatedEnabled: {
            type: Boolean,
            default: false
        },
        channelCreatedEnabled: {
            type: Boolean,
            default: false
        },
        channelUpdatedEnabled: {
            type: Boolean,
            default: false
        },
        channelDeletedEnabled: {
            type: Boolean,
            default: false
        },
    }
}, { timestamps: true });


export default model('Servers', ServerSchema);

export interface IServer{
    id: string;
    prefix: string,
    punishment: {
        enabled: boolean
        channel: string
        embed: JSON
    },
    announce: {
        enabled: boolean
        channel: string
        embed: JSON
    },
    commands: {
        enabled: boolean
        whitelist: string[]
        blacklist: string[]
        embed: JSON
    },
    level: ILevelModule,
    counter: ICounter,
    roles: IRole[],
    welcome: IWelcome,
    invites:{
        enabled: boolean
        channel: string
        embed: JSON,
    },
    economy: {
        currency: {
            singular: string
            plural: string
            valor: number
        }
    },
    automod: IAutomod,
    logger: ILogger,
    createdAt: Date,
    updatedAt: Date,
    '__v': number,
    '_id': string
}