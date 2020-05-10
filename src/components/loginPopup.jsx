import React, { Component } from "react";
import firebase from "../firebase/firebase";
import LoginManager from "../services/loginManager";
class LoginPopup extends Component {
  constructor() {
    super();
    LoginManager.setLoginHandler(this.handleLogin);
  }
  handleLogin = (result, user) => {
    const gotData = firebase.loadDocuments(["users", user.uid]);
    console.log("load user", gotData);
    if (gotData != null) {
      if (
        firebase.createDocumentWithoutName(["ideas", user.uid, "idea"], {
          idealist_id: "test",
        }) === true
      )
        console.log("create ok");
    } else {
      const test = { name: "testname" };
      if (firebase.createDocument(["users", user.uid], test) === true)
        console.log("create new user info");
    }

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
