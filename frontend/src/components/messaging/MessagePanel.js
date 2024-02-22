// components/MessagePanel.js
import React, { useRef } from 'react';

const MessagePanel = ({ messages, onSendMessage }) => {
    const inputRef = useRef(null);

    const handleSend = () => {
        if (inputRef.current) {
            onSendMessage(inputRef.current.value);
            inputRef.current.value = '';
        }
    };

    return (
        <div className="w-1/2 bg-white h-screen flex flex-col">
            <div className="flex-1 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`p-4 ${message.senderId === 'YOUR_PAGE_ID' ? 'text-right' : ''}`}>
                        <div className={`inline-block ${message.senderId === 'YOUR_PAGE_ID' ? 'bg-blue-100' : 'bg-gray-100'} p-2 rounded`}>
                            {message.text}
                        </div>
                        <p className="text-xs text-gray-600">{new Date(message.timestamp).toLocaleString()}</p>
                    </div>
                ))}
            </div>
            <div className="p-4">
                <input
                    type="text"
                    className="border p-2 w-full mb-2"
                    placeholder="Type your message..."
                    ref={inputRef}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleSend();
                        }
                    }}
                />
                <button onClick={handleSend} className="border p-2 bg-blue-500 text-white w-full">
                    Send
                </button>
            </div>
        </div>
    );
};

export default MessagePanel;
