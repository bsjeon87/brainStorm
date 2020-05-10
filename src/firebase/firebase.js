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
      });
    this.login_popup_state = true;
  }

  getCollection(paths) {
    console.log("create path", paths);
    var fire_ref = null;
    for (var i in paths) {
      console.log("search path", paths[i], i);
      if (parseInt(i) === 0) {
        console.log("search path i=0");
        fire_ref = this.firestore.collection(paths[0]);
      } else if (i % 2 !== 0) {
        console.log("search path i=1");
        fire_ref = fire_ref.doc(paths[i]);
      } else {
        console.log("search path i=2");
        fire_ref = fire_ref.collection(paths[i]);
      }
    }
    return fire_ref;
  }
  loadDocuments(paths, onGetData) {
    var docRef = this.getCollection(paths);

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

  createDocumentWithoutName(paths, obj, onHandle) {
    console.log("create path", paths);
    var fire_ref = this.getCollection(paths);

    fire_ref
      .add(obj)
      .then(function () {
        console.log("Document successfully updated!");
        if (onHandle) onHandle();
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
        if (onHandle) onHandle();
      });
  }

  createDocument(paths, obj, onHandle) {
    // Add a new document in collection
    var fire_ref = this.getCollection(paths);

    fire_ref
      .set(obj)
      .then(function () {
        console.log("Document successfully written!");
        if (onHandle) onHandle();
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
        if (onHandle) onHandle();
      });
  }

  updateUserID(collectionName, docName, obj) {
    var doc_ref = this.firestore.collection(collectionName).doc(docName);

    // Set the "capital" field of the city 'DC'
    return doc_ref
      .update(obj)
      .then(function () {
        console.log("Document successfully updated!");
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  }

  createDocumentsForIdea(collectionName, obj, onResult) {
    this.firestore
      .collection(collectionName)
      .add(obj)
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        onResult(docRef.id);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
        onResult(null);
      });
  }

  doSignInWithEmailAndPassword(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
}

export default new Firebase();
