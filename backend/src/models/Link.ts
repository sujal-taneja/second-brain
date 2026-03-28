import mongoose, { Schema, Types } from 'mongoose';

const LinkSchema = new Schema({
  hash: { type: String, required: true },
  userId: { type: Types.ObjectId, ref: 'users', required: true },
});

LinkSchema.index({ hash: 1 }, { unique: true });

LinkSchema.index({ userId: 1 });

const LinkModel = mongoose.model('links', LinkSchema);

export default LinkModel;
