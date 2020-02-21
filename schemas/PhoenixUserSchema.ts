import { Schema, model } from 'mongoose';

const PhoenixUserSchema = new Schema({
    id: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    coins: { type: Number, default: 0 },
    rep: { type: Number, default: 0 },
    bio: { type: String, default: '' }
}, { timestamps: true });

export default model('Users', PhoenixUserSchema);

export interface IPhoenixUser{
    id: string;
    level: number;
    xp: number;
    coins: number;
    rep: number;
    bio: string;
}