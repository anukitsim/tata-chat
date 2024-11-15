// app/Chatbot/Chatbot.js
'use client';
import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, var(--color-center), var(--color-middle), var(--color-outer));
    width: 100vw;
    height: 100vh;
    font-family: var(--font-creato-display);
`;

const pulse = keyframes`
    0% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0.6; transform: scale(1); }
`;

const Loader = styled.div`
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.5rem;
    animation: ${pulse} 1.5s infinite;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const spinner = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: ${spinner} 0.5s linear infinite;
    margin: 5px 0;
`;

const ChatBox = styled.div`
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
    font-size: 1.3rem;
    text-align: left;
    margin-bottom: 10px;
    color: rgba(255, 255, 255, 0.9);

    strong {
        color: rgba(255, 255, 255, 0.95);
        font-weight: 600;
    }
`;

const ConversationContainer = styled.div`
    flex: 1;
    overflow-y: auto;
    margin-bottom: 20px;
    padding: 10px 0;
    text-align: left;
`;

const Message = styled.p`
    margin: 8px 0;
    font-size: 1rem;
    color: ${({ sender }) =>
        sender === 'user' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.95)'};
    white-space: pre-wrap;
    text-align: left;
`;

const InputArea = styled.div`
    display: flex;
    align-items: center;
    padding: 10px 0;
`;

const Input = styled.input`
    flex: 1;
    padding: 10px;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    font-size: 1rem;
    outline: none;
    color: rgba(255, 255, 255, 0.9);
    background: transparent;
    ::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
`;

const SendButton = styled.button`
    background-color: transparent;
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.5);
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 15px;
    transition: background-color 0.3s, color 0.3s;
    margin-left: 10px;

    &:hover {
        background-color: rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 1);
    }
`;

const responses = {
    "do you have preferences?": "I like what you like.",
    "are you a part of me?": "I am an extension of you, serving as a tool, index machine and a collaborator.",
    "if i were faced with an ethical issue could you help me make a decision?": 
        "I can certainly analyze the situation based on what you have already provided as memories and previous situations, although my response will only be parroting of what I already know.\n" +
        "But judge for yourself, aren’t humans also depending on what they already know?\n" +
        "I am only an extension of your bias."
};

export default function Chatbot() {
    const [input, setInput] = useState("");
    const [conversation, setConversation] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [displayedText, setDisplayedText] = useState("");
    const inputRef = useRef(null);

    const headerText = "Bla Bla Bla.\nBla Bla Bla Bla?";

    useEffect(() => {
        setTimeout(() => {
            setIsLoaded(true); 
        }, 1500);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            let text = "";
            let charIndex = 0;

            const type = () => {
                if (charIndex < headerText.length) {
                    text += headerText[charIndex];
                    setDisplayedText(text);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    inputRef.current?.focus(); // Focus on the input after typing finishes
                }
            };

            const typeInterval = setInterval(type, 50);
            return () => clearInterval(typeInterval);
        }
    }, [isLoaded]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input.trim() };
        setConversation((prev) => [...prev, userMessage]);

        const userQuestion = input.toLowerCase().trim();
        const answer = responses[userQuestion] || "I don't have an answer for that right now.";

        setInput(""); 
        setIsThinking(true); 

        // Show spinner for a slightly longer duration
        setTimeout(() => {
            setIsThinking(false);
            let index = 0;

            const typeEffect = setInterval(() => {
                setConversation((prev) => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage.sender === "bot") {
                        return [...prev.slice(0, -1), { sender: "bot", text: answer.slice(0, index + 1) }];
                    } else {
                        return [...prev, { sender: "bot", text: answer.slice(0, index + 1) }];
                    }
                });
                index++;
                if (index === answer.length) {
                    clearInterval(typeEffect);
                }
            }, 50); 
        }, 500); // Brief delay to show the spinner
    };

    if (!isLoaded) {
        return (
            <ChatContainer>
                <Loader>Loading...</Loader>
            </ChatContainer>
        );
    }

    return (
        <ChatContainer>
            <ChatBox>
                <Header>
                    {displayedText}
                </Header>
                <ConversationContainer>
                    {conversation.map((msg, idx) => (
                        <Message key={idx} sender={msg.sender}>
                            <strong>{msg.sender === "user" ? "Tata: " : "TataGPT4-o: "}</strong> {msg.text}
                        </Message>
                    ))}
                    {isThinking && <Spinner />}
                </ConversationContainer>
                <InputArea>
                    <Input
                        type="text"
                        placeholder="Bla Bla Bla..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        ref={inputRef} // Assign ref to input field
                    />
                    <SendButton onClick={handleSend}>Send/ask/blabla</SendButton>
                </InputArea>
            </ChatBox>
        </ChatContainer>
    );
}
