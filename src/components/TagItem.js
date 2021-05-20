import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';
import { ListItem, CheckBox, Icon, Input } from 'native-base';
import {colors, ColorBoard} from '../res/colors';


export default function TagItem(props) {
  const { item, onEditTextChange, onDeletePress, onOpen} = props;
  return (
    <ListItem style={styles.tagItem}>
      <TouchableOpacity onPress={() => onOpen(item.id, item.colorIndex)}>
        <Icon  active name="color-palette-sharp" type='Ionicons' style={{ color: ColorBoard[item.colorIndex], fontSize: 20,}} />
      </TouchableOpacity>
      <Input
        style={[styles.input, {backgroundColor: ColorBoard[item.colorIndex]}]}
        value={item.name}
        onChangeText={(text) => onEditTextChange(item.id, text)} />
      <TouchableOpacity onPress={() => { onDeletePress(item.id) }}>
        <Icon active name="cross" type='Entypo' style={{ color: colors.Danger, fontSize: 20 }} />
      </TouchableOpacity>
    </ListItem>
  )
}
const styles = StyleSheet.create({
  tagItem: {
    backgroundColor: '#fff',
    paddingLeft: 30,
    marginLeft: 0,
    height: 52,
    borderBottomWidth: 0
  },
  input: {
    marginLeft: 10,
    color: '#fff',
    borderRadius: 10,
    paddingLeft: 15,
    marginRight: 10,
    height: 44,
    fontSize: 16,
  }
})
