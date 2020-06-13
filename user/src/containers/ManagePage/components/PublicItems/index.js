import React, { Component } from 'react';
import { connect } from 'react-redux';
import GroupLists from './components/GroupLists/index'

class PublicItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value : props.findStuff.screen,
    };
  }
  
  componentDidUpdate() {
    if(this.state.value !== this.props.findStuff.screen) {
      this.setState({
        value: this.props.findStuff.screen,
      })
    }
  }

  handleChange = event => {
    this.setState({
      value : event.target.value,
    })
  };

  render() {
    const {value} = this.state;
    return (
      <GroupLists
        value = {value}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    findStuff: state.findStuff,
  }
}

export default connect(mapStateToProps)(PublicItems);