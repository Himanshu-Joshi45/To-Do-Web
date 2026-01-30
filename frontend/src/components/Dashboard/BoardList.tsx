import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import  { boardAPI, type Board } from '../../services/api';
import BoardCard from './BoardCard';
import BoardForm from './BoardForm';

interface BoardListProps {
  onSelectBoard: (board: Board) => void;
}

export default function BoardList({ onSelectBoard }: BoardListProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      setLoading(true);
      const data = await boardAPI.getAll();
      setBoards(data);
      setError('');
    } catch (err) {
      setError('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (title: string, description: string, color: string) => {
    try {
      if (editingBoard) {
        await boardAPI.update(editingBoard._id, { title, description, color });
      } else {
        await boardAPI.create(title, description, color);
      }
      await fetchBoards();
      setShowForm(false);
      setEditingBoard(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this board? All todos will be deleted.')) {
      return;
    }

    try {
      await boardAPI.delete(id);
      await fetchBoards();
    } catch (err) {
      setError('Failed to delete board');
    }
  };

  const handleEdit = (board: Board) => {
    setEditingBoard(board);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Boards</h2>
          <p className="text-gray-600 mt-1">Organize your tasks with boards</p>
        </div>
        <button
          onClick={() => {
            setEditingBoard(null);
            setShowForm(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Board</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {boards.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No boards yet</h3>
          <p className="text-gray-600 mb-6">Create your first board to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Create Board
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <BoardCard
              key={board._id}
              board={board}
              onSelect={onSelectBoard}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {showForm && (
        <BoardForm
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setShowForm(false);
            setEditingBoard(null);
          }}
          board={editingBoard}
        />
      )}
    </div>
  );
}
