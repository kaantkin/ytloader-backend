// SERVER - Important: This one is for development purposes only, however, 
// use it as an example for how you would implement it into your own existing server

// Import the required modules
const express = require('express');
const cors = require('cors');
const yt = require('./ytinfo');
const { DownloaderHelper } = require('node-downloader-helper');
const fs = require('fs');

// Setting the development server - change it if you are using this for production
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});


// Website redirects here and video details display here allowing user to choose what format to download
app.get('/video', (req,res) => {
    let videoURL = req.query.URL;

    // Promise to retrieve video information - try/catch to handle partial URL input
    let infoPromise = new Promise((resolve, reject) => {
        try {
            let info = yt.getInfo(videoURL);
            resolve(info);
        } 
        catch {
            reject("Error");
        }
    });

    // Retrieve the details and return them to the user
    infoPromise.then((resp) => {
        let jsonBody = {"title":resp.videoDetails.title, "videoURL":resp.videoDetails.video_url, "lengthSeconds": resp.videoDetails.lengthSeconds, "thumbnail": resp.videoDetails.thumbnails, "formats":[]};
        for (let i = 0; i < resp.formats.length; i++) {
            let sizeInMB = '';
            if (resp.formats[i].contentLength != null) {
                sizeInMB = (resp.formats[i].contentLength / 1e6).toFixed(2) + ' MB'; // Convert size from byte to MB
            }
            jsonBody.formats.push([resp.formats[i].mimeType, sizeInMB, resp.formats[i].audioBitrate + 'kbps', resp.formats[i].qualityLabel, resp.formats[i].container, resp.formats[i].hasAudio, resp.formats[i].hasVideo, resp.formats[i].itag, resp.formats[i].url]);
        }
        res.send(jsonBody);
    })
    // NULL so user redirected back to input page due to (invalid) partial URL input
    .catch((error) => {
        console.log(error)
        res.send(null);
    })
});


app.get('/videosaver', (req,res) => {
    // Retrieve URL, filename and content type from request URL
    let URL = req.query.URL;
    let fileName = decodeURIComponent(req.query.filename);
    let fileFormat = req.query.format;
    let mimeType = req.query.mimeType;
    let overallName = fileName + '.' + fileFormat;

    // Set the header
    res.header('Content-Disposition', `attachment; filename=${fileName + '.' + fileFormat}`);
    res.header('Content-Type', mimeType);

    // Download the video in the appropriate quality/format
    const dl = new DownloaderHelper(URL, __dirname, {fileName:overallName});
    dl.on('end', () => {
        // Read the file in server and send to client
        let readable = fs.createReadStream(overallName);
        readable.pipe(res);
        // Delete file after sending
        fs.unlink(overallName, (err) => {
            if (err) throw err;
        });
    });
    dl.start().catch(err => console.error(err));
});

module.exports = app;