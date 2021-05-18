import React, {useState} from 'react';
import {Modal, StyleSheet, View, Text} from 'react-native';
import {Button} from 'native-base';
import {colors} from '../../res/colors';

const AlertView = ({
  show,
  title,
  positveButtonText,
  positveButtonPress,
  cancelButtonPress,
  componentBody,
}) => {

  return (
    <Modal animationType="fade" transparent={true} visible={show}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View>
            <Text style={styles.modalTitle}>{title}</Text>
          </View>
          <View style={styles.modalBody}>{componentBody}</View>
          <View style={styles.modalBottom}>
            <Button
              transparent
              style={{marginRight: 20}}
              onPress={cancelButtonPress}>
              <Text style={{color: 'black', fontSize: 15}}>CANCEL</Text>
            </Button>
            <Button transparent onPress={positveButtonPress}>
              <Text style={{color: colors.Primary, fontSize: 15}}>
                {positveButtonText}
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 4,
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalBody: {
    paddingVertical: 10,
  },
});

export default AlertView;
