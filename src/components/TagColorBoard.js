import React from 'react'
import { StyleSheet, FlatList, Dimensions, TouchableOpacity, Text } from 'react-native'
import { Icon } from 'native-base'
import { ColorBoard } from '../res/colors'
const data = [
  { id: 0, value: ColorBoard[0] },
  { id: 1, value: ColorBoard[1] },
  { id: 2, value: ColorBoard[2] },
  { id: 3, value: ColorBoard[3] },
  { id: 4, value: ColorBoard[4] },
  { id: 5, value: ColorBoard[5] },
  { id: 6, value: ColorBoard[6] },
  { id: 7, value: ColorBoard[7] },
  { id: 8, value: ColorBoard[8] },
]
const numColumns = 3;
const size = Dimensions.get('window').width / numColumns - 30;
export default function TagColorBoard(props) {
  const {selectedColor, onPressColor} = props;
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity 
          style={[styles.itemContainer, { backgroundColor: item.value }]}
          onPress={() => onPressColor(item.id)}>
          {item.id === selectedColor && <Icon name="check" type='FontAwesome' style={{ color: '#fff'}} />}
        </TouchableOpacity>
      )}
      keyExtractor={item => item.id}
      numColumns={numColumns}
    />
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: size,
    height: 50,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }
});