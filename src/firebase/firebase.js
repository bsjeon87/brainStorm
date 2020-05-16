import app from "firebase/app";
import * as firebase from "firebase";
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
  /*
  doSignInWithEmailAndPassword(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }
*/
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
        fire_ref = this.firestore.collection(paths[0]);
      } else if (i % 2 !== 0) {
        fire_ref = fire_ref.doc(paths[i]);
      } else {
        fire_ref = fire_ref.collection(paths[i]);
      }
    }
    return fire_ref;
  }
  async loadAllDocuments(paths) {
    var docRef = this.getCollection(paths);
    var result = [];
    try {
      const ret_docs = await docRef.get();

      ret_docs.docs.forEach((doc) => {
        console.log("doc : ", doc, doc.id, doc._id);
        let data = doc.data();
        data._id = doc.id;
        result.push(data);
      });
    } catch (err) {
      console.log("Error getting document:", err);
    }
    return result;
  }
  async loadDocuments(paths) {
    var docRef = this.getCollection(paths);

    try {
      const doc = await docRef.get();

      if (doc.exists) {
        console.log("Document data:", doc.data());
        return doc.data();
      } else console.log("No such document!");
    } catch (err) {
      console.log("Error getting document:", err);
    }
    return null;
  }

  async createDocumentWithoutName(paths, obj) {
    console.log("createDocumentWithoutName", paths, obj);
    var fire_ref = this.getCollection(paths);
    try {
      const docRef = await fire_ref.add(obj);
      console.log("Document successfully updated!", docRef.id);
      return docRef.id;
    } catch (err) {
      console.log("Error updating document:", err);
    }
    return null;
  }

  async createDocument(paths, obj) {
    // Add a new document in collection
    console.log("createDocument", paths, obj);
    var fire_ref = this.getCollection(paths);

    try {
      await fire_ref.set(obj);
      console.log("Document successfully updated!");
    } catch (err) {
      console.log("Error updating document:", err);
      return false;
    }
    return true;
  }
  async delete(paths) {
    var doc_ref = this.getCollection(paths);
    try {
      await doc_ref.delete();
      console.log("ok to remove");
    } catch (err) {
      console.log("err to remove");
    }
  }
  async update(
    paths,
    obj,
    isArray = false,
    arrayName = "",
    isRemoving = false
  ) {
    var doc_ref = this.getCollection(paths);
    try {
      if (isArray === true) {
        const arrElement = {};
        if (isRemoving === false)
          arrElement[arrayName] = firebase.firestore.FieldValue.arrayUnion(obj);
        else
          arrElement[arrayName] = firebase.firestore.FieldValue.arrayRemove(
            obj
          );
        await doc_ref.update(arrElement);
      } else await doc_ref.update(obj);
      console.log("Document successfully updated!");
    } catch (err) {
      console.error("Error updating document: ", err);
      return false;
    }
    return true;
  }
}

export default new Firebase();
