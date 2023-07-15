import React, {useState} from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import {useNavigate} from 'react-router-dom';
import './ytloader.css';

function YTLoader() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [ytVideo, setYtVideo] = useState(true);

    // Calls server to download YT video from URL and display on downloads page
    const generateConvert = () => {
        let userInput = document.getElementById("link").value;
        // Check if input is empty and handle error, otherwise convert
        if (userInput.trim() == null || userInput.trim().length <= 0) {
            document.getElementById("error-msg").innerText = "Please enter a YouTube URL!";
            setLoading(false);
        }
        else {
            // Ensure actual YouTube URL is input
            if (ytVideo === true && (userInput.trim().toLowerCase().indexOf("https://www.youtube.com/watch?v=" === -1) && userInput.trim().toLowerCase().indexOf("https://youtu.be/") === -1)) {
                document.getElementById("error-msg").innerText = "Please enter a YouTube URL!";
                setLoading(false);
            }
            else if (ytVideo === false && userInput.trim().toLowerCase().indexOf("https://www.youtube.com/shorts/") === -1) {
                document.getElementById("error-msg").innerText = "Please enter a YouTube shorts URL!";
                setLoading(false);
            }
            else {
                // On mobile, share URL is shortened so modify it to proper URL for download
                if (userInput.trim().toLowerCase().indexOf("https://youtu.be/") !== -1) {
                    let pathname = new URL(userInput).pathname;
                    userInput = "https://www.youtube.com/watch?v=" + pathname.replace("/", "");
                }
                // On mobile, this query is placed into URL so remove it
                if (userInput.trim().toLowerCase().indexOf("?feature=share") !== -1) {
                    userInput.replace("?feature=share", "");
                }

                document.getElementById("error-msg").innerText = "";
                setLoading(true);

                // Fetch video details from server and pass data onto the downloads page
                fetch(`http://localhost:9919/video?URL=${userInput}`)
                .then((resp) => {return resp.json()})
                .then((data) => {navigate('/download', {state: JSON.stringify(data)})})
                .catch((error) => {
                    document.getElementById("error-msg").innerText = "Please enter a YouTube URL!";
                    setLoading(false);
                })
            }
        }
    }

    // Video/shorts buttons
    const handleVideo = () => {
        setYtVideo(true);
        document.getElementById("default").style.backgroundColor = "orange";
        document.getElementById("shorts").style.backgroundColor = "white";
    }
    const handleShorts = () => {
        setYtVideo(false);
        document.getElementById("default").style.backgroundColor = "white";
        document.getElementById("shorts").style.backgroundColor = "orange";
    }

    return (
        <div className="ytloader-wrapper">
            <div className="ytloader-root">
                <div className="input-container">
                    <h1>YTLoader</h1>
                    <p className="tag-line">Free YouTube Video Downloader - Convert to MP4, MP3 and More!</p>
                    <div className="input-field-div">
                        <input id="link" placeholder="Type or paste video URL here" />
                        <button onClick={generateConvert}><AiOutlineSearch className="input-icon" size={40} /></button>
                    </div>
                    <div className="video-type-picker">
                        <div id="default" onClick={handleVideo}>Video</div>
                        <div id="shorts" onClick={handleShorts}>Shorts</div>
                    </div>
                    <p id="error-msg"></p>
                    {
                        loading ?
                        <span class="loader"></span>
                        :
                        <div></div>
                    }
                </div>
            </div>
        </div>
    );
}

export default YTLoader;