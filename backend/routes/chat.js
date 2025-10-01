const express = require('express');
const { 
  createChat, 
  getChat, 
  addMessage, 
  getUserChats, 
  updateChatTitle, 
  deleteChat 
} = require('../controllers/chatController');
const router = express.Router();

// @route   POST /api/chat/create
// @desc    Create a new chat
// @access  Public
router.post('/create', createChat);

// @route   GET /api/chat/:chatId
// @desc    Get chat with messages
// @access  Public
router.get('/:chatId', getChat);

// @route   POST /api/chat/:chatId/message
// @desc    Add message to chat
// @access  Public
router.post('/:chatId/message', addMessage);

// @route   GET /api/chat/user/:userId
// @desc    Get all chats for a user
// @access  Public
router.get('/user/:userId', getUserChats);

// @route   PUT /api/chat/:chatId/title
// @desc    Update chat title
// @access  Public
router.put('/:chatId/title', updateChatTitle);

// @route   DELETE /api/chat/:chatId
// @desc    Delete a chat
// @access  Public
router.delete('/:chatId', deleteChat);

module.exports = router;
