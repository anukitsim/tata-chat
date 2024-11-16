'use client';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Global Styles
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: radial-gradient(circle, var(--color-center), var(--color-middle), var(--color-outer));
    cursor: url('/large-arrow-cursor.png') 16 0, auto;
    font-family: var(--font-creato-display), sans-serif;
    overflow: hidden;
    background-color: #282c34;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  pointer-events: none;
  backdrop-filter: blur(10px);
  z-index: 1;
`;

const spinner = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const LoadingScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  backdrop-filter: blur(10px);
`;

const SpinnerStyled = styled.div`
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: ${spinner} 0.75s linear infinite;
`;

const PreChatButton = styled.button`
  position: relative;
  z-index: 3;
  background: linear-gradient(135deg, #ff0000, #7b2ff7);
  color: rgba(255, 255, 255, 0.9);
  border: none;
  padding: 30px 60px;
  font-size: 2rem;
  letter-spacing: 3px;
  cursor: url('/large-arrow-cursor.png') 16 0, auto;
  border-radius: 25px;
  box-shadow: 0px 4px 15px rgba(123, 47, 247, 0.6);
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ChatBox = styled.div`
  position: relative;
  z-index: 3;
  width: 95%;
  max-width: 850px;
  height: 85vh;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
`;

const Header = styled.div`
  font-size: 1.8rem;
  text-align: left;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.9);
`;

const ConversationContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 20px;
  scroll-behavior: smooth;
`;

const MessageRow = styled.div`
  display: flex;
  justify-content: ${({ sender }) => (sender === 'user' ? 'flex-end' : 'flex-start')};
`;

const MessageContent = styled.div`
  max-width: 70%;
  width: ${({ children }) => (children && children.length > 100 ? '100%' : '70%')};
  font-size: 1.2rem;
  line-height: 1.8;
  color: ${({ sender }) =>
    sender === 'user' ? 'rgba(255, 230, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  padding: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  text-align: ${({ sender }) => (sender === 'user' ? 'right' : 'left')};
`;

const InputArea = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
  outline: none;
  color: rgba(255, 255, 255, 0.9);
  background: transparent;

  ::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const SendButton = styled.button`
  position: relative;
  z-index: 3;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.5);
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: url('/large-arrow-cursor.png') 16 0, auto;
  border-radius: 15px;
  margin-left: 10px;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export default function Chatbot() {
  // Your functional logic remains unchanged
  const [currentView, setCurrentView] = useState('loading');
  const [input, setInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [headerText, setHeaderText] = useState('');
  const headerTargetText = 'TatcGPT';
  const chatContainerRef = useRef(null);

  const responses = {
    "do you have preferences?": "I like what you like.",
    "are you a part of me?": "I am an extension of you, serving as a tool, index machine and a collaborator.",
    "if i were faced with an ethical issue could you help me make a decision?":
      "I can certainly analyze the situation based on what you have already provided as memories and previous situations, although my response will only be parroting of what I already know. But judge for yourself, aren’t humans also depending on what they already know? I am only an extension of your bias.",
  };

  useEffect(() => {
    if (currentView === 'chat') {
      let index = 0;
      const typeInterval = setInterval(() => {
        setHeaderText(headerTargetText.slice(0, index + 1));
        index++;
        if (index === headerTargetText.length) clearInterval(typeInterval);
      }, 150);
    }
  }, [currentView]);

  useEffect(() => {
    if (currentView === 'loading') {
      const timeout = setTimeout(() => {
        setCurrentView('preChat');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [currentView]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const typeBotResponse = (text, delay = 50) => {
    let i = 0;
    const interval = setInterval(() => {
      setConversation((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = text.slice(0, i);
        return updated;
      });
      i++;
      if (i > text.length) clearInterval(interval);
    }, delay);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim().toLowerCase();
    setConversation((prev) => [...prev, { sender: 'user', text: input.trim() }]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const botResponse = responses[userMessage] || "I can only answer specific questions.";
      setConversation((prev) => [...prev, { sender: 'bot', text: '' }]);
      setIsThinking(false);
      typeBotResponse(botResponse);
    }, 1500);
  };

  return (
    <>
      <GlobalStyle />
      <ChatContainer>
        <Overlay />
        {currentView === 'loading' && (
          <LoadingScreen>
            <SpinnerStyled />
          </LoadingScreen>
        )}
        {currentView === 'preChat' && (
          <PreChatButton onClick={handleStartChat}>Click to converse</PreChatButton>
        )}
        {currentView === 'chat' && (
          <ChatBox>
            <Header>{headerText}</Header>
            <ConversationContainer ref={chatContainerRef}>
              {conversation.map((msg, idx) => (
                <MessageRow key={idx} sender={msg.sender}>
                  <MessageContent sender={msg.sender}>{msg.text}</MessageContent>
                </MessageRow>
              ))}
              {isThinking && (
                <MessageRow>
                  <SpinnerStyled />
                </MessageRow>
              )}
            </ConversationContainer>
            <InputArea>
              <Input
                type="text"
                placeholder="Talk to me"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <SendButton onClick={handleSend}>Send</SendButton>
            </InputArea>
          </ChatBox>
        )}
      </ChatContainer>
    </>
  );
}
