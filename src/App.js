import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import firebase from "./firebase/firebase";
import LoginPopup from "./components/loginPopup";
import Home from "./components/home";

class App extends Component {
  state = { isLogin2: 0 };
  render() {
    this.state.isLogin2 = firebase.isLogin();
    return <div>{this.state.isLogin2 ? <Home /> : <LoginPopup />}</div>;
  }
}

export default App;
