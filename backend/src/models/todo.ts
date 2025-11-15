import { Schema, model, Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in progress' | 'done';
}

const todoSchema = new Schema<ITodo>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in progress', 'done'], default: 'todo' },
}, { timestamps: true });

export default model<ITodo>('Todo', todoSchema);
