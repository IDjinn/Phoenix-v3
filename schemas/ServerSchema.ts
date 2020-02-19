import {Schema, model} from 'mongoose';
import { ILogger } from '../modules/LoggerModule';

const ServerSchema = new Schema({
        id: {
            type: String,
            required: true
        },
        prefix: {
            type: String,
            default: '>'
        },
        levels: {
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
        roles: {
            moderator: {
                type: Array,
                default: []
            },
            administrator:{
                type: Array,
                default: []
            },
            invites:{
                type: Array,
                default: []
            },
            links:{
                type: Array,
                default: []
            }
        },
        invites:{
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
        automot:{
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
        },
        logger: {
            messageDeleted: {
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
            messageUpdated: {
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
            guildUpdated: {
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
            roleUpdated: {
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
            roleCreated: {
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
            roleDeleted: {
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
            memberUpdated: {
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
            channelCreated: {
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
            channelUpdated: {
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
            channelDeleted: {
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
        }
    }
, {timestamps: true});

export default model('Servers', ServerSchema);

export interface IServer{
    id: string;
    prefix: string
    levels: {
        enabled: boolean
        channel: string
        embed: JSON
    },
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
    counter: {
        users: {
            enabled: boolean
            channel: string
            name: string
        },
        bots: {
            enabled: boolean
            channel: string
            name: string
        },
        channels: {
            enabled: boolean
            channel: string
            name: string
        }
    },
    welcome: {
        join: {
            enabled: boolean
            channel: string
            embed: JSON
        },
        leave: {
            enabled: boolean
            channel: string
            embed: JSON
        },
    },
    autorole: {
        enabled: boolean
        roles: string[]
    },
    roles: {
        moderador: string[]
        administrador:string[]
        convites:string[]
        links: string[]
    },
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
    automod:{
        invites: {
            enabled: boolean
            whitelist: string[],
            blacklist: string[]
        },
        links: {
            enabled: boolean
            whitelist: string[],
            blacklist: string[]
        },
    },
    logger: ILogger,
    createdAt: Date,
    updatedAt: Date,
    '__v': number,
    '_id': string
}