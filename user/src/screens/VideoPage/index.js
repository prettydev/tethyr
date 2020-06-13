import React, { Component } from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux'
import {isMobile} from 'react-device-detect';

import G8 from '../G8';
import G6 from '../G6';
import G4 from '../G4';
import M4 from '../M4';
import G4pro from '../G4pro';
import G4c1 from '../G4c1';
import G3c1 from '../G3c1';
import G2 from '../G2';
import G2c1 from '../G2c1';
import G1 from '../G1';
import M1 from '../M1';

import OverlaySpinner from '../../components/OverlaySpinner'

class VideoPage extends Component {
  _isMounted = false;
  constructor() {
    super();

    this.state = {
      layout: 'G4',
      gridSelect: 0,
      textSize : 'medium',
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if(isMobile && this._isMounted)
    {
      this.setState({layout: 'M1'});
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLayoutSelect = (layout) => {
    this.setState({ layout });
  }
  
  selectGridset = (value)=> {
    this.setState({
      gridSelect : value,
    })
  }

  handleTextSizeChange = (val) => {
//    this.addLog("Set Text size as " + val);
    const node = ReactDOM.findDOMNode(this);
    // Get child nodes
    let playlist = null;
    if (node instanceof HTMLElement) {
      playlist = node.querySelector('#playlist');
      console.log('playlist', playlist)
      playlist.className = 'playlist';
      if(playlist != null)
      {

        // if(val == 'small')
        // {
        //   playlist.classList.add('small');
        // }
        // else if(val == 'medium')
        // {
        //   playlist.classList.add('medium');
        // }
        // else if(val == 'large')
        // {
        //   playlist.classList.add('large');
        // }

      }
    }
    this.setState( {textSize: val} );
  }

  render() {
    
    const { layout, gridSelect, textSize } = this.state;
    const { overlaySpinner  } = this.props;
    if (layout === 'M1'){
      return (
        <div>
          <M1 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    }
    else if (layout === 'G8') {
      return (
        <div>
          <G8 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    } 
    else if (layout === 'G6') {
      return (
        <div>
          <G6 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    } 
    else if (layout === 'G4') {
      return (
        <div>
          <G4 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    } 
    else if (layout === 'M4') {
      return (
        <div>
          <M4 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    } 
    else if (layout === 'G4pro') {
      return (
        <div>
          <G4pro onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
              <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    } 
    else if (layout === 'G4c1') {
      return (
        <div>
          <G4c1 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    } 
    else if (layout === 'G3c1') {
      return (
        <div>
          <G3c1 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    } 
    else if (layout === 'G2c1') {
      return (
        <div>
          <G2c1 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    }
    else if (layout === 'G2') {
      return (
        <div>
          <G2 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    }
    else{
      return (
        <div>
          <G1 onLayoutSelect={this.onLayoutSelect} textSize={textSize} handleTextSizeChange={this.handleTextSizeChange} user={gridSelect} selectGridset={this.selectGridset.bind(this)} />
          {overlaySpinner.visible && (
            <OverlaySpinner visible={ overlaySpinner.visible } />
          )}
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return {
    overlaySpinner: state.overlaySpinner,
  }
}

export default connect(mapStateToProps, null)(VideoPage);
