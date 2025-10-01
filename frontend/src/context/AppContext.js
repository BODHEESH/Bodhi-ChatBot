import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  theme: 'light',
  currentChat: null,
  chats: [],
  files: [],
  loading: false,
  error: null
};

// Action types
export const ACTION_TYPES = {
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_THEME: 'SET_THEME',
  SET_CURRENT_CHAT: 'SET_CURRENT_CHAT',
  SET_CHATS: 'SET_CHATS',
  ADD_CHAT: 'ADD_CHAT',
  UPDATE_CHAT: 'UPDATE_CHAT',
  DELETE_CHAT: 'DELETE_CHAT',
  SET_FILES: 'SET_FILES',
  ADD_FILE: 'ADD_FILE',
  DELETE_FILE: 'DELETE_FILE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_USER:
      return { ...state, user: action.payload };
    
    case ACTION_TYPES.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    
    case ACTION_TYPES.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ACTION_TYPES.SET_CURRENT_CHAT:
      return { ...state, currentChat: action.payload };
    
    case ACTION_TYPES.SET_CHATS:
      return { ...state, chats: action.payload };
    
    case ACTION_TYPES.ADD_CHAT:
      return { ...state, chats: [action.payload, ...state.chats] };
    
    case ACTION_TYPES.UPDATE_CHAT:
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.id ? action.payload : chat
        )
      };
    
    case ACTION_TYPES.DELETE_CHAT:
      return {
        ...state,
        chats: state.chats.filter(chat => chat.id !== action.payload)
      };
    
    case ACTION_TYPES.SET_FILES:
      return { ...state, files: action.payload };
    
    case ACTION_TYPES.ADD_FILE:
      return { ...state, files: [action.payload, ...state.files] };
    
    case ACTION_TYPES.DELETE_FILE:
      return {
        ...state,
        files: state.files.filter(file => file.id !== action.payload)
      };
    
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: null };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    setUser: (user) => dispatch({ type: ACTION_TYPES.SET_USER, payload: user }),
    setAuthenticated: (isAuth) => dispatch({ type: ACTION_TYPES.SET_AUTHENTICATED, payload: isAuth }),
    setTheme: (theme) => dispatch({ type: ACTION_TYPES.SET_THEME, payload: theme }),
    setCurrentChat: (chat) => dispatch({ type: ACTION_TYPES.SET_CURRENT_CHAT, payload: chat }),
    setChats: (chats) => dispatch({ type: ACTION_TYPES.SET_CHATS, payload: chats }),
    addChat: (chat) => dispatch({ type: ACTION_TYPES.ADD_CHAT, payload: chat }),
    updateChat: (chat) => dispatch({ type: ACTION_TYPES.UPDATE_CHAT, payload: chat }),
    deleteChat: (chatId) => dispatch({ type: ACTION_TYPES.DELETE_CHAT, payload: chatId }),
    setFiles: (files) => dispatch({ type: ACTION_TYPES.SET_FILES, payload: files }),
    addFile: (file) => dispatch({ type: ACTION_TYPES.ADD_FILE, payload: file }),
    deleteFile: (fileId) => dispatch({ type: ACTION_TYPES.DELETE_FILE, payload: fileId }),
    setLoading: (loading) => dispatch({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTION_TYPES.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ACTION_TYPES.CLEAR_ERROR })
  };

  const value = {
    ...state,
    ...actions
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
