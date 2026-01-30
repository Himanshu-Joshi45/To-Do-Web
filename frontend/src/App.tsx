import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Header from './components/Dashboard/Header';
import BoardList from './components/Dashboard/BoardList';
import TodoList from './components/Todo/TodoList';
import type { Board } from './services/api';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return showLogin ? (
      <Login onToggle={() => setShowLogin(false)} />
    ) : (
      <Register onToggle={() => setShowLogin(true)} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {selectedBoard ? (
        <TodoList board={selectedBoard} onBack={() => setSelectedBoard(null)} />
      ) : (
        <BoardList onSelectBoard={setSelectedBoard} />
      )}
    </div>
  );
}

export default App;
