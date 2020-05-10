import React, { Component } from "react";
import firebase from "../firebase/firebase";
import LoginManager from "../services/loginManager";
class LoginPopup extends Component {
  constructor() {
    super();
    LoginManager.setLoginHandler(this.handleLogin);
  }
  handleLogin = (result, user) => {
    firebase.loadDocuments(["users", user.uid], (gotData) => {
      if (gotData != null) {
        console.log("load user", gotData);
        {
          firebase.createDocumentWithoutName(["ideas", user.uid, "idea"], {
            idealist_id: "test",
          });
        }
      } else {
        const test = { name: "testname" };
        firebase.createDocument(["users", user.uid], test);
        console.log("create new user info");
      }

      if (result === true) this.props.history.replace("/home");
      else this.props.history.replace("/login");
    });
  };
  render() {
    console.log("loginpopup");
    firebase.popupLogin();
    return <div> login Popup</div>;
  }
}

export default LoginPopup;
