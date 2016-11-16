/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

'use strict'
import React, { Component } from 'react';
import { View } from 'react-native';
import { requireNativeComponent } from 'react-native';

class TWTView extends Component {
  setNativeProps(props){
    this.root.setNativeProps(props);
  }
  render() {
    return (
      <TWTViewNative
        {...this.props}
        style={[
          {backgroundColor: 'transparent'},
          this.props.style,
        ]} 
        ref={(r)=>{this.root = r}}
      />
    );
  }
}

TWTView.propTypes = {
};

const TWTViewNative = requireNativeComponent('RCTTWTView', TWTView);

export default TWTView;
