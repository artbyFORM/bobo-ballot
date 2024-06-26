import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3001;

app.use('/proxy', async (req, res) => {
    const url = req.query.url;
    console.log(url)
    // Check if the URL is provided and is a valid URL
    try {
        new URL(url); // This will throw an error if the URL is invalid
    } catch (error) {
        console.error(error);
        return res.status(400).send('Invalid or missing URL');
    }

    try {
        const response = await fetch(url);
        const data = await response.buffer();
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        res.setHeader('Access-Control-Allow-Origin', '*'); // Adjust in production
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error proxying the file');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));