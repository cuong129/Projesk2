import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {v4 as uuidv4} from 'uuid';

async function getProject(idProject) {
  firestore()
    .collection('Projects')
    .doc(idProject)
    .onSnapshot(querySnapshot => {
      if (querySnapshot.exists) return null;
    });
}

function updateProjectNoti(userID, currentUser, idProject) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      arrNoti = arrNoti.filter(item => (item.idProject !== idProject || item.type !== "invite"));
      arrNoti = [...arrNoti, {
        id: uuidv4(),
        name: currentUser.displayName,
        photoURL: currentUser.photoURL,
        type: "remove",
        idProject: idProject,
        date: new Date(),
        seen: false,
      }];
      firestore()
        .collection('Users')
        .doc(userID)
        .update({
          notifications: arrNoti,
        });
    })
}
function deleteNoti(userID, itemID) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      arrNoti = arrNoti.filter(item => item.id !== itemID);
      firestore()
        .collection('Users')
        .doc(userID)
        .update({notifications: arrNoti});
    });
}

function seenNoti(userID, itemID) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      const index = arrNoti.findIndex(item => item.id === itemID);
      arrNoti[index].seen = true;
      firestore()
        .collection('Users')
        .doc(userID)
        .update({ notifications: arrNoti });
    })
}
function addProjectNoti(userID, currentUser, type, idProject) {
  firestore()
    .collection('Users')
    .doc(userID)
    .update({
      notifications: firestore.FieldValue.arrayUnion({
        id: uuidv4(),
        name: currentUser.displayName,
        photoURL: currentUser.photoURL,
        type: type,
        idProject: idProject,
        date: new Date(),
        seen: false,
      })
    })
}
function deleteAssignNoti(userID, idProject, columnIndex, index) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      //delete old assign noti if it exists
      arrNoti = arrNoti.filter(
        item =>
          !(
            item.idProject === idProject &&
            (item.type === 'assign' || item.type === 'deadline') &&
            item.columnIndex === columnIndex &&
            item.index === index
          ),
      );
      firestore().collection('Users').doc(userID).update({
        notifications: arrNoti,
      });
    });
}
function isNewUser(newArr, userID) {
  newArr.forEach(item => {
    if (item.uid === userID) return true;
  });
  return false;
}
function addAssignNoti(
  newArr,
  userID,
  currentUser,
  idProject,
  columnIndex,
  index,
  duedate,
  hasDateSelected,
) {
  var date = new Date(duedate.getTime());
  date.setHours(new Date().getHours());
  date.setMinutes(new Date().getMinutes() - 1);
  var objAssign = {
    id: uuidv4(),
    name: currentUser.displayName,
    photoURL: currentUser.photoURL,
    type: 'assign',
    idProject: idProject,
    columnIndex: columnIndex,
    index: index,
    date: new Date(),
    seen: false,
  };
  var objDeadline = {
    id: uuidv4(),
    photoURL: currentUser.photoURL,
    type: 'deadline',
    idProject: idProject,
    columnIndex: columnIndex,
    index: index,
    duedate: duedate,
    date: date,
    seen: false,
  }
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      // notify assign to new users
      if (userID !== currentUser.uid && isNewUser(newArr, userID)) {
        arrNoti = [...arrNoti, objAssign];
      }
      // delete old deadline noti if due date doesn't exist now
      arrNoti = arrNoti.filter(
        item =>
          !(
            item.idProject === idProject &&
            item.type === 'deadline' &&
            item.columnIndex === columnIndex &&
            item.index === index
          ),
      );
      if (hasDateSelected) {
        arrNoti = [...arrNoti, objDeadline];
      }
      firestore().collection('Users').doc(userID).update({
        notifications: arrNoti,
      });
    });
}

const typeActivity = {
  ADD_MEMBER: 0,
  REMOVE_MEMBER: 1,
  UPDATE_MEMBER: 2,
  EDIT_PROJECT: 3,
  LEAVE_PROJECT: 4,
  ADD_LIST: 5,
  DELETE_LIST: 6,
  EDIT_LIST: 7,
  EDIT_TABLE: 8,
  ADD_TASK: 9,
  EDIT_TASK: 10,
  DELETE_TASK: 11,
  COMPLETE_TASK: 12,
  RESTORE_TASK: 13,
  CREATE_PROJECT: 14,
};

function addActivity(content, type, idProject) {
  const newAcitvity = {
    content: content,
    time: Date.now(),
    type: type,
  };
  firestore()
    .collection('Projects')
    .doc(idProject)
    .update({
      activities: firestore.FieldValue.arrayUnion(newAcitvity),
    });
}
function addCommentNoti(userID, currentUser, idProject, columnIndex, index) {
  firestore()
    .collection('Users')
    .doc(userID)
    .update({
      notifications: firestore.FieldValue.arrayUnion({
        id: uuidv4(),
        name: currentUser.displayName,
        photoURL: currentUser.photoURL,
        type: "comment",
        idProject: idProject,
        date: new Date(),
        seen: false,
        columnIndex: columnIndex,
        index: index,
      })
    });
}
function deleteTaskNoti(userID, idProject, columnIndex, index) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      arrNoti = arrNoti.filter(item =>
        !(item.idProject === idProject && item.columnIndex === columnIndex && item.index === index));
      firestore()
        .collection('Users')
        .doc(userID)
        .update({
          notifications: arrNoti,
        });
    })
}
function deleteProjectNoti(userID, idProject) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      arrNoti = arrNoti.filter(item => item.idProject !== idProject);
      firestore()
        .collection('Users')
        .doc(userID)
        .update({
          notifications: arrNoti,
        });
    })
}
function updateTaskNoti(userID, idProject, oldCol, oldIdx, newCol, newIdx) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      const id = arrNoti.findIndex(item => 
        item.idProject === idProject && item.columnIndex === oldCol && item.index === oldIdx)
      arrNoti[id].columnIndex = newCol;
      arrNoti[id].index = newIdx;
      firestore()
        .collection('Users')
        .doc(userID)
        .update({
          notifications: arrNoti,
        });
    })
}
export {
  auth,
  firestore,
  updateProjectNoti,
  addProjectNoti,
  deleteNoti,
  deleteAssignNoti,
  addAssignNoti,
  seenNoti,
  addCommentNoti,
  deleteTaskNoti,
  deleteProjectNoti,
  updateTaskNoti,
  typeActivity,
  addActivity,
};
