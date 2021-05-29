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
      arrNoti = arrNoti.filter(
        item => item.idProject !== idProject || item.type !== 'invite',
      );
      arrNoti = [
        ...arrNoti,
        {
          id: uuidv4(),
          name: currentUser.displayName,
          photoURL: currentUser.photoURL,
          type: 'remove',
          idProject: idProject,
          date: new Date(),
        },
      ];
      firestore().collection('Users').doc(userID).update({
        notifications: arrNoti,
      });
    });
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
      }),
    });
}
function deleteDeadlineNoti(userID, idProject, columnIndex, index) {
  firestore()
    .collection('Users')
    .doc(userID)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      //delete old deadline noti if it exists
      arrNoti = arrNoti.filter(
        item =>
          !(
            item.idProject === idProject &&
            item.type === 'deadline' &&
            item.columnIndex === columnIndex &&
            item.index === index
          ),
      );
      firestore().collection('Users').doc(userID).update({
        notifications: arrNoti,
      });
    });
}

function addDeadlineNoti(currentUser, idProject, columnIndex, index, duedate) {
  var date = new Date();
  date.setHours(duedate.getHours());
  date.setMinutes(duedate.getMinutes());
  date.setDate(date.getDate() - 1);

  firestore()
    .collection('Users')
    .doc(currentUser.uid)
    .get()
    .then(documentSnapshot => {
      var arrNoti = documentSnapshot.data().notifications;
      //delete old deadline noti if it exists
      arrNoti = arrNoti.filter(
        item =>
          !(
            item.idProject === idProject &&
            item.type === 'deadline' &&
            item.columnIndex === columnIndex &&
            item.index === index
          ),
      );

      //add new deadline noti
      arrNoti = [
        ...arrNoti,
        {
          id: uuidv4(),
          photoURL: currentUser.photoURL,
          type: 'deadline',
          idProject: idProject,
          columnIndex: columnIndex,
          index: index,
          duedate: duedate,
          date: date,
        },
      ];
      firestore().collection('Users').doc(currentUser.uid).update({
        notifications: arrNoti,
      });
    });
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
  var date = new Date();
  date.setHours(duedate.getHours());
  date.setMinutes(duedate.getMinutes());
  date.setDate(date.getDate() - 1);

  var objAssign = {
    id: uuidv4(),
    name: currentUser.displayName,
    photoURL: currentUser.photoURL,
    type: 'assign',
    idProject: idProject,
    columnIndex: columnIndex,
    index: index,
    date: new Date(),
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
  };
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

export {
  auth,
  firestore,
  updateProjectNoti,
  addProjectNoti,
  deleteNoti,
  addDeadlineNoti,
  deleteDeadlineNoti,
  deleteAssignNoti,
  addAssignNoti,
  typeActivity,
  addActivity,
};
