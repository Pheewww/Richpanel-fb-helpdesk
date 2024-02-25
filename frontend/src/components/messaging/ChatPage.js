import React, { useState } from 'react';
import ConversationList from './ConversationsList'; // Ensure correct path
import MessagePanel from './MessagePanel'; // Ensure correct path
import CustomerProfile from './CustomerProfile'; // Ensure correct path
// Sample conversations data
const sampleConversations = [
    {
        id: '1',
        customerName: 'Amit RG',
        lastMessage: 'Hey There! I probably did one of the bes...',
        source: 'Facebook DM',
        time: '10m',
    },
    {
        id: '1',
        customerName: 'Amit RG',
        lastMessage: 'Hey There! I probably did one of the bes...',
        source: 'Facebook DM',
        time: '10m',
    },
];

// Sample messages data
const sampleMessages = [
    {
        senderId: 'user1',
        text: 'Hi, I need help with my order.',
        timestamp: new Date().toISOString(),
    },
    {
        senderId: 'PAGE_ID',
        text: 'Sure, what seems to be the issue?',
        timestamp: new Date().toISOString(),
    },
];

// Sample customer profile data
const sampleCustomerProfile = {
    name: 'Alice',
    email: 'alice@example.com',
    picture: 'https://via.placeholder.com/150',
};

const ChatPage = () => {
    const [conversations] = useState(sampleConversations);
    const [selectedConversation, setSelectedConversation] = useState(sampleConversations[0]); // Default to first conversation
    const [messages, setMessages] = useState(sampleMessages); // Default messages to display
    const [customerProfile, setCustomerProfile] = useState(sampleCustomerProfile); // Display sample customer profile

    // Function to handle conversation selection (mock-up for demonstration)
    const selectConversation = (conversationId) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setSelectedConversation(conversation);
            // Assuming all conversations use the same messages for this sample
            setMessages(sampleMessages);
        }
    };

    // Function to handle sending a message (mock-up for demonstration)
    const sendMessage = (text) => {
        const newMessage = {
            senderId: 'PAGE_ID',
            text,
            timestamp: new Date().toISOString(),
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <div className="flex">
            <ConversationList
                conversations={conversations}
                onSelectConversation={selectConversation}
            />
            <MessagePanel
                messages={messages}
                onSendMessage={sendMessage}
            />
            <CustomerProfile profile={customerProfile} />
        </div>
    );
};

export default ChatPage;
