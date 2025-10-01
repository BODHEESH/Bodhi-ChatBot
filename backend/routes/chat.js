const express = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const router = express.Router();

// @route   POST /api/chat/create
// @desc    Create a new chat
// @access  Public (for now)
router.post('/create', async (req, res) => {
  try {
    const { userId, title } = req.body;

    const chat = new Chat({
      user: userId || null,
      title: title || 'New Chat'
    });

    await chat.save();

    res.status(201).json({
      message: 'Chat created successfully',
      chat
    });
  } catch (error) {
    console.error('Chat creation error:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
});

// @route   GET /api/chat/:chatId
// @desc    Get chat with messages
// @access  Public
router.get('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('messages')
      .populate('user', 'username email');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ chat });
  } catch (error) {
    console.error('Chat retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving chat' });
  }
});

// @route   POST /api/chat/:chatId/message
// @desc    Add message to chat
// @access  Public
router.post('/:chatId/message', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, content, messageType, metadata } = req.body;

    // Create message
    const message = new Message({
      chat: chatId,
      sender,
      content,
      messageType: messageType || 'text',
      metadata: metadata || {}
    });

    await message.save();

    // Add message to chat
    await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: message._id } }
    );

    res.status(201).json({
      message: 'Message added successfully',
      messageData: message
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ message: 'Error adding message' });
  }
});

// @route   GET /api/chat/user/:userId
// @desc    Get all chats for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find({ user: userId })
      .populate('messages', 'sender content messageType createdAt')
      .sort({ updatedAt: -1 });

    res.json({ chats });
  } catch (error) {
    console.error('User chats retrieval error:', error);
    res.status(500).json({ message: 'Error retrieving user chats' });
  }
});

// @route   DELETE /api/chat/:chatId
// @desc    Delete a chat
// @access  Public
router.delete('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Chat deletion error:', error);
    res.status(500).json({ message: 'Error deleting chat' });
  }
});

module.exports = router;
