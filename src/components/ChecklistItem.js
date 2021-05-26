import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ListItem, CheckBox, Icon, Text, Input} from 'native-base';
import {colors} from '../res/colors';


export default function ChecklistItem(props) {
  const {item, onEditTextChange, onDeletePress, onCheckboxPress} = props;
    return (
      <ListItem style={styles.checklistItem}>
        <CheckBox 
          style={{width: 22, height: 22}} 
          checked={item.hasChecked}
          onPress={() => {onCheckboxPress(item.id)}} />
        <Input 
          style={[styles.input, item.isChecked ? {textDecorationLine: 'line-through'} : {textDecorationLine: 'none'} ]} 
          value={item.name}
          onChangeText={(text) => onEditTextChange(item.id, text)}/>
        <TouchableOpacity onPress={() => {onDeletePress(item.id)}}>
          <Icon active name="cross" type='Entypo' style={{ color: colors.Danger, fontSize: 20, }} />
        </TouchableOpacity>
      </ListItem>
    )
}
const styles = StyleSheet.create({
  checklistItem: {
    backgroundColor: '#fff',
    paddingLeft: 30,
    marginLeft: 0,
    height: 50,
  },
  input: {
    marginLeft: 10,
  }
})
