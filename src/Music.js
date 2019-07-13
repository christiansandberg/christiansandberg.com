import React from 'react';
import AudioPlayer from './audioplayer';
import './Music.css';


class Music extends React.Component {

    render() {
        return (
            <section id="music">
                <h2>Music</h2>
                <AudioPlayer src="/audio/paper_plane.m4a" width={400} radius={100}/>
            </section>
        );
    }
}

export default Music;
