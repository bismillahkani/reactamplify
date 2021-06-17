import React from 'react';

class Display extends React.Component {
	state = {output: "Waiting"};
	
	onGettingPred = res => {
		this.setState({output:res});
	}
	render(){
		return (
			<div className='ui segment'>
				<h3>{this.state.output}</h3>
			</div>
		)
	}
}
export default Display