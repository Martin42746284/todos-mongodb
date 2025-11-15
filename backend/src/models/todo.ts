import { Schema, model, Document,Types } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in progress' | 'done';
  userId: Types.ObjectId;
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in progress', 'done'], default: 'todo' },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default model<ITodo>('Todo', todoSchema);
