import firebase from "../firebase/firebase";

//*usersDB
//_authID (doc id)  -- auto make
//username
//email

//*ideas DB
//uid(doc id)    -- auto make
//** collection for each idea
// idea id   -- auto make
// idea category
// idea title
// idea contents
// related materials list(id , keyword)

//*materials DB
//uid(doc id) -- auto make
//**collection for each material
// material id -- auto make
// material category
// material keyworkd
// related id list( id , title)

let ideas = null;
let materials = {};
let user;

export function getCategories(objs) {
  const categories_from_objs = objs.map((obj, index) => {
    return { _id: index + 1, name: obj.category };
  });
  return categories_from_objs;
}
export function getIdea(ideaId) {
  const ideaArr = ideas.filter((i) => i._id === ideaId);
  console.log("find idea", ideaArr);
  return ideaArr[0];
}
export function getIdeas() {
  return ideas;
}
export function getMaterials() {
  return materials;
}

export async function removeIdea(idea) {
  console.log("remove idea", idea);
  console.log("remove all materials", materials);
  ideas = ideas.filter((i) => idea._id !== i._id);
  var related_material = materials.filter((m) => {
    console.log("for material", m);
    for (var index in idea.materials) {
      console.log("for id", idea.materials[index].material_id);
      if (m._id === idea.materials[index].material_id) return true;
    }
    return false;
  });
  console.log("remove related material", related_material);
  related_material.map(async (m) => {
    let result = await firebase.update(
      ["materials", user.uid, "material", m._id],
      {
        idea_id: idea._id,
        idea_title: idea.title,
      },
      true,
      "ideas",
      true
    );
    if (result === true) {
      console.log("update material ");
    }
  });

  await firebase.delete(["ideas", user.uid, "idea", idea._id]);
}

export async function addNewIdeaWithMaterials(idea, materialsParmeter) {
  //ideas
  ideas.push(idea);

  const idea_id = await firebase.createDocumentWithoutName(
    ["ideas", user.uid, "idea"],
    idea
  );
  if (idea_id !== null) {
    idea._id = idea_id;
    console.log("create user id");
  } else {
    //TODO ::FAIL
    return;
  }

  materialsParmeter.map(async (m) => {
    let result = await firebase.update(
      ["materials", user.uid, "material", m._id],
      {
        idea_id: idea._id,
        idea_title: idea.title,
      },
      true,
      "ideas"
    );
    if (result === true) {
      console.log("update material ");
    }
  });
}

export async function loadingData(userArg) {
  user = userArg;
  ideas = await firebase.loadAllDocuments(["ideas", user.uid, "idea"]);
  materials = await firebase.loadAllDocuments([
    "materials",
    user.uid,
    "material",
  ]);

  console.log("ideas", ideas);
  console.log("materials", materials);
}

export async function makesFakeData(userArg) {
  user = userArg;
  const usersDB = [{ username: "test_user", email: "bs.jeon@gmail.com" }];
  const ideasDB = [
    {
      category: "technology",
      title: "brain1",
      content: " brain storm way using it",
    },
    {
      category: "technology",
      title: "brain2",
      content: " brain storm way using it22",
    },
  ];
  const materialsDB = [
    { category: "it", keyword: "idea" },
    { category: "network", keyword: "nfc" },
  ];
  if ((await firebase.createDocument(["users", user.uid], usersDB[0])) === true)
    console.log("create new user info");
  //ideas
  for (var index in ideasDB) {
    const idea_id = await firebase.createDocumentWithoutName(
      ["ideas", user.uid, "idea"],
      ideasDB[index]
    );
    if (idea_id !== null) {
      ideasDB[index]._id = idea_id;
      console.log("create user id");
    }
  }
  //materials
  for (index in materialsDB) {
    const material_id = await firebase.createDocumentWithoutName(
      ["materials", user.uid, "material"],
      materialsDB[index]
    );
    if (material_id !== null) {
      materialsDB[index]._id = material_id;
      console.log("create material id");
    }
  }
  //for related
  for (index in ideasDB) {
    const result = await firebase.update(
      ["ideas", user.uid, "idea", ideasDB[index]._id],

      {
        materials: [
          {
            material_id: materialsDB[index]._id,
            material_keyword: materialsDB[index].keyword,
          },
        ],
      }
    );
    if (result === true) {
      console.log("update idea ");
    }
  }
  //material
  for (index in materialsDB) {
    const result = await firebase.update(
      ["materials", user.uid, "material", materialsDB[index]._id],

      {
        ideas: [
          {
            idea_id: ideasDB[index]._id,
            idea_title: ideasDB[index].title,
          },
        ],
      }
    );
    if (result === true) {
      console.log("update material ");
    }
  }

  //test for array element update( add )
  /* await firebase.update(
    ["materials", user.uid, "material", materialsDB[0]._id],
    {
      idea_id: 6,
      idea_title: "test",
    },
    true,
    "ideas"
  ); */
}

export function getUserInfo(authInfo) {
  //auth info에 대한 ID가 있으면 로딩/ 없으면 생성
}
