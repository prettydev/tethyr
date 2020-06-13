import React from 'react';

class StaticTwitch extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
            url : this.props.url
        };
      }

    componentDidMount() {
        setTimeout(() => {
            this.props.onEnded();
        }, 5000);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.url !== this.state.url) {
           this.setState({
               url : nextProps.url
           }, () => {
            setTimeout(() => {
                this.props.onEnded();
            }, 5000);
           })
       }
    }

    render() {
        return (
            <img src={this.props.url} style={{width : '100%', height : "100%"}} alt="twitch component" />
        );
    }
}

export default StaticTwitch;
