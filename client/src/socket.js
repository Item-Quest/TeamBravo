import {io} from 'socket.io-client';

const socket = io();

 //const socket = io('http://127.0.0.1:8050', {
 //    withCredentials: false,
 //    transports: ['websocket', 'polling']
 //  });

export default socket;