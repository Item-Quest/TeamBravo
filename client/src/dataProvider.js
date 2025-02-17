<<<<<<< HEAD
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
=======
export function getLeaderboardData() {
    return [
     {Place: 1, Name: "Joe", Score: 45},
     {Place: 2, Name: "Anna", Score: 40},
     {Place: 3, Name: "Alex", Score: 35},
     {Place: 4, Name: "Kate", Score: 30}
    ]; 
 };
>>>>>>> Dannny
