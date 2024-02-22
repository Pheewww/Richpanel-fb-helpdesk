import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    facebookId: { type: String, unique: true, sparse: true },
    displayName: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    pageAccessTokens: [{
        pageId: String,
        accessToken: String,
        name: String,
    }]
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
