import React from 'react';

class Status extends React.Component {
	state = {status: "Status: Waiting..."};
	
	onGettingStatus = res => {
		this.setState({status:res});
	}
	render(){
		return (
			<div className='ui segment'>
				<h3>{this.state.status}</h3>
			</div>
		)
	}
}
export default Status