import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
    userName: { type: String, required: true, unique: true},

},
    { timestamps: true }
);

const User = mongoose.model('UserModel', UserSchema);

export default User;