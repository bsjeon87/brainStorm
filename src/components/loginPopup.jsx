import React, { PureComponent } from "react";
import firebase from "../firebase/firebase";

const LoginPopup = () => {
  firebase.popupLogin();
  return <div></div>;
};

export default LoginPopup;
