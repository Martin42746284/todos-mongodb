import { LogOut } from 'lucide-react';
import axiosInstance from './axios';

export interface Todo {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in progress' | 'done';
  userId?: String,
createdAt?: string;
  updatedAt?: string;
}

// Authentification
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }
};

// Todos
export const todoAPI = {
  getAll: async (): Promise<Todo[]> => {
    const response = await axiosInstance.get('/todos');
    return response.data;
  },

  create: async (title: string, description: string, status: string): Promise<Todo> => {
    const response = await axiosInstance.post('/todos', { title, description, status });
    return response.data;
  },

  update: async (id: string, title: string, description: string, status: string): Promise<Todo> => {
    const response = await axiosInstance.put(`/todos/${id}`, { title, description, status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/todos/${id}`);
    return response.data;
  }
};
