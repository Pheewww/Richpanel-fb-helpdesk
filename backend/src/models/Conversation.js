import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    pageId: String,
    customerId: String,
    messages: [{
        timestamp: Date,
        messageId: String,
        text: String,
        attachments: [String],
        senderId: String,
        recipientId: String
    }],
    lastMessageAt: Date
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
