import React, {useState} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon, Text} from 'native-base';
import {View} from 'react-native';
import {firestore, typeActivity, addActivity} from '../../firebase';
import {typeAlert} from '.';

const AddTaskAlert = ({screen}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputNote, setInputNote] = useState('');

  const onTextChange = text => {
    const name = text.trim();
    setInputName(name);
    if (name === '') {
      if (isEmptyInput == -1) return;
      setIconInput('close-circle');
      setIsEmptyInput(-1);
      return;
    }
    if (isEmptyInput == 1) return;
    setIconInput('checkmark-circle');
    setIsEmptyInput(1);
  };

  const AddTask = () => {
    if (isEmptyInput == 0) {
      setIsEmptyInput(-1);
      setIconInput('close-circle');
      return;
    }
    if (isEmptyInput == 1) {
      const {tasks, index, idProject} = screen.props;
      let newRow = {
        name: inputName,
        note: inputNote,
        StartDate: new Date(),
      };
      let newTasks = [...tasks];
      newTasks[index].rows.push(newRow);

      firestore().collection('Projects').doc(idProject).update({
        tasks: newTasks,
      });

      //add activity
      let content =
        screen.currentUser.displayName +
        ' add new task ' +
        inputName +
        ' to list ' +
        newTasks[index].name;
      addActivity(content, typeActivity.ADD_TASK, idProject);

      screen.setState({
        alert: typeAlert.NONE,
      });
    }
  };

  return (
    <AlertView
      screen={screen}
      title="Add New Task"
      positiveButtonText="ADD"
      positiveButtonPress={AddTask}
      componentBody={
        <View>
          <Text note>{'List ' + screen.props.columnTask.name}</Text>
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

export default AddTaskAlert;
