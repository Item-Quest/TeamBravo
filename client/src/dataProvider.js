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