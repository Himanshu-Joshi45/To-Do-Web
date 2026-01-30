import express from 'express';
import { body, validationResult } from 'express-validator';
import Todo from '../models/Todo.js';
import Board from '../models/Board.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/board/:boardId', protect, async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    if (board.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const todos = await Todo.find({ board: req.params.boardId }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post(
  '/',
  protect,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('board').notEmpty().withMessage('Board is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, board, priority, dueDate } = req.body;

    try {
      const boardExists = await Board.findById(board);

      if (!boardExists) {
        return res.status(404).json({ message: 'Board not found' });
      }

      if (boardExists.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const todo = await Todo.create({
        title,
        description,
        board,
        user: req.user._id,
        priority,
        dueDate,
      });

      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

router.get('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    todo.title = req.body.title || todo.title;
    todo.description = req.body.description !== undefined ? req.body.description : todo.description;
    todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
    todo.priority = req.body.priority || todo.priority;
    todo.dueDate = req.body.dueDate !== undefined ? req.body.dueDate : todo.dueDate;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    if (todo.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Todo.deleteOne({ _id: req.params.id });
    res.json({ message: 'Todo removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
