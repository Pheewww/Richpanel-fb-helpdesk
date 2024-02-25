import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    facebookId: { type: String, unique: true },
    displayName: String,
    email: { type: String, unique: true, sparse: true },
    password: { type: String, sparse: true },
    dateOfBirth: Date,
    pageAccessTokens: [{
        pageId: String,
        accessToken: String,
        name: String,
    }],
    pageId: String,
});

// const userSchema = new mongoose.Schema({
//     facebookId: { type: String, unique: true },
//     displayName: String,
//     email: { type: String, unique: true, sparse: true },
//     password: { type: String, sparse: true },
//     pageAccessTokens: String,
//     pageId: String,
//     accessToken: String,
//     name: String,
// });

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
