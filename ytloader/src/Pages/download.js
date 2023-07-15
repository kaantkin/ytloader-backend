import React, { useEffect } from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import "./download.css"

function Download() {
    const location = useLocation();
    const navigate = useNavigate();
    const serverURL = 'http://localhost:9919/'; // Change this to your server - this is only for development/example

    let videoData = JSON.parse(location.state);
    
    // If user has not input URL or input partial URL (which will return NULL from server) then redirect back to input page
    useEffect(() => {
        if (videoData === null) {
            navigate('/', {replace:true});
        }
    }, []);

    useEffect(() => {
        for (let i = 0; i < document.getElementsByClassName("format-selector-ele").length; i++) {
            console.log(document.getElementById('formatBtn0').value)
            if (document.getElementById(`formatBtn${i}`).value === "on"){
                document.getElementById(`formatBtn${i}`).classList.add("ele-selected");
            }
        }
    }, [])

    // Convert the length into readable and formatted seconds for display
    const secondsFormat = () => {
        let seconds = videoData["lengthSeconds"];
        let minutes = Math.floor(seconds / 60);
        let extraSeconds = seconds % 60;
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        else {
            minutes = minutes;
        }
        if (extraSeconds < 10) {
            extraSeconds = "0" + extraSeconds;
        }
        else {
            extraSeconds = extraSeconds;
        }
        return minutes + ":" + extraSeconds;
    }
 
    // Retrieve the video thumbnail for display
    const getThumbnail = () => {
        let thumbnail = "";
        // Find the 1920x1080 hd thumbnail and set it for return
        for (let i = 0; i < videoData["thumbnail"].length; i++) {
            if (videoData["thumbnail"][i]["width"] === 1920) {
                thumbnail = videoData["thumbnail"][i]["url"];
            }
        }
        // If 1920x1080 thumbnail doesn't exist return the one that does
        if (thumbnail === "") {
            thumbnail = videoData["thumbnail"][0]["url"];
        }
        return thumbnail;
    }

    return (
        <div className="download-wrapper">
        <div className="result-container">
            <div className="video-details">
                <img className="thumbnail" src={getThumbnail()} />
                <div className="descriptors">
                    <h3 className="title">{videoData["title"]}</h3>
                    <p>Video Length: {secondsFormat()}</p>
                </div>
            </div>
            <div className="download-section">
                <div className="format-select-parent">
                    <hr style={{width:"90%", height:"1px", backgroundColor:"black", border:"none"}} />
                    <h3>Video And Audio</h3>
                    <table className="results-table">
                        <thead>
                            <tr className="results-header">
                                <th>Quality</th>
                                <th>Format</th>
                                <th>Size</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            videoData["formats"].map((value, index) => {
                                if (value[5] === true && value[6] === true) {
                                    console.log(videoData["videoURL"])
                                    return (
                                        <tr>
                                            <td>{value[3]}</td>
                                            <td>{value[4]}</td>
                                            <td>{value[1]}</td>
                                            <td><a href={serverURL + 'videosaver?URL=' + videoData["videoURL"] + '&filename=' + encodeURIComponent(videoData["title"]) + '&format=' + value[4] + '&quality=' + value[3] + '&itag=' + value[7]  + '&mimeType=' + value[0]} target="_blank">Download</a></td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        </tbody>
                    </table>
                    <h3>Only Video</h3>
                    <table className="results-table">
                        <thead>
                            <tr className="results-header">
                                <th>Quality</th>
                                <th>Format</th>
                                <th>Size</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            videoData["formats"].map((value, index) => {
                                if (value[5] === false && value[6] === true) {
                                    return (
                                        <tr>
                                            <td>{value[3]}</td>
                                            <td>{value[4]}</td>
                                            <td>{value[1]}</td>
                                            <td><a href={serverURL + 'videosaver?URL=' + videoData["videoURL"] + '&filename=' + encodeURIComponent(videoData["title"]) + '&format=' + value[4] + '&quality=' + value[3] + '&itag=' + value[7]  + '&mimeType=' + value[0]} target="_blank">Download</a></td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        </tbody>
                    </table>
                    <h3>Only Audio</h3>
                    <table className="results-table">
                        <thead>
                            <tr className="results-header">
                                <th>Quality</th>
                                <th>Format</th>
                                <th>Size</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            videoData["formats"].map((value, index) => {
                                if (value[5] === true && value[6] === false) {
                                    if (value[4] === "mp4") {
                                        value[4] = "mp3";
                                    }
                                    return (
                                        <tr>
                                            <td>{value[2]}</td>
                                            <td>{value[4]}</td>
                                            <td>{value[1]}</td>
                                            <td><a href={serverURL + 'videosaver?URL=' + videoData["videoURL"] + '&filename=' + encodeURIComponent(videoData["title"]) + '&format=' + value[4] + '&quality=' + value[3] + '&itag=' + value[7]  + '&mimeType=' + value[0]} target="_blank">Download</a></td>
                                        </tr>
                                    )
                                }
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Download;