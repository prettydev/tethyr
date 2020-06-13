import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
} from '../../actions/ads';

import './styles.css';

class APIGenerator extends Component {
  render() {
    return (
      <div className="gridsets-page">
        <h1>Twitch</h1>
        <div className="separator"></div>
        <button>Check the Twitch Access Key Validate</button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(null, mapDispatchToProps)(APIGenerator);
