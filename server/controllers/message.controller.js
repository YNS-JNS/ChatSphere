import Message from '../models/message.model.js'

const getMessages = async (req, res) => {

    const { room } = req.query;

    if (!room) {
        return res.status(404).json({ message: 'Room not found' });
    }

    const messages = await Message.find({room});

    if (!messages) {
        return res.status(404).json({ message: 'Messages not found' });
    }

    return res.status(200).json({ messages });

};


export { getMessages };