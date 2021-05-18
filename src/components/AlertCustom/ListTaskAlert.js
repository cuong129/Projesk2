import React, {useState} from 'react';
import AlertView from './AlertView';
import {Input, Item, Icon} from 'native-base';
import {FlatList, View, Pressable} from 'react-native';
import {ColorBoard} from '../../res/colors';
import {RowRepository} from '../Board/index';

const ListTaskAlert = ({screen}) => {
  const [isEmptyInput, setIsEmptyInput] = useState(0);
  const [iconInput, setIconInput] = useState(null);
  const [idSelectColor, setIdSelectColor] = useState(0);
  const [inputText, setInputText] = useState('');

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
    setInputText(text);
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

  const AddList = () => {
    if (isEmptyInput == 0) {
      setIsEmptyInput(-1);
      setIconInput('close-circle');
      return;
    }
    if (isEmptyInput == 1) {
      let newData = [
        {
          id: Math.floor(Math.random() * 10),
          name: inputText,
          color: ColorBoard[idSelectColor],
          rows: [],
        },
      ];

      screen.rowRepository = new RowRepository(newData);
      screen.setState({
        showAddList: false,
      });
    }
  };

  return (
    <AlertView
      title="Add List"
      positveButtonText="ADD"
      positveButtonPress={AddList}
      cancelButtonPress={() => screen.setState({showAddList: false})}
      componentBody={
        <View>
          <Item error={isEmptyInput == -1} success={isEmptyInput == 1}>
            <Input placeholder="List title" onChangeText={onTextChange} />
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
