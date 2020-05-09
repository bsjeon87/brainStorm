import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import LoginHandler from "../services/loginManager";

//fire base의 보안 추가(firebase site에서 적용) 시 login을 해야함

var firebaseConfig = {
  apiKey: "AIzaSyAL5mUtRed98tWopw9TyAJslVZja5cOwQE",
  authDomain: "brainstorm-75309.firebaseapp.com",
  databaseURL: "https://brainstorm-75309.firebaseio.com",
  projectId: "brainstorm-75309",
  storageBucket: "brainstorm-75309.appspot.com",
  messagingSenderId: "430681668546",
  appId: "1:430681668546:web:80e6beccf5494e9e4ab45b",
  measurementId: "G-PB72EJCN9K",
};

class Firebase {
  login_popup_state = false;

  constructor() {
    app.initializeApp(firebaseConfig);
    this.firestore = app.firestore();
    //this.auth = app.auth();

    //  this.auth.signInWithEmailAndPassword()
  }
  popupLogin() {
    if (this.login_popup_state) return; //already popup
    this.provider = new app.auth.GoogleAuthProvider();
    this.provider.addScope("profile");
    this.provider.addScope("email");
    this.userID = 0;
    app
      .auth()
      .signInWithPopup(this.provider)
      .then((result) => {
        console.log("dd", result);
        // This gives you a Google Access Token.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("uid", user.uid);
        this.userID = user.uid;
        this.login_state = true;
        LoginHandler.setLogin(true, result.user);

        /*    this.firestore
          .collection("collection1")
          .doc("3HMk4JaUaBeZPDlxqF1x")
          .get()
          .then((doc) => {
            console.log(doc.data());
            
            onResultReceived(doc);

          });*/
      });
    this.login_popup_state = true;
  }

  loadDocuments(collectionName, docName, onGetData) {
    var docRef = this.firestore.collection(collectionName).doc(docName);

    docRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log("Document data:", doc.data());
          onGetData(doc.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
          onGetData(null);
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
        onGetData(null);
      });
  }

  createDocumentsForUser(collectionName, docName, obj) {
    // Add a new document in collection "cities"
    this.firestore
      .collection(collectionName)
      .doc(docName)
      .set(obj)
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  }

  doSignInWithEmailAndPassword(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
}

export default new Firebase();
