import {io} from 'socket.io-client';

const socket = io();

// const socket = io('http://127.0.0.1:5000', {
//     withCredentials: false,
//     transports: ['websocket', 'polling']
//   });

export default socket;