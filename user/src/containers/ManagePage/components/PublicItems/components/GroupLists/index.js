import React, { Component } from 'react';
import Public from '../Public';
import Shared from '../Shared';
import Sale from '../Sale'

class GroupLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value : props.value,
    };
  }

  componentDidUpdate() {
    if(this.props.value !== this.state.value) {
      this.setState({
        value : this.props.value,
      })
    }
  }

  render() {
    const { value } = this.state;
    if(value === 'public') {
      return(
        <Public />
      )
    }
    else if(value === 'promoted') {
      return(
        <Shared />
      )
    }
    else if(value === 'sale') {
      return(
        <Sale />
      )
    }
    else {
      return null;
    }
  }
};

export default GroupLists;