// SERVER - Important: This one is for development purposes only, however, 
// use it as an example for how you would implement it into your own existing server

// Import the required modules
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

// Setting the development server - change it if you are using this for production
const app = express();
app.use(cors());
app.listen(9919, () => {
    console.log('Server is running on port 9919.');
});


// Website redirects here and video details display here allowing user to choose what format to download
app.get('/video', (req,res) => {
    let videoURL = req.query.URL;

    // Promise to retrieve video information - try/catch to handle partial URL input
    let infoPromise = new Promise((resolve, reject) => {
        try {
            let info = ytdl.getInfo(videoURL);
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
            jsonBody.formats.push([resp.formats[i].mimeType, sizeInMB, resp.formats[i].audioBitrate + 'kbps', resp.formats[i].qualityLabel, resp.formats[i].container, resp.formats[i].hasAudio, resp.formats[i].hasVideo, resp.formats[i].itag]);
        }
        res.send(jsonBody);
    })
    // NULL so user redirected back to input page due to (invalid) partial URL input
    .catch((error) => {
        res.send(null);
    })
});


app.get('/videosaver', (req,res) => {
    // Retrieve URL, filename and content type from request URL
    let URL = req.query.URL;
    let fileName = decodeURIComponent(req.query.filename);
    let fileFormat = req.query.format;
    let fileQualityItag = req.query.itag;
    let mimeType = req.query.mimeType;

    // Set the header
    res.header('Content-Disposition', `attachment; filename=${fileName + '.' + fileFormat}`);
    res.header('Content-Type', mimeType);

    // Download the video in the appropriate quality/format
    ytdl(URL, {quality: fileQualityItag, format: fileFormat}).pipe(res);
});