import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
  title: { type: String, required: true },
});

TagSchema.index({ title: 1 }, { unique: true });

const TagModel = mongoose.model('tags', TagSchema);

export default TagModel;
