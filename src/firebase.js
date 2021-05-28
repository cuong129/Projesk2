import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

async function getProject(idProject) {
  firestore()
    .collection('Projects')
    .doc(idProject)
    .onSnapshot(querySnapshot => {
      if (querySnapshot.exists) return null;
    });
}

const typeActivity = {
  ADD_MEMBER: 0,
  REMOVE_MEMBER: 1,
  UPDATE_MEMBER: 2,
  EDIT_PROJECT: 3,
  LEAVE_PROJECT: 4,
  EDIT_TABLE: 5,
  EDIT_TASK: 6,
  COMPLETE_TASK: 7,
};

export {auth, firestore, getProject, typeActivity};
