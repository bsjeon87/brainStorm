import firebase from "../firebase/firebase";

let userDB = {
  //_authID (doc id)
  //username
  //email
  // ideas id
  // materials id
};

let ideasDB = {
  //_ideas_id(doc id)
  // for each idea(collection)
  // idea id
  // idea category
  // idea contents
  // related materials list(id , title)
};

let materialsDB = {
  //_materials_id(doc id)
  // for each material(collection)
  // material id
  // material category
  // material contents
  // related id list( id , title)
};

export function getUserInfo(authInfo) {
  //auth info에 대한 ID가 있으면 로딩/ 없으면 생성
}
