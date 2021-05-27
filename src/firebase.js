import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

async function getProject(idProject)  {
   firestore().collection('Projects').doc(idProject)
   .onSnapshot(querySnapshot => {
     if (querySnapshot.exists)
      return null;
   })
}

export {auth, firestore, getProject};
