import React, { Component } from 'react';
import { TouchableHighlight, ScrollView, View, Text, StyleSheet } from 'react-native';
import { Input, ListItem, Header, Icon, Button } from 'react-native-elements';

import data from '../data/data.json';

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');

export const category = {
  Default: {
    title: "Uncategorized",
    icon: {
      name: 'question',
      color: 'black',
      type:'font-awesome',
    }
  },
  Travel: {
    title: "Travel",
    icon: {
      name: 'plane',
      color: 'blue',
      type:'font-awesome',
    }
  },
  Entertainment: {
    title: "Entertainment",
    icon: {
      name: 'headphones',
      color: 'orange',
      type:'font-awesome',
    }
  },
  Grocery: {
    title: "Grocery",
    icon: {
      name: 'shopping-cart',
      color: 'green',
      type:'font-awesome',
    }
  },
  Dining: {
    title: "Dining",
    icon: {
      name: 'food',
      color: 'red',
      type:'material-community',
    }
  },
  Transport: {
    title: "Auto & Transport",
    icon: {
      name: 'car-side',
      color: 'purple',
      type:'material-community',
    }
  },
  Housing: {
    title: "Housing & Bills",
    icon: {
      name: 'home',
      color: 'navy',
      type:'material-community',
    }
  }
}

export default class ReceiptList extends Component{
  constructor(props){
    super(props);
    this.state={
      selected: [true, true, true, true, true, true, true, true],
      selectAll: true,
      searchTerm: '',
    }
    this._unselectAll = this._unselectAll.bind(this);

  }
  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  _onSelectCategroy(index){
    const { selected } = this.state;
    selected[index] = !selected[index];
    this.setState={
      selected: selected,
    }
    this.forceUpdate();
  }

  _selectAll(){
    console.log('select all')
    var { selected, selectAll } = this.state;
    for (i = 0; i < selected.length; i++){
      selected[i] = true;
    }
    var temp = true;
    this.setState={
      selected: selected,
    }
    this.setState={
      selectAll: false,
    }
    this.forceUpdate();
    console.log(this.state);
  }
  _unselectAll(){
    console.log('unselect all')

    var { selected, selectAll } = this.state;
    for (i = 0; i < selected.length; i++){
      selected[i] = false;
    }
    var temp = true;
    this.setState={
      selected: selected,
    }
    this.setState={
      selectAll: true,
    }
    this.forceUpdate();
    console.log(this.state);
  }
  _onPressEdit(item){
    console.log('here');
    console.log(item);
  }
  _onChangeSearchTerm(searchTerm){
    console.log('changed')
    this.setState({
      searchTerm: searchTerm,
    })
    this.forceUpdate()
  }

  render(){

    return (
      <View style={styles.container}>
        <Header backgroundColor='white'
          statusBarProps={{ barStyle: 'dark-content' }}
          centerComponent={{ text: 'Receipt List', style:{marginLeft:40,fontSize: 22, fontWeight: '300'}}}
          outerContainerStyles={styles.headerContainer}
          rightComponent={
            this.state.selectAll?
            <TouchableHighlight
              style={styles.selectAllTouch}
              onPress={()=>this._selectAll()}>
              <Text style={styles.selectAll}>Select All</Text>
            </TouchableHighlight>:
            <TouchableHighlight
              style={styles.selectAllTouch}
              onPress={()=>this._unselectAll()}>
              <Text style={styles.selectAll}>Unselect All</Text>
            </TouchableHighlight>
          }
        />
        <View style={styles.bodyContainer}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} contentContainerStyle={{backgroundColor: 'white', flexGrow: 1, alignItems: 'center'}}>
              {
                Object.keys(category).map((l, i)=>(
                <Icon
                  raised
                  reverse={this.state.selected[i]}
                  name={category[l].icon.name}
                  type={category[l].icon.type}
                  color={category[l].icon.color}
                  onPress={()=>this._onSelectCategroy(i)}
                  key={i}
                  />
              ))}
            </ScrollView>
            <ScrollView contentOffset={{x:0, y:45}} style={styles.listContainer}>
              <Input
                placeholder='Keyword'
                leftIcon={
                  <Icon
                    name='search'
                    size={24}
                    color='#ccc'
                  />
                }
                containerStyle={styles.searchInputContainer}
                inputContainerStyle={styles.searchInput}
                inputStyle={styles.searchInputText}
                clearButtonMode='always'
                onChangeText={(text)=>this._onChangeSearchTerm(text)}
              />
                  {
                    data.map((l, i) => (
                      console.log(this.state.searchTerm),
                        this.state.selected[Object.keys(category).indexOf(l.category)]
                        && (l.company.toLowerCase().indexOf(this.state.searchTerm.toLowerCase())>=0)?
                        <ListItem
                          leftIcon={l.category?category[l.category].icon:category["Default"].icon}
                          key={i}
                          title={l.company}
                          titleNumberOfLines={1}
                          containerStyle={styles.listItem}
                          subtitle={l.balance + '\n'+l.registered}
                          subtitleNumberOfLines={2}
                          subtitleStyle={{color:'#888', fontSize:14, paddingTop: 5}}
                          rightIcon={
                            <Icon
                              name="edit"
                              color="#888"/>
                          }
                          onPressRightIcon={()=>this._onPressEdit(l)}
                        />:null
                    ))
                  }
            </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer:{
    flex: 1,
    flexDirection: 'row',
    marginBottom: 0,
    borderBottomColor: '#bbb',
    borderBottomWidth:0.5,
    paddingBottom:5
  },
  bodyContainer:{
    flex: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  catListContainer:{
    flexDirection:'row',
    backgroundColor:'green',
    justifyContent: 'center',
    width: window.width,
  },
  listContainer:{
    width: window.width,
    height: window.height*0.7,
  },
  listItem:{
    borderTopWidth: 1,
    borderTopColor: '#bbb',
  },
  selectAll:{
    alignSelf: 'flex-end',
    marginRight: 5,
    color: '#027afe',
  },
  selectAllTouch:{
    // backgroundColor:'red',
    paddingTop: 10,
  },
  searchInputContainer:{
    alignSelf: 'center',
    borderRadius: 10,
    width: window.width*0.95,
    backgroundColor: '#eee',
    margin: 5,
  },
  searchInput:{
    borderBottomWidth: 0,
  },
  searchInputText:{
    fontSize: 16,
  }
})
