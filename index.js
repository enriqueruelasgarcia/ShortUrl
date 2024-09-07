require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

let urls = [];
let counter = 0;

app.post('/api/shorturl', function(req, res) {
    const originalUrl = req.body.url;
    const urlRegex = /^(https?:\/\/)([^\s$.?#].[^\s]*)$/i;
    if (!urlRegex.test(originalUrl)) {
        return res.json({ error: 'invalid url' });
    } else {
        counter++;
        urls.push({ originalUrl, shortUrl: counter });

        res.json({
            original_url: originalUrl,
            short_url: counter
        });
    }
});

app.get('/api/shorturl/:shorturl', function(req, res) {
    const shortUrl = parseInt(req.params.shorturl, 10);
    const urlEntry = urls.find(entry => entry.shortUrl === shortUrl);
    if (urlEntry) {
        res.redirect(urlEntry.originalUrl);
    } else {
        res.json({ error: 'No short URL found for the given input' });
    }
});

app.listen(port, function() {
    console.log(`Listening on port ${port}`);
});