import {io} from 'socket.io-client';

// const socket = io();

const socket = io({
    withCredentials: false,
    transports: ['websocket', 'polling']
  });

export default socket;