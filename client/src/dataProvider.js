import socket from './socket';

const isMockup = true;
export function getAllPlayers() {
    if (isMockup)
        return [
            {Id: 1, Name: "Joe", Pfp:"https://png.pngtree.com/png-clipart/20220821/ourmid/pngtree-male-profile-picture-icon-and-png-image-png-image_6118773.png",Score: 45},
            {Id: 2, Name: "Anna", Pfp: "https://png.pngtree.com/png-vector/20230317/ourmid/pngtree-cute-drawing-cartoon-girl-for-profile-picture-vector-png-image_6650753.png", Score: 40},
            {Id: 3, Name: "Alex", Pfp: "https://cdn.pixabay.com/photo/2018/05/19/22/03/man-3414477_960_720.png", Score: 35},
            {Id: 4, Name: "Kate", Pfp: "https://cdn0.iconfinder.com/data/icons/profession-character-avatar/512/Profession_Character_Avatar-04-512.png",Score: 30}
           ];
           
     //backend logic here 
     return [];
 };

 export function createGame(uName) {
    socket.emit('username change', {data: uName});
    if (isMockup) 
        return {gameCode: "1234", gameOwner: {Id: 5, Name: uName, Pfp: "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg", Score: 0}};
    return {};  //backend logic here
 }
export async function getLeaderboardData() {
    const response = await fetch('/api/leaderboard');
    const data = await response.json();

    if (response.ok) {
        return data.leaderboard;
    } else {
        console.error('Error fetching leaderboard data:', data.message);
        return [];
    }
}
