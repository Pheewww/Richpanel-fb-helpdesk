// components/ChatPage.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ConversationList from './ConversationsList';
import MessagePanel from './MessagePanel';
import CustomerProfile from './CustomerProfile';

const ChatPage = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [customerProfile, setCustomerProfile] = useState(null);

    const pollingInterval = 3000;

    useEffect(() => {
        const fetchConversations = async () => {
            try {

                console.log('Going to fetch convo');
                const result = await axios.get('http://localhost:5000/conversations');
                console.log('I AM IN FETCH CONVERSATION ');

                setConversations(result.data);
                console.log('convo brought');

            } catch (error) {
                console.error('Failed to fetch conversations:', error);
            }
        };

        fetchConversations();
        const intervalId = setInterval(fetchConversations, pollingInterval);

        return () => clearInterval(intervalId);
    }, []);

    const fetchMessages = useCallback(async () => {
        if (selectedConversation) {
            try {
                console.log('Going to fetch msg in convo');

                const result = await axios.get(`http://localhost:5000/conversations/${selectedConversation._id}/messages`);
                console.log('found msg in convo');

                setMessages(result.data.messages);
            } catch (error) {
                console.error('Failed to fetch messages for conversation:', error);
            }
        }
    }, [selectedConversation]);

    useEffect(() => {
        if (selectedConversation) {
            const intervalId = setInterval(fetchMessages, pollingInterval);

            return () => clearInterval(intervalId);
        }
    }, [selectedConversation, fetchMessages]);

    const selectConversation = async (conversationId) => {
        try {
            const result = await axios(`http://localhost:5000/conversations/${conversationId}`);
            setSelectedConversation(result.data);
            setMessages(result.data.messages);
        } catch (error) {
            console.error('Failed to select conversation:', error);
        }
    };

    const sendMessage = async (text) => {
        if (selectedConversation) {
            try {
                // Send message to the server
                console.log('send msg to server');
                const response = await axios.post('/send-message', {
                    senderPsid: selectedConversation.customerId,
                    messageText: text,
                    conversationId: selectedConversation._id
                });

                console.log('Message sent and logged!', response.data);
                console.log('Working on showing message on screen ');



                const newMessage = {
                    text: text,
                    timestamp: response.data.sentAt,
                    messageId: response.data.messageId,
                    senderId: 'PAGE_ID', // Replace with actual Page ID
                    recipientId: selectedConversation.customerId,
                    outgoing: true
                };
                setMessages([...messages, newMessage]);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    return (
        <div className="flex">
            <ConversationList conversations={conversations} onSelectConversation={selectConversation} />
            <MessagePanel messages={messages} onSendMessage={sendMessage} />
            {customerProfile && <CustomerProfile profile={customerProfile} />}
        </div>
    );
};

export default ChatPage;
