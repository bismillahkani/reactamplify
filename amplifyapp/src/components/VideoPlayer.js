import React from "react";

import videojs from "video.js";
import "video.js/dist/video-js.css";

class VideoPlayer extends React.Component {
    componentDidMount() {
		this.player = videojs(this.videoNode, this.props);
	  }
	componentWillUnmount() {
		if (this.player) {
		  this.player.dispose();
		}
	  }
	componentDidUpdate() {
		console.log(this.props)
		console.log(this.props.sources[0].src)
		if(this.props.sources.length >0){
			this.player.src({
			type: this.props.sources[0].type,
			src: this.props.sources[0].src
		});
	  }
	}
    render() {
        return (
            <div>
				<div data-vjs-player>
					<video 
						ref={(node) => { this.videoNode = node;}} className="video-js">
					</video>
				</div>
			</div>
        );
    }
}

 export default VideoPlayer;