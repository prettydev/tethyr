import React from 'react';
import images from '../../constants/images';

class Timer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timerStopped: false,
			duration: 0
		}
	}

	componentDidMount() {
		const { duration } = this.props
		this.setState({
			duration: duration * 1000
		})

		setInterval(() => {
			if (!this.state.timerStopped) {
				this.setState({
					duration: this.state.duration - 40
				})
				if (this.state.duration - 100 <= 0) {
					if (this.props.onTimeout) {
						this.setState({
							timerStopped: true
						})
						this.props.onTimeout()
					}
				}
			}
		}, 40)
	}

	componentDidUpdate(prevProps) {
		let { timerStopped: prevTimer } = prevProps
		let { timerStopped: nextTimer } = this.props

		if (isNaN(this.state.duration) && !isNaN(this.props.duration)) {
			this.setState({
				duration: this.props.duration
			})
		}

		if (prevTimer !== nextTimer) {
			const duration = nextTimer
				? Math.min(
					this.state.duration + this.props.duration * 1000 * 0.2,
					this.props.duration * 1000
				)
				: this.state.duration
			this.setState({
				duration,
				timerStopped: nextTimer
			})
		}
	}

	render() {
		const { duration: propDuration } = this.props
		const { duration } = this.state
		const timePercent = 100 -(duration / 1000 / propDuration) * 100
		const timerStyle = {
			position: 'absolute',
			backgroundImage: `url("${images.adCube.timer}")`,
			backgroundRepeat: 'no-repeat',
			top: `${timePercent}%`,
			height: `${100 - timePercent}%`,
			backgroundPositionY: `-${(timePercent) / 100 * 144}px`,
			right: 0,
		}
		return (
			<div
				className="Tim"
				style={timerStyle}
			/>
		)
	}
}

export default Timer
