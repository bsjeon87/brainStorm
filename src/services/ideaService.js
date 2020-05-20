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
// related materials list(id )

//*materials DB
//uid(doc id) -- auto make
//**collection for each material
// material id -- auto make
// material category
// material keyworkd
// related id list( id )

let ideas = [];
let materials = [];
let user;

export function getCategories(objs) {
  let categories_from_objs = [];
  if (objs.length === 0) return categories_from_objs;

  categories_from_objs = objs.map((obj, index) => {
    return { _id: index + 1, name: obj.category };
  });
  return categories_from_objs;
}
export function getIdea(ideaId) {
  const ideaArr = ideas.filter((i) => i._id === ideaId);
  console.log("find idea", ideaArr);
  return ideaArr[0];
}
export function getMaterial(materialId) {
  const matarialArr = materials.filter((m) => m._id === materialId);
  console.log("find matarial", matarialArr);
  return matarialArr[0];
}

export function getIdeas() {
  return ideas;
}
export function getMaterials() {
  return materials;
}

export async function addNewMaterial(material) {
  materials.push(material);

  const material_id = await firebase.createDocumentWithoutName(
    ["materials", user.uid, "material"],
    material
  );
  if (material_id !== null) {
    material._id = material_id;
  } else {
    //TODO ::FAIL
    return;
  }
}
export async function updateMaterial(new_material) {
  let material = getMaterial(new_material._id);
  //material update
  const result = await firebase.update(
    ["materials", user.uid, "material", new_material._id],
    {
      category: new_material.category,
      keyword: new_material.keyword,
    }
  );

  material.category = new_material.category;
  material.keyword = new_material.keyword;
}
export async function removeMaterial(material) {
  console.log("remove Material", material);
  materials = materials.filter((m) => m._id !== material._id);
  await firebase.delete(["materials", user.uid, "material", material._id]);
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
export async function updateIdeaWithMaterials(new_idea) {
  // 0. 기존 idea찾기
  // 1. 기존 idea의 material과 차이점 찾기.
  // 1-1. 없어진 material업데이트.
  // 1-2. 새로생긴 material 업데이트.
  // 2. idea doc 전체 업데이트

  const idea = getIdea(new_idea._id);
  if (!idea) return;

  console.log("update idea1", idea);
  console.log("update new idea1", new_idea);
  //기존에는 있었으나 새로운 아이디에는 없어짐.
  const diff_for_removingMaterial = idea.materials.filter((m) => {
    for (var index in new_idea.materials) {
      if (m.material_id === new_idea.materials[index].material_id) return false;
    }
    return true;
  });
  diff_for_removingMaterial.map(async (m) => {
    await firebase.update(
      ["materials", user.uid, "material", m.material_id],
      {
        idea_id: idea._id,
      },
      true,
      "ideas",
      true
    );
    let material = getMaterial(m.material_id);
    const material_ideas = material.ideas.filter((i) => idea._id !== i.idea_id);
    material.ideas = material_ideas;
  });

  //기존에는 없었으나 새로운 아이디어에는 새로 생김.
  const diff_for_addingMaterial = new_idea.materials.filter((m) => {
    for (var index in idea.materials) {
      if (m.material_id === idea.materials[index].material_id) return false;
    }
    return true;
  });
  diff_for_addingMaterial.map(async (m) => {
    await firebase.update(
      ["materials", user.uid, "material", m.material_id],
      {
        idea_id: idea._id,
      },
      true,
      "ideas",
      false
    );
    let material = getMaterial(m.material_id);
    material.ideas.push(idea._id);
  });

  console.log("update idea");
  //idea update
  const result = await firebase.update(
    ["ideas", user.uid, "idea", new_idea._id],

    {
      category: new_idea.category,
      title: new_idea.title,
      content: new_idea.content,
      materials: new_idea.materials,
    }
  );
  if (result === true) {
    console.log("update idea ");
  }

  idea.category = new_idea.category;
  idea.title = new_idea.title;
  idea.content = new_idea.content;
  idea.materials = new_idea.materials;
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
export async function makesUser(userArg) {
  user = userArg;
  console.log(userArg);
  const userdata = { username: user.displayName, email: user.email };
  console.log("user datalog", userdata);
  if ((await firebase.createDocument(["users", user.uid], userdata)) === true)
    console.log("create new user info");
}
export async function makesFakeData(userArg) {
  user = userArg;
  console.log(userArg);
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
