import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class ReceiptList extends Component{
  render(){
    return (
      <View style={styles.container}>
        <Text>Start from here </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
