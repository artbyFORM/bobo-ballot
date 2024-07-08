import express from 'express';
import fetch from 'node-fetch';
const app = express();
const PORT = 3001;

app.use('/proxy', async (req, res) => {
    const url = req.originalUrl.replace('/proxy?url=', '');
    console.log("attempting to fetch: ", url);
    
    try {
        new URL(url);
    } catch (error) {
        console.error(error);
        return res.status(400).send('Invalid or missing URL');
    }

    try {
        const response = await fetch(url);
        const data = await response.buffer();
        res.setHeader('Content-Type', response.headers.get('Content-Type'));
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // TODO: add other origins
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error proxying the file');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));