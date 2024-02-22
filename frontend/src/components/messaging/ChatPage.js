// components/ChatPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConversationList from './ConversationsList';
import MessagePanel from './MessagePanel';
import CustomerProfile from './CustomerProfile';

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [customerProfile, setCustomerProfile] = useState(null);

    useEffect(() => {
        const fetchConversations = async () => {
            const result = await axios('/api/conversations');
            setConversations(result.data);
        };

        fetchConversations();
    }, []);

    const selectConversation = (conversationId) => {
    };

    const sendMessage = async (text) => {
    };

    return (
        <div className="flex">
            <ConversationList conversations={conversations} onSelectConversation={selectConversation} />
            {selectedConversation && <MessagePanel messages={messages} onSendMessage={sendMessage} />}
            {customerProfile && <CustomerProfile profile={customerProfile} />}
        </div>
    );
};

export default ChatPage;

