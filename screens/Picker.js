import React, { Component } from 'react';
import { PickerIOS, Animated, StyleSheet, View, TouchableHighlight, Text, } from 'react-native';

import category from "./HomeScreen";

let PickerItemIOS = PickerIOS.item;

export default class Picker extends React.Component{

  componentDidMount(){
    Animated.timing(this.props.offSet, {
          duration: 300,
          toValue: 100
        }).start()
  }

  _closeModal(p){
    // console.log(p);
  }

  render(){
    const { catList } = this.props;
    console.log(catList);
    return (
      <Animated.View style={{ transform: [{translateY: this.props.offSet}] }}>
          <View style={styles.closeButtonContainer}>
            <TouchableHighlight onPress={ this._closeModal(this.props) } underlayColor="transparent" style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Choose</Text>
            </TouchableHighlight>
          </View>
          <PickerIOS
            selectedValue={this.props.category}
            onValueChange={(selected) => this.props.changeCategory(selected)}>
            <PickerItemIOS
              key={"Default"}
              value={"Default"}
              label={"Default"}
              />
          </PickerIOS>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  closeButtonContainer: {
   flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopColor: '#e2e2e2',
    borderTopWidth: 1,
  },
  closeButton: {
    paddingRight:10,
    paddingTop:10,
  },
  buttonText: {
   textAlign: 'center'
  },
  closeButtonText: {
   color: '#027afe'
  },
})
