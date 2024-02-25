import React, { useState } from 'react';

// Define the Message component separately
const Message = ({ message }) => {
    const isOwnMessage = message.senderId === 'YOUR_PAGE_ID';
    const messageBubbleClasses = `max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-3xl shadow ${isOwnMessage ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`;
    const timestampClasses = `text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`;

    return (
        <div className={`my-2 ${isOwnMessage ? 'flex justify-end' : 'flex justify-start'}`}>
            <div>
                <div className={messageBubbleClasses}>{message.text}</div>
                <div className={timestampClasses}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    }).toLowerCase()}
                </div>
            </div>
        </div>
    );
};

// Define the MessagePanel component separately
const MessagePanel = ({ messages = [], onSendMessage, customerName }) => {
    const [inputMessage, setInputMessage] = useState('');

    const handleSend = (event) => {
        event.preventDefault();
        if (inputMessage.trim()) {
            onSendMessage(inputMessage);
            setInputMessage('');
        }
    };

    return (
        <div className="w-full lg:w-2/3 bg-white flex flex-col">
            <div className="border-b border-gray-200 p-4 text-lg font-semibold">
                {customerName}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages && messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                <input
                    type="text"
                    className="border p-2 w-full rounded"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
            </form>
        </div>
    );
};

export default MessagePanel;
