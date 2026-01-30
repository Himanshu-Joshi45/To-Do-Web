import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import  { todoAPI,type Board, type Todo } from '../../services/api';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';

interface TodoListProps {
  board: Board;
  onBack: () => void;
}

export default function TodoList({ board, onBack }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [board]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoAPI.getByBoard(board._id);
      setTodos(data);
      setError('');
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (
    title: string,
    description: string,
    priority: string,
    dueDate?: string
  ) => {
    try {
      const validPriority = priority as 'low' | 'medium' | 'high';
      if (editingTodo) {
        await todoAPI.update(editingTodo._id, { title, description, priority: validPriority, dueDate });
      } else {
        await todoAPI.create(board._id, title, description, validPriority, dueDate);
      }
      await fetchTodos();
      setShowForm(false);
      setEditingTodo(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      await todoAPI.update(id, { completed });
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this todo?')) {
      return;
    }

    try {
      await todoAPI.delete(id);
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Boards</span>
        </button>

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: board.color }}
              />
              <h2 className="text-3xl font-bold text-gray-800">{board.title}</h2>
            </div>
            {board.description && (
              <p className="text-gray-600">{board.description}</p>
            )}
          </div>

          <button
            onClick={() => {
              setEditingTodo(null);
              setShowForm(true);
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold">New Todo</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {activeTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Plus className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No todos yet</h3>
              <p className="text-gray-600 mb-6">Add your first task to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Todo
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {activeTodos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Active Tasks ({activeTodos.length})
                  </h3>
                  <div className="space-y-3">
                    {activeTodos.map((todo) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </div>
              )}

              {completedTodos.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Completed ({completedTodos.length})
                  </h3>
                  <div className="space-y-3">
                    {completedTodos.map((todo) => (
                      <TodoItem
                        key={todo._id}
                        todo={todo}
                        onToggle={handleToggle}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {showForm && (
        <TodoForm
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowForm(false);
            setEditingTodo(null);
          }}
          todo={editingTodo}
        />
      )}
    </div>
  );
}
