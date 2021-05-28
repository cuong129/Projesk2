import React, {useState, useEffect} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon} from 'native-base';
import {View} from 'react-native';
import {firestore, auth, typeActivity, addActivity} from '../../firebase';
import {ColorBoard} from '../../res/colors';
import typeAlert from './TypeAlert';

const ProjectAlert = ({screen, type}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [isValidURL, setIsValidURL] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [iconInputURL, setIconInputURL] = useState(null);
  const [inputName, setInputName] = useState(
    type == typeAlert.CREATE_PROJECT ? '' : screen.state.project.name,
  );
  const [inputNote, setInputNote] = useState(
    type == typeAlert.CREATE_PROJECT ? '' : screen.state.project.note,
  );
  const [inputPhotoURL, setInputPhotoURL] = useState(
    type == typeAlert.CREATE_PROJECT ? '' : screen.state.project.photoURL,
  );

  const onTextChange = text => {
    const content = text.trim();
    setInputName(content);
    if (!text || content === '') {
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

  const UpdateProject = () => {
    //add activity
    let content = '';
    const project = screen.state.project;
    if (project.name != inputName)
      content +=
        '\nRename project from ' + project.name + ' to ' + inputName + '.';
    if (project.note != inputNote)
      content +=
        '\nChange note from ' + project.note + ' to ' + inputNote + '.';
    if (project.photoURL != inputPhotoURL) content += '\nChange background.';
    if (content === '') return;
    else
      content =
        screen.currentUser.displayName + ' edit profile project:' + content;

    addActivity(content, typeActivity.EDIT_PROJECT, screen.idProject);
    firestore().collection('Projects').doc(screen.idProject).update({
      name: inputName,
      note: inputNote,
      photoURL: inputPhotoURL,
    });
  };

  const CreateProject = () => {
    const user = auth().currentUser;
    let newProject = {
      name: inputName,
      note: inputNote,
      photoURL: inputPhotoURL,
      tasks: [
        {
          name: 'To Do',
          color: ColorBoard[6],
          rows: [{name: 'test', assigns: []}],
        },
        {name: 'Doing', color: ColorBoard[2], rows: []},
        {name: 'Done', color: ColorBoard[4], rows: []},
      ],
      members: [
        {
          uid: user.uid,
          name: user.displayName,
          photoURL: user.photoURL,
          admin: true,
        },
      ],
    };

    firestore()
      .collection('Projects')
      .add(newProject)
      .then(querySnapshot => {
        firestore()
          .collection('Users')
          .doc(screen.currentUser.uid)
          .update({
            myProjects: firestore.FieldValue.arrayUnion(querySnapshot.id),
          });
      });
  };

  const positivePress = () => {
    if (isEmptyInput == 0 && inputName === '') {
      setIsEmptyInput(-1);
      setIconInput('close-circle');
      return;
    }
    if (isEmptyInput != -1 && isValidURL != -1) {
      type == typeAlert.CREATE_PROJECT ? CreateProject() : UpdateProject();

      screen.setState({
        alert: typeAlert.NONE,
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
      screen={screen}
      title={
        type == typeAlert.CREATE_PROJECT ? 'Create New Project' : 'Edit Project'
      }
      positiveButtonText={type == typeAlert.CREATE_PROJECT ? 'CREATE' : 'SAVE'}
      positiveButtonPress={positivePress}
      componentBody={
        <View>
          <Item error={isEmptyInput == -1} success={isEmptyInput == 1}>
            <Input
              placeholder="Name"
              onChangeText={onTextChange}
              value={inputName}
            />
            <Icon name={iconInput} />
          </Item>
          <Item>
            <Input
              placeholder="Note"
              onChangeText={text => setInputNote(text)}
              value={inputNote}
            />
          </Item>
          <Item error={isValidURL == -1} success={isValidURL == 1}>
            <Input
              placeholder="Background url"
              onChangeText={onURLChange}
              value={inputPhotoURL}
            />
            <Icon name={iconInputURL} />
          </Item>
        </View>
      }
    />
  );
};

export default ProjectAlert;
