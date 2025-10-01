import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, CircularProgress, Fab } from '@mui/material';
import { Settings } from '@mui/icons-material';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import VoiceRecorder from '../voice/VoiceRecorder';
import FileProcessor from '../file/FileProcessor';
import { useApp } from '../../context/AppContext';

const ChatContainer = ({ isFloating = false }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Bodhi Chatbot. How can I assist you?",
      isUser: false,
      hasVoice: true,
      timestamp: "now"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [fileProcessorOpen, setFileProcessorOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const messagesEndRef = useRef(null);
  const { setLoading } = useApp();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: messageText,
      isUser: true,
      hasVoice: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: `I understand you're asking about "${messageText}". Let me help you with that. This is a simulated response from the Bodhi AI assistant.`,
        isUser: false,
        hasVoice: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleFileUpload = (file) => {
    setCurrentFile(file);
    setFileProcessorOpen(true);
  };

  const handleFileProcessComplete = (result) => {
    const fileMessage = {
      id: Date.now(),
      text: `File "${result.fileName}" uploaded successfully!\n\n**Summary:** ${result.summary}\n\n**Key Points:**\n${result.keyPoints.map(point => `• ${point}`).join('\n')}\n\n**Document Type:** ${result.documentType}\n**Word Count:** ${result.wordCount}`,
      isUser: false,
      hasFile: true,
      fileName: result.fileName,
      hasVoice: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, fileMessage]);
    setFileProcessorOpen(false);
    setCurrentFile(null);
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
  };

  const handleVoiceTranscript = (transcript) => {
    handleSendMessage(transcript);
  };

  const handlePlayVoice = (messageId) => {
    console.log('Playing voice for message:', messageId);
    // Implement text-to-speech functionality
  };

  return (
    <Box
      sx={{
        height: isFloating ? '100%' : '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc'
      }}
    >
      {/* Chat Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          pb: '120px', // Space for input area
          pt: 2
        }}
      >
        {/* Welcome Message */}
        {messages.length === 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh',
              px: 4,
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1e293b',
                mb: 2
              }}
            >
              Welcome to Bodhi Chatbot
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Your AI-powered assistant for conversations, file analysis, and more
            </Typography>
          </Box>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            hasVoice={message.hasVoice}
            hasFile={message.hasFile}
            fileName={message.fileName}
            timestamp={message.timestamp}
            onPlayVoice={() => handlePlayVoice(message.id)}
          />
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              px: 2,
              mb: 2
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                backgroundColor: '#f1f5f9',
                borderRadius: '20px 20px 20px 5px',
                p: 2,
                maxWidth: '70%'
              }}
            >
              <CircularProgress size={16} sx={{ color: '#7c3aed' }} />
              <Typography variant="body2" color="text.secondary">
                Bodhi is thinking...
              </Typography>
            </Box>
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {/* Settings FAB - Only show in non-floating mode */}
      {!isFloating && (
        <Fab
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 20,
            backgroundColor: '#3b82f6',
            color: 'white',
            width: 48,
            height: 48,
            '&:hover': {
              backgroundColor: '#2563eb'
            }
          }}
        >
          <Settings />
        </Fab>
      )}

      {/* Voice Recorder Overlay */}
      <VoiceRecorder
        isRecording={isRecording}
        onTranscript={handleVoiceTranscript}
        onToggleRecording={handleVoiceToggle}
      />

      {/* File Processor Dialog */}
      {currentFile && (
        <FileProcessor
          open={fileProcessorOpen}
          onClose={() => {
            setFileProcessorOpen(false);
            setCurrentFile(null);
          }}
          file={currentFile}
          onProcessComplete={handleFileProcessComplete}
        />
      )}

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        onVoiceToggle={handleVoiceToggle}
        isRecording={isRecording}
        disabled={isLoading}
        isFloating={isFloating}
      />
    </Box>
  );
};

export default ChatContainer;
