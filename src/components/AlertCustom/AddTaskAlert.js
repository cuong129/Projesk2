import React, {useState} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon} from 'native-base';
import {View} from 'react-native';

const AddTaskAlert = ({screen}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [inputName, setInputName] = useState('');
  const [inputNote, setInputNote] = useState('');

  const onTextChange = text => {
    setInputName(text);
    if (!text || text === '') {
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
      setIconInput('close-circle')
      return;
    }
    if (isEmptyInput == 1) {
      let newProjects = [
        ...screen.state.projects,
        {id: 5, name: inputName, note: inputNote},
      ];
      screen.setState({
        projects: newProjects,
        showAlert: false,
      });
    }
  };

  return (
    <AlertView
      show={screen.state.showAlert}
      title="Add New Task"
      positveButtonText="ADD"
      positveButtonPress={AddTask}
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

export default AddTaskAlert;
