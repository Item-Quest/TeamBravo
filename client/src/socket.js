import {io} from 'socket.io-client';

const socket = io();

socket.on('connect', function() {
  socket.emit('client connection', {data: 'I/m connected!'});
})

socket.on('server acknowledge', function(data){
  console.log(data.data);
})

export default socket;