/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

var ScreenWidth = Dimensions.get('window').width;
var ScreenHeight = Dimensions.get('window').height;

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

import TWTView from './TWTView.js';
var TwitterLogin = NativeModules.TwitterLogin;
const twLoginCB = new NativeEventEmitter(TwitterLogin);
var GoogleLogin = NativeModules.GoogleLogin;
const glLoginCB = new NativeEventEmitter(GoogleLogin);
// var GoogleVC = NativeModules.GoogleVC;
// console.log("1111", GoogleVC);

export default class Jicheng8 extends Component {
  constructor(props){
    super(props);
    this.infoRequest = new GraphRequest('/me?fields=age_range,id,email,name,link', null, this._responseInfoCallback.bind(this));
    this.state = {
      fbName: '',
      fbEmail: '',
      twName: '',
      twEmail: '',
      isWaiting: false,
      twLoginStatus: false,
      twIcon: null,
      glName: '',
      glEmail: '',
      glLoginStatus: false,
    };
  }
  componentDidMount() {
    // this.PressToken();
    this.twListener = twLoginCB.addListener('twlCallback', this.twlCallback.bind(this));
    this.glListener = glLoginCB.addListener('gglCallback', this.gglCallback.bind(this));
  }
  componentWillUnmount() {
    this.twListener && this.twListener.remove();
    this.twListener = null; 
    this.glListener && this.glListener.remove();
    this.glListener = null;
  }
  twlCallback(data){
    if (data.code == TwitterLogin.CB_CODE_ERROR){
      var ret = JSON.parse(data.result);
      if (ret.id == TwitterLogin.ERROR_LOGIN){
        alert('登录失败：' + ret.dsc);
      }else if (ret.id == TwitterLogin.ERROR_EXPIRED){
        console.log('验证有效期失败：' + ret.dsc);
        this.LoginTwitter();
      }else if (ret.id == TwitterLogin.ERROR_GETINFO){
        alert('获取信息失败：' + ret.dsc);
      }else if (ret.id == TwitterLogin.ERROR_NOTLOGIN){
        console.log('你还未登录呢！');
        this.LoginTwitter();
      }else {
        alert("未知错误！");
      }
    }else if (data.code == TwitterLogin.CB_CODE_LOGIN){
      var ret = JSON.parse(data.result);
      console.log('登录成功：' + ret.userName + '!');
      this.GetInfoTwitter();
    }else if (data.code == TwitterLogin.CB_CODE_LOGOUT){
      var ret = JSON.parse(data.result);
      this.setState({
        twName: '',
        twLoginStatus: false,
        twIcon: null,
      });
      alert('登出成功：' + ret.userID);
    }else if (data.code == TwitterLogin.CB_CODE_EXPIRED){
      if (data.result == TwitterLogin.EXPIRED_OUT){
        console.log('登录已经过期');
        this.LoginTwitter();
      }else {
        console.log('登录成功！');
        this.GetInfoTwitter();
      }
    }else if (data.code == TwitterLogin.CB_CODE_GETINFO){
      var ret = JSON.parse(data.result);
      console.log(ret);
      this.setState({
        twName: ret.name,
        twLoginStatus: true,
        twIcon: ret.profile_image_url,
      });
      alert('欢迎回来，' + ret.name + '!');
    }
  }
  gglCallback(data){
    if (data.code == GoogleLogin.CB_CODE_ERROR){
      var ret = JSON.parse(data.result);
      if (ret.id == GoogleLogin.ERROR_LOGIN){
        alert('登录失败：' + ret.dsc);
      }else if (ret.id == GoogleLogin.ERROR_DISCONNECT){
        alert('断开连接失败：' + ret.dsc);
      }else {
        alert("未知错误！");
      }
    }else if (data.code == GoogleLogin.CB_CODE_LOGIN){
      var ret = JSON.parse(data.result);
      console.log('登录成功：' + ret.fullName + '!');
      this.setState({
        glName: ret.fullName,
        glEmail: ret.email,
        glLoginStatus: true
      });
      alert('欢迎回来，' + ret.fullName + '!');
    }else if (data.code == GoogleLogin.CB_CODE_LOGOUT){
      this.setState({
        glName: '',
        glEmail: '',
        glLoginStatus: false,
      });
      alert('登出成功！');
    }else if (data.code == TwitterLogin.CB_CODE_EXPIRED){
      if (data.result == TwitterLogin.EXPIRED_OUT){
        console.log('登录已经过期');
        this.LoginGoolge();
      }else {
        console.log('登录成功！');
        this.LoginGoogleSilently();
      }
    }else if (data.code == GoogleLogin.CB_CODE_DISCONNECT){
      this.setState({
        glName: '',
        glEmail: '',
        glLoginStatus: false,
      });
      alert('登出成功：' + ret.fullName);
    }
  }
  setWaiting(bln){
    this.setState({
      isWaiting: bln,
    });
  }
  PressToken(){
    this.setWaiting(true);
    AccessToken.getCurrentAccessToken().then(data=>{
      this.setWaiting(false);
      if (data == null){
        this.PressLogin();
      }else {
        var date = new Date();
        var expirateDate = new Date();
        expirateDate.setTime(data.expirationTime);
        console.log(data.expirationTime);
        console.log(expirateDate.toDateString());
        if (date.valueOf() > data.expirationTime){
          alert('登录过期了，重新登录');
        }else{
          // alert('欢迎回来！');
          this.onPressUser();
        }
      }
    }).catch(error=>{
      this.setWaiting(false);
      alert('getCurrentAccessToken error: ' + error.toString());
    });
  }
  PressLogin(){
    this.setWaiting(true);
    LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
      (result)=>{
        this.setWaiting(false);
        if (result.isCancelled){
          alert('Login cancelled');
        }else{
          this.PressToken();
        }
      }, (error)=>{
        this.setWaiting(false);
        alert("Login fail with error: " + error);
      }
    );
  }
  onLoginFinished(error, result){
    this.setWaiting(false);
    if (error){
      alert("login has error: " + result.error);
    }else if (result.isCancelled){
      alert("login is cancelled.");
    }else {
      this.PressToken();
    }
  }
  onLogoutFinished(){
    this.setWaiting(false);
    this.setState({
        fbName: '',
        fbEmail: ''
      });
    alert("logout.");
  }
  _responseInfoCallback(error, result){
    this.setWaiting(false);
    if (error){
      alert('error fetching data: ' + error.toString());
    }else{
      // console.log(result);
      // alert('Success fetching data: '+ result.toString());
      alert('欢迎回来，' + result.name + '!');
      this.setState({
        fbName: result.name,
        fbEmail: result.email
      });
    }
  }
  onPressUser(){
    this.setWaiting(true);
    new GraphRequestManager().addRequest(this.infoRequest).start();
  }
  onTwitterPress(){
    if (this.state.twLoginStatus){
      this.LogoutTwitter();
    }else {
      this.ExpiredTwitter();
    }
  }
  LoginTwitter(){
    TwitterLogin.Login();
  }
  LogoutTwitter(){
    TwitterLogin.Logout();
  }
  ExpiredTwitter(){
    TwitterLogin.IsExpired();
  }
  GetInfoTwitter(){
    TwitterLogin.GetInfos();
  }
  onGooglePress(){
    if (this.state.glLoginStatus){
      this.LogoutGoogle();
    }else{
      this.ExpiredGoogle();
    }
  }
  LoginGoolge(){
    GoogleLogin.Login();
  }
  LogoutGoogle(){
    GoogleLogin.Logout();
  }
  LoginGoogleSilently(){
    GoogleLogin.LoginSilently();
  }
  ExpiredGoogle(){
    GoogleLogin.IsExpired();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <LoginButton readPermissions={["public_profile","email"]}
          onLoginFinished={this.onLoginFinished.bind(this)}
          onLogoutFinished={this.onLogoutFinished.bind(this)} />
        <TouchableOpacity style={{marginTop: 10}} onPress={this.onPressUser.bind(this)}>
          <Text style={styles.instructions}>
            获取用户信息
          </Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>
          FB用户：{this.state.fbName}
        </Text>
        <Text style={styles.instructions}>
          FB邮件：{this.state.fbEmail}
        </Text>
        <Text style={styles.instructions}>
          TW用户：{this.state.twName}
        </Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.instructions}>
            TW头像：{this.state.twEmail}
          </Text>
          {this.state.twIcon ? 
          <Image source={{uri: this.state.twIcon}} 
            style={{width: 40, height: 40}} 
            resizeMode='contain'/> :
          null
          }
        </View>
        <TouchableOpacity style={{marginTop: 10}} onPress={this.onTwitterPress.bind(this)}>
          <Text style={styles.instructions}>
            {this.state.twLoginStatus ? 'Twitter Logout' : 'Twitter Login'} 
          </Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>
          GL用户：{this.state.glName}
        </Text>
        <Text style={styles.instructions}>
          GL邮箱：{this.state.glEmail}
        </Text>
        <TouchableOpacity style={{marginTop: 10}} onPress={this.onGooglePress.bind(this)}>
          <Text style={styles.instructions}>
            {this.state.glLoginStatus ? 'Google Logout' : 'Google Login'} 
          </Text>
        </TouchableOpacity>
        {this.state.isWaiting ? 
          <View style={{
            position: 'absolute', 
            left: 0,
            top: 0,
            width: ScreenWidth,
            height: ScreenHeight,
            backgroundColor: 'black', 
            opacity: 0.5}} /> : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Jicheng8', () => Jicheng8);
