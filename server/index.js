import express from 'express';
import leaderboardRouter from './api/leaderboard.js';

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', leaderboardRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
