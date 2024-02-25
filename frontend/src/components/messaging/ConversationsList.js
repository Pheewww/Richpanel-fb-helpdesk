import React from 'react';
const ConversationItem = ({ conversation, onSelect }) => {
    return (
        <div
            className="flex items-center p-4 border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelect(conversation._id)}
        >
            <div className="flex flex-1 min-w-0">
                <div className="flex-initial mr-4">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {conversation.customerName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                        {conversation.source}
                    </div>
                    <div className="text-xs text-gray-600 truncate">
                        {conversation.lastMessage}
                    </div>
                </div>
            </div>
            <div className="flex-none ml-4 text-right text-xs text-gray-400">
                {conversation.time}
            </div>
        </div>
    );
};


const ConversationList = ({ conversations, onSelectConversation }) => {
    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 bg-white shadow-md">
                <h1 className="text-xl font-semibold">Conversations</h1>
            </div>

            <div className="flex-grow overflow-y-auto">
                {conversations.map((conversation) => (
                    <ConversationItem
                        key={conversation._id}
                        conversation={conversation}
                        onSelect={onSelectConversation}
                    />
                ))}
            </div>
        </div>
    );
};

export default ConversationList;
