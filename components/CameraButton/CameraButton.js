import React, { Component } from 'react';
import { View, StyleSheet, ActionSheetIOS } from 'react-native';
import { Icon } from 'react-native-elements';
import Exponent, { Constants, ImagePicker, Permissions, registerRootComponent } from 'expo';


export default class CameraButton extends Component{
  state = {
    image: null,
    uploading: false,
    totalAmount: 0,
    merchantName: '',
    response: {},
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  _onPress(){
    ActionSheetIOS.showActionSheetWithOptions({
      options: ['Cancel', 'Take Picture', 'Use Picture From Library', 'Manually Enter'],
      // destructiveButtonIndex: 1,
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      if (buttonIndex === 1) {
        console.log("Take Picture")
      } else if (buttonIndex === 2){
        console.log("Use Library")
      }
    });
  }
  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      // allowsEditing: true,
      // aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  }
  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      // allowsEditing: true,
      // aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  }
  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;

    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
        console.log(uploadResult);
        if (uploadResult.totalAmount.confidenceLevel > 0) this.setState({ totalAmount: uploadResult.totalAmount.data })
        if (uploadResult.merchantName.confidenceLevel > 0) this.setState({ merchantName: uploadResult.merchantName.data })
        this.setState({ image: pickerResult.uri , response: uploadResult});
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  }
  render(){
    return (
      <View style={styles.cameraButton}>
        <Icon
          raised
          reverse
          name='camera'
          type='font-awesome'
          color='#FF5252'
          onPress={() => this._onPress()}
          />
      </View>
    )
  }
}

async function uploadImageAsync(uri) {
  const apiUrl = 'https://api.taggun.io/api/receipt/v1/simple/file';
  // const apiUrl = 'https://api.taggun.io/api/account/v1/merchantname/add';
  const apikey = '19a593303c4d11e89ba52979e39c3e3c';

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData();
  formData.append('file', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });
  // formData.append(
  //   'merchantName', 'Walmart'
  // )

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      // 'Content-Type': 'application/json',
      'apikey': apikey,
    },
  };

  return fetch(apiUrl, options);
}

const styles = StyleSheet.create({
  cameraButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  }
})
