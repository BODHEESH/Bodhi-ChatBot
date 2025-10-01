import React, { useState } from 'react';
import { CustomThemeProvider } from '../../context/ThemeContext';
import { AppProvider } from '../../context/AppContext';
import FloatingChatBubble from './FloatingChatBubble';
import FloatingChatWindow from './FloatingChatWindow';

const FloatingChatApp = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setUnreadCount(0); // Clear unread count when opening
    }
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleNewMessage = () => {
    if (!isChatOpen) {
      setUnreadCount(prev => prev + 1);
    }
  };

  return (
    <CustomThemeProvider>
      <AppProvider>
        {/* Floating Chat Bubble */}
        <FloatingChatBubble
          onClick={handleToggleChat}
          isOpen={isChatOpen}
          unreadCount={unreadCount}
        />

        {/* Floating Chat Window */}
        <FloatingChatWindow
          open={isChatOpen}
          onClose={handleCloseChat}
          onNewMessage={handleNewMessage}
        />
      </AppProvider>
    </CustomThemeProvider>
  );
};

export default FloatingChatApp;
