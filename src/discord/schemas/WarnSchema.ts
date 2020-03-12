import { model, Schema } from 'mongoose';

const WarnSchema = new Schema({
    userId: { required: true, type: String },
    guildId: { required: true, type: String },
    punisherId: { required: true, type: String },
    reason: String,
}, { timestamps: true });

export default model('Warns', WarnSchema);