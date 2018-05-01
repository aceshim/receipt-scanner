import React, { Component } from 'react';
import { ActionSheetIOS, TouchableHighlight, ScrollView, View, Text, StyleSheet } from 'react-native';
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
      size: 36
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
      selectAll: false,
      searchTerm: '',
    }
    this._unselectAll = this._unselectAll.bind(this);
    this._onChangeSearchTerm = this._onChangeSearchTerm.bind(this);

  }

  _onSelectCategory(index){
    const { selected } = this.state;
    selected[index] = !selected[index];
    this.setState({
      selected: selected,
    })
  }

  _selectAll(){
    var { selected, selectAll } = this.state;
    for (i = 0; i < selected.length; i++){
      selected[i] = true;
    }
    this.setState({
      selected: selected,
      selectAll: false,
    })
  }
  _unselectAll(){
    var { selected, selectAll } = this.state;
    for (i = 0; i < selected.length; i++){
      selected[i] = false;
    }
    this.setState({
      selected: selected,
      selectAll: true,
    })
  }
  _onPressEdit(item){
    this.props.navigation.navigate('Add', {item: item});
  }
  _onChangeSearchTerm(searchTerm){
    this.setState({
      searchTerm: searchTerm,
    })
    this.forceUpdate()
  }

  _cameraPressed(){
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Take Picture', 'Use Picture From Library', 'Manually Enter'],
      // destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      if (buttonIndex === 1) {
        console.log("Take Picture")
        this.props.navigation.navigate('Add');
      } else if (buttonIndex === 2){
        console.log("Use Library")
        this.props.navigation.navigate('Add');
      } else if (buttonIndex === 3){
        console.log("Manually Enter")
        this.props.navigation.navigate('Add');
      }
    });
  }

  _toReadableDate(date){
    return date.toISOString().slice(0,10);
  }

  render(){

    const cameraButton = <View style={styles.cameraButton}>
      <Icon
        raised
        reverse
        name='plus'
        type='material-community'
        color='#FF5252'
        size={24}
        onPress={() => this._cameraPressed()}
        />
    </View>


    console.log(this.props.navigation.state.params);

    const { params } = this.props.navigation.state;

    if (params){
      if (params.add && !params.data.index){
        data.push({
          company: params.data.company,
          balance: '$'+params.data.amount.replace('$',''),
          category: params.data.selectedCategory ,
          registered: this._toReadableDate(params.data.chosenDate),
          comment: params.data.comment,
          index: data.length + 1,
        })
      } else if (params.add) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].index === params.data.index) {
            data[i] = {
              company: params.data.company,
              balance: '$'+params.data.amount.replace('$',''),
              category: params.data.selectedCategory ,
              registered: this._toReadableDate(params.data.chosenDate),
              comment: params.data.comment,
              index: data.length + 1,
            };
          }
        }
      }
      else if (params.remove){
        delete data[index]
      }
    }


    return (
      <View style={styles.container}>
        <Header backgroundColor='white'
          statusBarProps={{ barStyle: 'dark-content' }}
          centerComponent={{ text: 'Receipt List', style:{marginLeft:70,fontSize: 22, fontWeight: '300'}}}
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
                  onPress={()=>this._onSelectCategory(i)}
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
                    data.slice(0).reverse().map((l, i) => (
                        this.state.selected[Object.keys(category).indexOf(l.category)]
                        && (l.company.toLowerCase().indexOf(this.state.searchTerm.toLowerCase())>=0 || !this.state.searchTerm)?
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
                              color="#888"
                              onPress={()=>this._onPressEdit(l)}/>
                          }

                        />:null
                    ))
                  }
            </ScrollView>
        </View>
        {cameraButton}
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
    paddingTop: 10,
    width: window.width*0.25,
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
  },
  cameraButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  }
})
