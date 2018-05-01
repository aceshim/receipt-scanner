import React from 'react';
import { ActionSheetIOS, TouchableHighlight, Picker, Keyboard, StatusBar, ScrollView, DatePickerIOS, StyleSheet, Text, View, Image, KeyboardAvoidingView } from 'react-native';
import { Header, Input, Icon, Card, ListItem, Button } from 'react-native-elements';
import {
  StackNavigator,
} from 'react-navigation';

const Dimensions = require('Dimensions');
const window = Dimensions.get('window');
// import Picker from './Picker';

export default class EditPage extends React.Component {
  static navigationOptions = {
    title: 'Edit',
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      chosenDate: new Date(),
      delete: false,
      selectedCategory: 'Default',
      datePickerVisible: false,
      company: '',
      amount: '',
      comment: '',
      category: 'Default',
      loaded: false,
    };

    this._setDate = this._setDate.bind(this);
    this._onPressDelete = this._onPressDelete.bind(this);
    this._onPressCancel = this._onPressCancel.bind(this);
    this._onPressConfirm = this._onPressConfirm.bind(this);
    this._changeCategory = this._changeCategory.bind(this);
    this._closeModal = this._closeModal.bind(this);
  }

  componentDidMount(){

  }
  componentWillMount(){

  }
  _toReadableDate(date){
    return date.toISOString().slice(0,10);
  }

  _setDate(newDate) {
    console.log(this._toReadableDate(newDate))
    this.setState({chosenDate: newDate})
  }

  _onPressDelete(){
    this.setState({
      delete: true,
    })
  }

  _onPressCancel(){
    this.setState({
      delete: false,
    })
  }

  _submitCompanyEditing(){
    this.state.company?
      this.setState({errorCompany: false})
      :this.setState({errorCompany:true});
  }

  _submitAmountEditing(){
    this.state.amount?
      this.setState({errorAmount: false})
      :this.setState({errorAmount:true});
  }

  _submitDateEditing(){
    this.state.date?
      this.setState({errorDate: false})
      :this.setState({errorDate:true});
  }

  _onPressConfirm(){
    this._submitDateEditing();
    this._submitAmountEditing();
    this._submitCompanyEditing();
    var { errorCompany, errorDate, errorAmount } = this.state;
    if (!errorCompany && !errorAmount){
      this.props.navigation.navigate('List', {add:true, data: this.state})
    }
  }

  _onPressConfirmDelete(){
    console.log(this.props.navigation)
    this.props.navigation.navigate('List', {remove:true, data: this.state})
  }

  _selectDate(){
    Keyboard.dismiss();
    this.setState({
      datePickerVisible: true,
      catListVisibile: false,
    })
  }
  _selectCategory(){
    Keyboard.dismiss();
    this.setState({
      catListVisibile: true,
      datePickerVisible: false,
    })
  }

  _changeCategory(category){
    this.setState({
      selectedCategory: category,
    })
  }

  _closeModal(){
    this.setState({
      datePickerVisible: false,
      catListVisibile: false,
    })
  }

  _goBack(){
    Keyboard.dismiss();
    this.props.navigation.goBack();
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


  render() {
    if (this.props.navigation.state.params){
      const item = this.props.navigation.state.params.item;
      if (!this.state.loaded){
        this.setState({
          company: item.company,
          amount: item.balance,
          comment: item.comment,
          selectedCategory: item.category,
          index: item.index,
          loaded: true,
        })
      }
    }
    const cameraButton =
      <View style={styles.cameraButton}>
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
    return (
      <View behavior="padding" style={styles.container}>
        <Header backgroundColor='white'
          statusBarProps={{ barStyle: 'dark-content' }}
          leftComponent={
            <Icon
              name='arrow-left'
              color='#333'
              type='material-community'
              size={28}
              onPress={()=>this._goBack()}
              />
          }
          centerComponent={{ text: 'Add / Edit Transaction', style:{fontSize: 22, fontWeight: '300'}}}
          outerContainerStyles={{width: window.width, marginBottom: 0, borderBottomColor: '#bbb', borderBottomWidth:0.4, paddingBottom:5}}
          rightComponent={{ icon: 'home', color: 'black', size: 28 }}
        />
        <Input
          leftIcon={
            <View style={styles.leftIconWrapper}>
              <View style={styles.leftIconContainer}>
                <Icon
                name='building'
                size={18}
                color='orange'
                type='font-awesome'
                />
              </View>

            <Text style={styles.leftIconText}>Merchant</Text>
            </View>
          }
          inputStyle={styles.inputStyle}
          inputContainerStyle={styles.inputContainerStyle}
          placeholder='E.g. Walmart'
          defaultValue={this.state.company}
          onChangeText={(text)=>this.setState({company:text})}
          onEndEditing={()=>this._submitCompanyEditing()}
          onFocus={this._closeModal}/>
          {this.state.errorCompany?
            <Text style={styles.errorText}>
              Cannot be blank
            </Text>: null}
          <Input
            leftIcon={
              <View style={styles.leftIconWrapper}>
                <View style={styles.leftIconContainer}>
                  <Icon
                  name='usd'
                  size={18}
                  color='red'
                  type='font-awesome'
                  />
                </View>
              <Text style={styles.leftIconText}>Amount</Text>
              </View>
            }
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            keyboardType='numeric'
            placeholder='$10.00'
            defaultValue={this.state.amount}
            onChangeText={(text)=>this.setState({amount:text})}
            onEndEditing={()=>this._submitAmountEditing()}
            onFocus={this._closeModal}/>
          {this.state.errorAmount?
            <Text style={styles.errorText}>
              Cannot be blank
            </Text>: null}
          <Input
            leftIcon={
              <View style={styles.leftIconWrapper}>
                <View style={styles.leftIconContainer}>
                  <Icon
                  name='calendar'
                  size={18}
                  color='blue'
                  type='font-awesome'
                  />
                </View>
              <Text style={styles.leftIconText}>Date</Text>
              </View>
            }
            keyboardType='numeric'
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            defaultValue={this._toReadableDate(this.state.chosenDate)}
            onFocus={()=>this._selectDate()}/>
          <Input
            leftIcon={
              <View style={styles.leftIconWrapper}>
                <View style={styles.leftIconContainer}>
                  <Icon
                  name='bars'
                  size={18}
                  color='green'
                  type='font-awesome'
                  />
                </View>
              <Text style={styles.leftIconText}>Category</Text>
              </View>
            }
            keyboardType='numeric'
            defaultValue={this.state.selectedCategory}
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            placeholder='Uncategorized'
            onFocus={()=>this._selectCategory()}
            />
          <Input
            leftIcon={
              <View style={styles.leftIconWrapper}>
                <View style={styles.leftIconContainer}>
                  <Icon
                  name='comment'
                  size={18}
                  color='purple'
                  type='font-awesome'
                  />
                </View>
              <Text style={styles.leftIconText}>Comment</Text>
              </View>
            }
            inputStyle={styles.inputStyle}
            inputContainerStyle={styles.inputContainerStyle}
            defaultValue={this.state.comment}
            placeholder='Your comment here'
            onFocus={this._closeModal}
            onChangeText={(text)=>this.setState({comment:text})}
            />
          {this.state.delete?
            <View>
              <View style={styles.buttonContainer}>
                <Button
                  onPress={this._onPressCancel}
                  icon={<Icon name='close' color='#888'/>}
                  buttonStyle={styles.deleteCancelButton}
                  title='Cancel'
                  titleStyle={{color:'#888'}} />
                <Button
                  onPress={this._onPressConfirmDelete}
                  icon={<Icon name='delete' color='white'/>}
                  buttonStyle={styles.confirmDeleteButton}
                  title='CONFIRM' />
              </View>
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertText}>Are you sure?</Text>
                <Text style={styles.alertText}>The data cannot be restored</Text>
              </View>
            </View>:
            <View style={styles.buttonContainer}>
            <Button
              onPress={this._onPressDelete}
              icon={<Icon name='delete' color='white'/>}
              buttonStyle={styles.deleteButton}
              title='DELETE' />
            <Button
              onPress={this._onPressConfirm}
              icon={<Icon name='check' color='white'/>}
              buttonStyle={styles.confirmButton}
              title='CONFIRM' />
            </View>
          }
          <View style={{width: window.width}}>
          {this.state.catListVisibile?
            <View style={styles.catList}>
              <View style={styles.closeButtonContainer}>
                <TouchableHighlight onPress={ ()=> this.setState({catListVisibile: false}) } underlayColor="transparent" style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Done</Text>
                </TouchableHighlight>
              </View>
              <Picker
                selectedValue={this.state.selectedCategory}
                style={{ height: 50, width: window.width }}
                onValueChange={(itemValue, itemIndex) => this.setState({selectedCategory: itemValue})}>
                {Object.keys(category).map((entry, key)=> (
                  <Picker.Item key={key} label={entry} value={entry}/>
                ))}
              </Picker>
            </View>
            : null}
          {this.state.datePickerVisible?
            <View style={styles.catList}>
              <View style={styles.closeButtonContainer}>
                <TouchableHighlight onPress={ ()=> this.setState({datePickerVisible: false}) } underlayColor="transparent" style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Done</Text>
                </TouchableHighlight>
              </View>
              <DatePickerIOS
              date={this.state.chosenDate}
              onDateChange={this._setDate}
              />
            </View>:null
          }
          </View>
          {cameraButton}
      </View>
    );
  }
}

const items = ['Item 1', 'Item 2'];

export const category = {
  Default: {
    title: "Uncategorized",
    icon: {
      name: 'file',
      color: 'black',
      type:'octicon',
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  cardContainer:{
    width: window.width * 0.8,
    borderBottomWidth: 0,
  },
  inputContainerStyle:{
    width: window.width,
    marginLeft: -20,
    borderColor: '#eee',
    borderBottomWidth: 1,
    // backgroundColor:'red',
  },
  inputStyle:{
    textAlign: 'right',
    marginRight: 20,
    marginVertical: 10,
    // backgroundColor: 'green',
  },
  leftIconWrapper:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIconContainer:{
    width: 18,
  },
  leftIconText:{
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '200',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  confirmButton: {
    width: window.width*0.4, borderRadius: 10, margin: 20
  },
  deleteButton: {
    width: window.width*0.4, borderRadius: 10, margin: 20,
    backgroundColor: 'rgba(216, 19, 19, 1)'
  },
  alertTextContainer:{
    alignItems: 'center',
  },
  alertText:{
    color:'red',
  },
  confirmDeleteButton: {
    width: window.width*0.4, borderRadius: 10, margin: 20,
    backgroundColor: 'rgba(216, 19, 19, 1)'
  },
  deleteCancelButton: {
    width: window.width*0.4, borderRadius: 10, margin: 20,
    borderColor: '#888', borderWidth: 1,
    backgroundColor: 'transparent',
  },
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
   color: '#027afe',
   fontSize: 18,
  },
  errorText: {
    alignSelf:'flex-end',
    color:'red',
    marginRight: 20,
  },
  cameraButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  }
});
