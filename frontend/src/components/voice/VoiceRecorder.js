import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, LinearProgress } from '@mui/material';
import { Mic, MicOff, Stop } from '@mui/icons-material';

const VoiceRecorder = ({ onTranscript, isRecording, onToggleRecording }) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startRecording();
      startTimer();
    } else {
      stopRecording();
      stopTimer();
    }

    return () => {
      stopRecording();
      stopTimer();
    };
  }, [isRecording]);

  const startTimer = () => {
    setRecordingTime(0);
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRecordingTime(0);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio analysis for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          setAudioLevel(average / 255 * 100);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      // Set up MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Simulate speech-to-text conversion
        setTimeout(() => {
          const simulatedTranscript = "This is a simulated voice message converted to text";
          onTranscript(simulatedTranscript);
        }, 500);
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      onToggleRecording(); // Stop recording on error
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setAudioLevel(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 120,
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(124, 58, 237, 0.95)',
        color: 'white',
        borderRadius: '20px',
        p: 3,
        minWidth: 280,
        textAlign: 'center',
        backdropFilter: 'blur(10px)',
        zIndex: 1001,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}
    >
      {/* Recording indicator */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            mr: 1,
            animation: 'pulse 1s infinite'
          }}
        />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Recording...
        </Typography>
      </Box>

      {/* Audio level visualization */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={audioLevel}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.2)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#fbbf24',
              borderRadius: 4
            }
          }}
        />
      </Box>

      {/* Recording time */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        {formatTime(recordingTime)}
      </Typography>

      {/* Stop button */}
      <IconButton
        onClick={onToggleRecording}
        sx={{
          backgroundColor: '#ef4444',
          color: 'white',
          width: 56,
          height: 56,
          '&:hover': {
            backgroundColor: '#dc2626'
          }
        }}
      >
        <Stop sx={{ fontSize: 28 }} />
      </IconButton>

      <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.8 }}>
        Tap to stop recording
      </Typography>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </Box>
  );
};

export default VoiceRecorder;
