'use client';

import React, { useState } from 'react';
import MorphChatbot from './MorphChatbot';
import MorphButton from './MorphButton';

export default function MorphProvider() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <>
      <MorphButton onClick={toggleChatbot} isOpen={isChatbotOpen} />
      <MorphChatbot isOpen={isChatbotOpen} onToggle={toggleChatbot} />
    </>
  );
}
