import React, { useEffect, useState } from 'react';
import '../chat.css'
import axios from 'axios';
const ChatRoom = ({ socket, userName, room }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    // Function to fetch messages from the database
    const fetchMessage = async () => {
        try {

            const response = await axios.get(`http://localhost:5000/api/messages?room=${room}`);
            const {messages} = response.data;
            console.log("Response: ", messages);
            setMessageList(messages);

        } catch (error) {
            console.log('Error: ', error)
        }

    }

    // Send message to the server or another client
    const sendMessage = async () => {
        if (currentMessage.trim() !== '') {
            const messageData = {
                room,
                author: userName,
                message: currentMessage.trim(),
            };

            // sending the message to the server client
            await socket.emit('send_message', messageData);
            setMessageList(prevList => [...prevList, messageData]);
            setCurrentMessage('');
        }
    };

    useEffect(() => {

        // Fetch messages when the component mounts
        fetchMessage();

        const receiveMessage = (data) => {
            setMessageList(prevList => [...prevList, data]);
        };

        socket.on('receive_message', receiveMessage);

        // Cleanup function to remove the event listener
        return () => {
            socket.off('receive_message', receiveMessage);
        };
    // }, [socket, messageList]);
}, [socket]);

    const handleChangeCurrMessage = (e) => {
        setCurrentMessage(e.target.value);
    };

    return (
        <div className='h-screen flex flex-col'>
            <div className='bg-black text-white flex-1 overflow-y-scroll'>
                {messageList.map((message, index) => (
                    <div key={index} className='px-4 py-2 mt-4'
                        id={message.author === userName ? 'you' : 'other'}
                    >
                        <div className='message-meta items-center mb-2 flex flex-col justify-end'>
                            <div className='flex w-full justify-end'>
                                <div className='image_user'>
                                    <img
                                        className='w-8 h-8 rounded-full mr-2'
                                        src='https://picsum.photos/50/50'
                                        alt='User Avatar'
                                    />
                                </div>

                                <div className='message-content bg-dark text-white border rounded-lg p-2 px-4 shadow mb-2 max-w-sm'>
                                    <div>
                                        {message.message}
                                    </div>
                                    <div className='text-xs text-gray-500'>
                                        {message.author} - {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
            <div className='bg-black px-4 py-2 pb-3'>
                <div className='flex items-center'>
                    <input
                        className='w-full border rounded-full py-2 px-4 mr-2 bg-black text-white'
                        type='text'
                        placeholder='Type your message...'
                        value={currentMessage}
                        onChange={handleChangeCurrMessage}
                    />
                    <button
                        className='bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-full'
                        onClick={sendMessage}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;