import React, {useState} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon} from 'native-base';
import {View} from 'react-native';
import {firestore} from '../../firebase';
import {ColorBoard} from '../../res/colors';

const AddProjectAlert = ({screen}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [isValidURL, setIsValidURL] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [iconInputURL, setIconInputURL] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputNote, setInputNote] = useState('');
  const [inputPhotoURL, setInputPhotoURL] = useState('');

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

  const onURLChange = text => {
    const url = text.trim();
    setInputPhotoURL(url);
    if (url === '') {
      if (isValidURL == 0) return;
      setIconInputURL(null);
      setIsValidURL(0);
      return;
    }

    if (validURL(url)) {
      if (isValidURL == 1) return;
      setIconInputURL('checkmark-circle');
      setIsValidURL(1);
    } else {
      if (isValidURL == -1) return;
      setIconInputURL('close-circle');
      setIsValidURL(-1);
    }
  };

  const AddProject = () => {
    if (isEmptyInput == 0) {
      setIsEmptyInput(-1);
      setIconInput('close-circle');
      return;
    }
    if (isEmptyInput == 1 && isValidURL != -1) {
      let newProject = {
        name: inputName,
        note: inputNote,
        photoURL: inputPhotoURL,
        tasks: [
          {name: 'To Do', color: ColorBoard[6], rows: [{name: 'test'}]},
          {name: 'Doing', color: ColorBoard[2], rows: []},
          {name: 'Done', color: ColorBoard[4], rows: []},
        ],
      };

      firestore()
        .collection('Projects')
        .add(newProject)
        .then(querySnapshot => {
          firestore().collection('Users').doc(screen.currentUser.uid).update({
            myProjects: firestore.FieldValue.arrayUnion(querySnapshot.id),
          });
        });

      screen.setState({
        showAlert: false,
      });
    }
  };
  function validURL(url) {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(url) && url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }

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
          <Item error={isValidURL == -1} success={isValidURL == 1}>
            <Input placeholder="Photo url" onChangeText={onURLChange} />
            <Icon name={iconInputURL} />
          </Item>
        </View>
      }
    />
  );
};

export default AddProjectAlert;
