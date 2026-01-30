const API_URL = import.meta.env.VITE_API_URL;
interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

interface Board {
  _id: string;
  title: string;
  description: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  board: string;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
  register: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },
};

export const boardAPI = {
  getAll: async (): Promise<Board[]> => {
    const response = await fetch(`${API_URL}/boards`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }

    return response.json();
  },

  create: async (title: string, description: string, color: string): Promise<Board> => {
    const response = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ title, description, color }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create board');
    }

    return response.json();
  },

  update: async (id: string, data: Partial<Board>): Promise<Board> => {
    const response = await fetch(`${API_URL}/boards/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update board');
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/boards/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete board');
    }
  },
};

export const todoAPI = {
  getByBoard: async (boardId: string): Promise<Todo[]> => {
    const response = await fetch(`${API_URL}/todos/board/${boardId}`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }

    return response.json();
  },

  create: async (
    boardId: string,
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    dueDate?: string
  ): Promise<Todo> => {
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        board: boardId,
        title,
        description,
        priority,
        dueDate,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create todo');
    }

    return response.json();
  },

  update: async (id: string, data: Partial<Todo>): Promise<Todo> => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update todo');
    }

    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  },
};

export type { AuthResponse, Board, Todo };
