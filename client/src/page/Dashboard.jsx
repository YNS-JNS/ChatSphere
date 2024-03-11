import React, { useEffect, useState } from 'react';
import ChatRoom from '../components/ChatRoom';
import axios from 'axios';

const Dashboard = ({ socket, userName, room }) => {

    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/user");
            console.log(res.data.users);
            setUsers(res.data.users);
        } catch (error) {
            console.log("Error getting users: ", error);
        }
    };

    useEffect(() => {
        getUsers();
    }, [])


    return (
        <div className="flex">
            <div className="w-1/4 h-screen bg-black sticky top-0 p-4 text-white border-r-2">
                {/* <h2 className="text-lg font-bold mb-4 border px-1 text-center rounded-lg">Dashboard</h2> */}
                <h2 className="text-lg font-bold mb-4 px-1 rounded-lg">
                    🟢 online
                </h2>
                <h2 className="text-lg font-bold mb-4 border px-1 text-center rounded-lg"
                    title={socket.id}>
                    {userName}
                </h2>
                <ul className="list-none">
                    <li className="mb-2"><a href="#" className="text-gray-400 hover:text-gray-100">
                        Room : {room}
                    </a></li>
                    {
                        users.map((user, index) => (
                            <li key={index} className="mb-2">
                                <div className="flex text-gray-400 hover:text-gray-100">
                                    <img
                                        className='w-8 h-8 rounded-full mr-2'
                                        src='https://picsum.photos/50/50'
                                        alt='User Avatar'
                                    />
                                    {user.userName}
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
            <div className="w-3/4">
                <ChatRoom socket={socket} userName={userName} room={room} />
            </div>
        </div>
    );
};

export default Dashboard;
