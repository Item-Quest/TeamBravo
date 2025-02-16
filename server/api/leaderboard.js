import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import express from 'express';

const router = express.Router();

router.get('/leaderboard', async (req, res) => {
    const db = await open({
        filename: '../scores.db',
        driver: sqlite3.Database
    });

    const rows = await db.all('SELECT Name, Score FROM users ORDER BY Score DESC LIMIT 4');

    const leaderboardData = rows.map((row, index) => ({
        Place: index + 1,
        Name: row.Name,
        Score: row.Score
    }));

    res.json(leaderboardData);
});

export default router;
