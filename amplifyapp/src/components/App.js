import React from 'react';
import Output from './Output';
import Status from './Status';

import VideoPlayer from "./VideoPlayer"
import awsvideoconfig from "./aws-video-exports";

// import Amplify, { Storage } from 'aws-amplify';
// import awsconfig from "./aws-exports";
// Amplify.configure(awsconfig);

const API_URL = "https://je0xyo10xe.execute-api.us-east-1.amazonaws.com/beta"

class App extends React.Component {
	
	constructor(props){
		super(props);
		this.output = React.createRef();
		this.status = React.createRef();
	}
	state = {fileUrl: '',
			 file: '',
			 filename: '',
			 videoname:'',
			 videoOnDemandJsOptions: {
				autoplay: false,
				controls: true,
				width:600,
				sources: [
				  {
					src: '', 
				  }, 
				], 
			},
			viewVideoForm: false,
			viewTextForm: false
		}
	handleChange = e => {
		const file = e.target.files[0]
		this.setState({
			fileUrl: URL.createObjectURL(file), 
			file,
			filename: file.name,
			videoname: this.state.filename.split('.')[0]
			})
	}
	saveFile = async () => {
		var t0 = performance.now()
		await Storage.put(this.state.filename, this.state.file)
		.then(() => {
			console.log('Successfully uploaded video to s3!')
			this.setState({fileUrl: '', file: ''})
			this.status.current.onGettingStatus(`Successfully uploaded ${this.state.filename} to S3.`);
		})
		.catch(err => {
			console.log('error uploading file!', err)
			this.status.current.onGettingStatus(`Error when uploading: ${this.state.filename} to S3.`);
		})
		var t1 = performance.now()
		console.log("Uploading took " + (t1 - t0) + " milliseconds.")
	}
	onOilFormSubmit = async () => {
		var t0 = performance.now()
		const oilresponse = await fetch (`${API_URL}/drill`, {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			},
			method: "POST",
			body: JSON.stringify({
				filename: this.state.filename,
				service: "oil-leak",
			}),
		});
		const oilprediction = await oilresponse.text();
		const oilstat = await oilresponse.status;
		console.log(this.state.filename)
		console.log(oilstat)
		if (oilstat === 200) {
			this.setState({
				viewTextForm: true
			})
			console.log("Video Processing Completed!");
			console.log((oilprediction));
			this.output.current.onGettingPred(`Anomaly Detected: ${oilprediction}`);
			this.status.current.onGettingStatus('Video stream conversion in process. Video will be displayed in 2 minutes.');
			var t1 = performance.now()
			console.log("Oil-leak prediction took " + (t1 - t0) + " milliseconds.")
		}
		else {
			this.setState({
				viewTextForm: true
			})
			console.log("Server Error!");
			console.log((oilprediction));
			this.output.current.onGettingPred(`Server Error!`);
		}
		setTimeout(() => {
			if (oilstat === 200) {
				this.setState({
					videoOnDemandJsOptions: {
						autoplay: false,
						controls: true,
						width:700,
						sources: [
						  {
							src: `https://${awsvideoconfig.awsOutputVideo}/${this.state.filename.split('.')[0]}_output/${this.state.filename.split('.')[0]}_output.m3u8`, 
						  }, 
						], 
					},
					viewVideoForm: true
				})
				console.log("Video stream conversion completed!");
				this.status.current.onGettingStatus('All process completed!');
			}	
			else {
				this.setState({
					viewTextForm: true
				})
				console.log("Server Error!");
				console.log((oilprediction));
				this.output.current.onGettingPred(`Server Error!`);
			}
		},30000)
	};

	onDrillFormSubmit = async () => {
		var t0 = performance.now()
		const drillresponse = await fetch (`${API_URL}/drill`, {
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': "*"
			},
			method: "POST",
			body: JSON.stringify({
				filename: this.state.filename,
				service: "drill-bit",
			}),
		});
		const drillprediction = await drillresponse.text();
		const drillstat = await drillresponse.status;
		console.log(this.state.filename)
		console.log(drillstat)
		if (drillstat === 200) {
			this.setState({
				viewTextForm: true
			})
			console.log("Video Processing Completed!");
			console.log((drillprediction));
			this.output.current.onGettingPred(`Anomaly Detected: ${drillprediction}`);
			this.status.current.onGettingStatus('Video stream conversion in process. Video will be displayed in 2 minutes.');
			var t1 = performance.now()
			console.log("Drill-bit prediction took " + (t1 - t0) + " milliseconds.")
		}
		else {
			this.setState({
				viewTextForm: true
			})
			console.log("Server Error!");
			console.log((drillprediction));
			this.output.current.onGettingPred(`Server Error!`);
		}
		setTimeout(() => {
			if (drillstat !== 500) {
				this.setState({
					videoOnDemandJsOptions: {
						autoplay: false,
						controls: true,
						width:700,
						sources: [
						  {
							src: `https://${awsvideoconfig.awsOutputVideo}/${this.state.filename.split('.')[0]}_output/${this.state.filename.split('.')[0]}_output.m3u8`, 
						  }, 
						], 
					},
					viewVideoForm: true
				})
				console.log("Video stream conversion completed!");
				this.status.current.onGettingStatus('All process completed!');
			}	
			else {
				this.setState({
					viewForm: true
				})
				console.log("Server Error!");
				console.log((drillprediction));
				this.output.current.onGettingPred(`Server Error!`);
			}	
		}, 30000)
	};

	render() {
		return (
			<div className="ui container">
				<div className="sixteen wide column" style={{marginTop:"20px"}}>
					<h1> Anomaly Detection: </h1>
				</div>
				<input type='file' onChange={this.handleChange} style={{marginTop:"20px"}}/>
                <button className='upload' onClick={this.saveFile}>Upload Video</button>
				<button className='predict-leak' onClick={this.onOilFormSubmit} style={{marginLeft:"20px"}}>Leak</button>
				<button className='predict-drill' onClick={this.onDrillFormSubmit} style={{marginLeft:"20px"}}>Drill-bit</button>
				<div className="output video player" style={{marginTop:"20px"}}> 
					{(this.state.viewVideoForm) ? <VideoPlayer {...this.state.videoOnDemandJsOptions} /> : null}						
	 			</div>
				<div className="output" style={{marginTop:"20px"}}>
					{(this.state.viewTextForm) ? <Output ref={this.output}/> : null}
				</div>
				<div className="output" style={{marginTop:"20px"}}>
					<Status ref={this.status}/>
				</div>
			</div>		
		);
	}	
}

export default App;