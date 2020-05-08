import React, { Component } from "react";
import firebase from "../firebase/firebase";
import LoginManager from "../services/loginManager";
import { Redirect } from "react-router-dom";
class LoginPopup extends Component {
  state = { loginStatus: LoginManager.isLogin() };
  handleLogin = (result) => {
    console.log("login ok");
    LoginManager.setLogin(true);
    console.log("login ok", LoginManager.isLogin());
    this.setState({ loginStatus: LoginManager.isLogin() });
  };
  render() {
    console.log("login ok", this.state.loginStatus);
    if (this.state.loginStatus == true) return <Redirect to="/home"></Redirect>;
    else {
      console.log("loginpopup");
      firebase.popupLogin(this.handleLogin);
      return <div />;
    }
  }
}

export default LoginPopup;
