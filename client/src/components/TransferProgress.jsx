import React, { useState, useEffect } from 'react';
import { socket } from '../api/spotify.js';
import { Progress } from '@/components/ui/progress';

const TransferProgress = () => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Starting transfer...');

  useEffect(() => {
    const handleProgress = (data) => {
      console.log('Received progress update:', data);
      setProgress(data.progress);
      setMessage(data.message);
    };

    console.log(
      'Setting up progress listener, socket connected:',
      socket.connected
    );
    socket.on('transfer_progress', handleProgress);

    return () => {
      socket.off('transfer_progress', handleProgress);
    };
  }, []);

  return (
    <div className="w-full max-w-md p-4 bg-neutral-800 rounded-lg">
      <p className="text-white mb-2">{message}</p>
      <Progress value={progress} className="w-full" />
    </div>
  );
};

export default TransferProgress;
