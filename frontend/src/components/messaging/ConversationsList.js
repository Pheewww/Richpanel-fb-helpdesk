
import React from 'react';
import '../../App.css'; // Ensure you create an appropriate CSS file for styling

// Placeholder data simulating fetched data
const PlaceholderConversations = [
    {
        _id: "1",
        customerName: "Amit RG",
        lastMessage: "Is it in stock right now?",
        time: "10m",
        source: "Facebook DM",
    },
    {
        _id: "2",
        customerName: "Hiten Saxena",
        lastMessage: "Available in store?",
        time: "10m",
        source: "Facebook Post",
    },
    // ... more placeholder conversations
];

// The sidebar component
const Sidebar = () => (
    <div className="sidebar">
        <div className="sidebar-icon">🏠</div>
        <div className="sidebar-icon active">💬</div>
        <div className="sidebar-icon">📊</div>
        {/* ... other sidebar icons */}
    </div>
);

// A single conversation item
const ConversationItem = ({ conversation, onSelect }) => (
    <div className="conversation-item" onClick={() => onSelect(conversation._id)}>
        <div className="checkmark-container">
            <input type="checkbox" className="conversation-checkbox" />
        </div>
        <div className="conversation-content">
            <div className="conversation-title">{conversation.customerName} || Name</div>
            <div className="conversation-title">{conversation.source} || Facebook DM</div>
            <div className="conversation-last-message">{conversation.lastMessage} || last meassage - good</div>
            <div className="conversation-timestamp">{conversation.time} 10:30</div>
        </div>
    </div>
);

// The conversation list component
const ConversationList = ({ conversations, onSelectConversation }) => (
    <div className="conversation-list">
        <div className="conversation-title-bar">
            <div className="conversation-title">Conversations</div>
            <div className="conversation-settings">⚙️</div>
        </div>
        {conversations.map((conversation) => (
            <ConversationItem
                key={conversation._id}
                conversation={conversation}
                onSelect={onSelectConversation}
            />
        ))}
    </div>
);

// // The main chat interface component
// const ChatInterface = () => {
//     const handleSelectConversation = (id) => {
//         console.log('Selected conversation ID:', id);
//         // Logic to display messages or perform other actions
//     };

//     return (
//         <div className="chat-interface">
//             <Sidebar />
//             <ConversationList
//                 conversations={PlaceholderConversations}
//                 onSelectConversation={handleSelectConversation}
//             />
//             {/* Message panel or other components can be added here */}
//         </div>
//     );
// };

export default ConversationList;
