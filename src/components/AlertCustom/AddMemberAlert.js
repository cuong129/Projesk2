import React, {useState} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon, Text} from 'native-base';
import {View} from 'react-native';
import {auth, firestore, addProjectNoti} from '../../firebase';
import {colors} from '../../res/colors';
import {typeAlert} from '.';

const AddMemberAlert = ({screen}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [inputEmail, setInputEmail] = useState('');

  const onTextChange = text => {
    const email = text.trim();
    setInputEmail(email);
    if (email === '' || !validateEmail(email)) {
      if (isEmptyInput == -1) return;
      setIconInput('close-circle');
      setIsEmptyInput(-1);
      return;
    }
    if (isEmptyInput == 1) return;
    setIconInput('checkmark-circle');
    setIsEmptyInput(1);
  };

  const AddMember = () => {
    if (isEmptyInput == 0) {
      setIsEmptyInput(-1);
      setIconInput('close-circle');
      return;
    }
    if (isEmptyInput == 1) {
      firestore()
        .collection('Users')
        .where('email', '==', inputEmail)
        .get()
        .then(querySnapshot => {
          if (querySnapshot.empty) return;
          const idProject = screen.idProject;
          querySnapshot.forEach(element => {
            if (element.exists) {
              let newMember = {
                uid: element.id,
                name: element.get('name'),
                photoURL: element.get('photoURL'),
                admin: false,
              };

              const newMembers = [...screen.state.members, newMember];
              screen.setState({
                members: newMembers,
              });

              firestore()
                .collection('Projects')
                .doc(idProject)
                .update({
                  members: firestore.FieldValue.arrayUnion(newMember),
                });
              
              const currentUser = auth().currentUser;
              firestore()
                .collection('Users')
                .doc(element.id)
                .update({
                  myProjects: firestore.FieldValue.arrayUnion(idProject)  
                });
              //add project noti
              addProjectNoti(element.id, currentUser, 'invite', idProject);
            }
          });
        });

      screen.setState({
        alert: typeAlert.NONE,
      });
    }
  };

  function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  return (
    <AlertView
      screen={screen}
      title="Add New Member"
      positiveButtonText="ADD"
      positiveButtonPress={AddMember}
      componentBody={
        <View>
          <Item error={isEmptyInput == -1} success={isEmptyInput == 1}>
            <Icon name="mail-sharp" style={{color: colors.Disable}} />
            <Input placeholder="Email" onChangeText={onTextChange} />
            <Icon name={iconInput} />
          </Item>
        </View>
      }
    />
  );
};

export default AddMemberAlert;
