import { Trash2, Edit2 } from 'lucide-react';
import type { Board } from '../../services/api';

interface BoardCardProps {
  board: Board;
  onSelect: (board: Board) => void;
  onDelete: (id: string) => void;
  onEdit: (board: Board) => void;
}

export default function BoardCard({ board, onSelect, onDelete, onEdit }: BoardCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer border-t-4 p-6 relative group"
      style={{ borderTopColor: board.color }}
    >
      <div onClick={() => onSelect(board)}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{board.title}</h3>
        {board.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{board.description}</p>
        )}
        <p className="text-xs text-gray-400">
          Created {new Date(board.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(board);
          }}
          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(board._id);
          }}
          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
