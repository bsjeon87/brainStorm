import React, { Component } from "react";
import firebase from "../firebase/firebase";
import LoginManager from "../services/loginManager";
class LoginPopup extends Component {
  constructor() {
    super();
    LoginManager.setLoginHandler(this.handleLogin);
  }
  handleLogin = (result) => {
    if (result === true) this.props.history.replace("/home");
    else this.props.history.replace("/login");
  };
  render() {
    console.log("loginpopup");
    firebase.popupLogin();
    return <div> login Popup</div>;
  }
}

export default LoginPopup;
