import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
    room: { type: String },
    author: { type: String},
    // author: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },
    message: { type: String },
},
    { timestamps: true }
);

const Message = mongoose.model('MessageModel', MessageSchema);

export default Message;