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
                const result = await axios('/api/conversations');
                setConversations(result.data);
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
                const result = await axios(`/api/conversations/${selectedConversation._id}/messages`);
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
            const result = await axios(`/api/conversations/${conversationId}`);
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
                const response = await axios.post(`https://graph.facebook.com/LATEST-API-VERSION/PAGE_ID/messages?access_token=PAGE-ACCESS-TOKEN`, {
                    recipient: {
                        id: selectedConversation.customerId
                    },
                    message_type: "RESPONSE",
                    message: {
                        text: text
                    }
                });

                console.log('Message sent!', response.data);

                //  messages state to show the new message
                const newMessage = {
                    text: text,
                    timestamp: new Date(),
                    messageId: response.data.message_id,
                    senderId: 'PAGE_ID', 
                    recipientId: selectedConversation.customerId
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
