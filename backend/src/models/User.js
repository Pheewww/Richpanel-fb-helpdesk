import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    facebookId: { type: String, unique: true },
    displayName: String,
    pageAccessTokens: [{
        pageId: String,
        accessToken: String,
        name: String,
    }]
});

const User = mongoose.model('User', userSchema);

export default User;
