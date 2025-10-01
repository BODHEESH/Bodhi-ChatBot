const Chat = require('../models/Chat');
const Message = require('../models/Message');

/**
 * Create a new chat
 */
const createChat = async (req, res) => {
  try {
    const { userId, title } = req.body;

    const chat = new Chat({
      user: userId || null,
      title: title || 'New Chat'
    });

    await chat.save();

    res.status(201).json({
      message: 'Chat created successfully',
      chat: {
        id: chat._id,
        title: chat.title,
        user: chat.user,
        isActive: chat.isActive,
        createdAt: chat.createdAt,
        messages: []
      }
    });
  } catch (error) {
    console.error('Chat creation error:', error);
    res.status(500).json({ 
      message: 'Error creating chat',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get chat with messages
 */
const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    const chat = await Chat.findById(chatId)
      .populate('messages')
      .populate('user', 'username email');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({ 
      chat: {
        id: chat._id,
        title: chat.title,
        user: chat.user,
        isActive: chat.isActive,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error('Chat retrieval error:', error);
    res.status(500).json({ 
      message: 'Error retrieving chat',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Add message to chat
 */
const addMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { sender, content, messageType, metadata } = req.body;

    if (!chatId || !sender || !content) {
      return res.status(400).json({ 
        message: 'Chat ID, sender, and content are required' 
      });
    }

    // Validate sender
    if (!['user', 'bot'].includes(sender)) {
      return res.status(400).json({ 
        message: 'Sender must be either "user" or "bot"' 
      });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Create message
    const message = new Message({
      chat: chatId,
      sender,
      content,
      messageType: messageType || 'text',
      metadata: metadata || {}
    });

    await message.save();

    // Add message to chat and update timestamp
    await Chat.findByIdAndUpdate(
      chatId,
      { 
        $push: { messages: message._id },
        $set: { updatedAt: new Date() }
      }
    );

    res.status(201).json({
      message: 'Message added successfully',
      messageData: {
        id: message._id,
        sender: message.sender,
        content: message.content,
        messageType: message.messageType,
        metadata: message.metadata,
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ 
      message: 'Error adding message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Get all chats for a user
 */
const getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const chats = await Chat.find({ user: userId })
      .populate('messages', 'sender content messageType createdAt')
      .sort({ updatedAt: -1 });

    const formattedChats = chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      isActive: chat.isActive,
      messageCount: chat.messages.length,
      lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }));

    res.json({ 
      chats: formattedChats,
      totalChats: formattedChats.length
    });
  } catch (error) {
    console.error('User chats retrieval error:', error);
    res.status(500).json({ 
      message: 'Error retrieving user chats',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Update chat title
 */
const updateChatTitle = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;

    if (!chatId || !title) {
      return res.status(400).json({ 
        message: 'Chat ID and title are required' 
      });
    }

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { title, updatedAt: new Date() },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    res.json({
      message: 'Chat title updated successfully',
      chat: {
        id: chat._id,
        title: chat.title,
        updatedAt: chat.updatedAt
      }
    });
  } catch (error) {
    console.error('Chat title update error:', error);
    res.status(500).json({ 
      message: 'Error updating chat title',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * Delete a chat
 */
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    // Check if chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    res.json({ 
      message: 'Chat deleted successfully',
      deletedChatId: chatId
    });
  } catch (error) {
    console.error('Chat deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting chat',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createChat,
  getChat,
  addMessage,
  getUserChats,
  updateChatTitle,
  deleteChat
};
