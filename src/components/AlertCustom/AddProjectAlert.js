import React, {useState} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon} from 'native-base';
import {View} from 'react-native';
import {firestore} from '../../firebase';
import {ColorBoard} from '../../res/colors';

const AddProjectAlert = ({screen}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputNote, setInputNote] = useState('');

  const onTextChange = text => {
    setInputName(text.trim());
    if (!text || text.trim() === '') {
      if (isEmptyInput == -1) return;
      setIconInput('close-circle');
      setIsEmptyInput(-1);
      return;
    }
    if (isEmptyInput == 1) return;
    setIconInput('checkmark-circle');
    setIsEmptyInput(1);
  };

  const AddProject = () => {
    if (isEmptyInput == 0) {
      setIsEmptyInput(-1);
      setIconInput('close-circle');
      return;
    }
    if (isEmptyInput == 1) {
      let newProject = {
        name: inputName,
        note: inputNote,
        photoURL: null,
        tasks: [
          {id: 0, name: 'To Do', color: ColorBoard[6], rows: []},
          {id: 1, name: 'Doing', color: ColorBoard[2], rows: []},
          {id: 2, name: 'Done', color: ColorBoard[4], rows: []},
        ],
      };

      firestore()
        .collection('Projects')
        .add(newProject)
        .then(querySnapshot => {
          let MyProjectIds = Array.from(
            screen.state.projects,
            element => element.id,
          );
          MyProjectIds.push(querySnapshot.id);

          firestore().collection('Users').doc(screen.currentUser.uid).update({
            myProjects: MyProjectIds,
          });
        });

      screen.setState({
        showAlert: false,
      });
    }
  };

  return (
    <AlertView
      title="Create New Project"
      positveButtonText="CREATE"
      positveButtonPress={AddProject}
      cancelButtonPress={() => screen.setState({showAlert: false})}
      componentBody={
        <View>
          <Item error={isEmptyInput == -1} success={isEmptyInput == 1}>
            <Input placeholder="Name" onChangeText={onTextChange} />
            <Icon name={iconInput} />
          </Item>
          <Item>
            <Input
              placeholder="Note"
              onChangeText={text => setInputNote(text)}
            />
          </Item>
        </View>
      }
    />
  );
};

export default AddProjectAlert;
