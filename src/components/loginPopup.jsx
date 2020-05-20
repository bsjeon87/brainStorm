import React, { Component } from "react";
import firebase from "../firebase/firebase";
import LoginManager from "../services/loginManager";
import { makesUser, loadingData } from "../services/ideaService";

class LoginPopup extends Component {
  constructor() {
    super();
    LoginManager.setLoginHandler(this.handleLogin.bind(this));
  }
  async handleLogin(result, user) {
    const gotData = await firebase.loadDocuments(["users", user.uid]);
    console.log("load user", gotData);
    if (gotData != null) {
      console.log("ok");
      await loadingData(user);
    } else {
      console.log("make user");
      await makesUser(user);
    }

    if (result === true) this.props.history.replace("/home");
    else this.props.history.replace("/login");
  }
  render() {
    console.log("loginpopup");
    firebase.popupLogin();
    return <div> login Popup</div>;
  }
}

export default LoginPopup;
