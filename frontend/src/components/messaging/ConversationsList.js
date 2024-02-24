import React from 'react';

const ConversationList = ({ conversations, onSelectConversation }) => {
    return (
        <div className="w-1/4 bg-gray-100 h-screen overflow-y-auto">
            {Array.isArray(conversations) && conversations.map((conversation) => (
                <div
                    key={conversation.id}
                    className="p-4 hover:bg-blue-50 cursor-pointer"
                    onClick={() => onSelectConversation(conversation.id)}
                >
                    <div className="font-bold">{conversation.customerName}</div>
                    <div className="text-sm text-gray-600">{conversation.lastMessage}</div>
                </div>
            ))}
        </div>
    );
};

export default ConversationList;
