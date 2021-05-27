import React, {useState} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon} from 'native-base';
import {FlatList, View, Pressable} from 'react-native';
import {ColorBoard} from '../../res/colors';
import {firestore} from '../../firebase';
import typeAlert from './TypeAlert';

const ListTaskAlert = ({screen, type}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [idSelectColor, setIdSelectColor] = useState(
    type == typeAlert.ADD_LIST
      ? 0
      : ColorBoard.indexOf(screen.props.columnTask.color),
  );
  const [inputText, setInputText] = useState(
    type == typeAlert.ADD_LIST ? '' : screen.props.columnTask.name,
  );

  const itemcolor = ({item, index}) => {
    const size = index == idSelectColor ? 24 : 14;

    return (
      <Pressable
        onPress={() => {
          if (index != idSelectColor) setIdSelectColor(index);
        }}>
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: item,
          }}
        />
      </Pressable>
    );
  };

  const onTextChange = text => {
    const content = text.trim();
    setInputText(content);
    if (content === '') {
      if (isEmptyInput == -1) return;
      setIconInput('close-circle');
      setIsEmptyInput(-1);
      return;
    }
    if (isEmptyInput == 1) return;
    setIconInput('checkmark-circle');
    setIsEmptyInput(1);
  };

  const positivePress = () => {
    if (isEmptyInput == 0 && inputText === '') {
      setIsEmptyInput(-1);
      setIconInput('close-circle');
      return;
    }
    if (isEmptyInput != -1) {
      type == typeAlert.ADD_LIST ? addList() : updateList();

      screen.setState({
        alert: typeAlert.NONE,
      });
    }
  };

  const addList = () => {
    let newList = {
      name: inputText,
      color: ColorBoard[idSelectColor],
      rows: [],
    };

    firestore()
      .collection('Projects')
      .doc(screen.idProject)
      .update({
        tasks: firestore.FieldValue.arrayUnion(newList),
      });
  };

  const updateList = () => {
    const props = screen.props;
    let newTasks = [...props.tasks];
    newTasks[props.index].name = inputText;
    newTasks[props.index].color = ColorBoard[idSelectColor];

    firestore().collection('Projects').doc(props.idProject).update({
      tasks: newTasks,
    });
  };

  return (
    <AlertView
      screen={screen}
      title={type == typeAlert.ADD_LIST ? 'Add List' : 'Edit List'}
      positiveButtonText={type == typeAlert.ADD_LIST ? 'ADD' : 'SAVE'}
      positiveButtonPress={positivePress}
      componentBody={
        <View>
          <Item error={isEmptyInput == -1} success={isEmptyInput == 1}>
            <Input
              placeholder="List title"
              onChangeText={onTextChange}
              value={inputText}
            />
            <Icon name={iconInput} />
          </Item>
          <FlatList
            contentContainerStyle={{
              marginTop: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            data={ColorBoard}
            renderItem={itemcolor}
            keyExtractor={index => index}
          />
        </View>
      }
    />
  );
};

export default ListTaskAlert;
