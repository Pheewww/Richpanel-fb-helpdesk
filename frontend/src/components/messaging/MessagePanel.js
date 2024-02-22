// components/MessagePanel.js
import React from 'react';

const MessagePanel = ({ messages, onSendMessage }) => {
    let input;

    const handleSend = () => {
        onSendMessage(input.value);
        input.value = '';
    };

    return (
        <div className="w-1/2 bg-white h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`p-4 ${message.isAgent ? 'text-right' : ''}`}>
                        <div className="inline-block bg-gray-100 p-2 rounded">{message.text}</div>
                    </div>
                ))}
            </div>
            <div className="p-4">
                <input
                    type="text"
                    className="border p-2 w-full"
                    placeholder="Type your message..."
                    ref={(node) => {
                        input = node;
                    }}
                />
                <button onClick={handleSend} className="border p-2 bg-blue-500 text-white">
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessagePanel;
