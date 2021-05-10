import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Button,
  ListItem,
  Text,
  Icon,
  Left,
  Body,
  Right,
  Switch,
} from 'native-base';
import {
  StatusBar,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import colors from '../res/colors';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

export default class ListIconExample extends Component {
  render() {
    return (
      <Container style={{backgroundColor: colors.Background}}>
        <FocusAwareStatusBar backgroundColor={colors.Background} barStyle="dark-content" />
        <Content>
          <View style={styles.viewInfo}>
            <Image style={styles.imageCircle} />
            <Text>Luân Nguyễn</Text>
            <Text note>xuanluan1412@gmail.com</Text>
          </View>

          <TouchableOpacity activeOpacity={0.5} style={styles.ripple}>
            <View style={styles.viewItem}>
              <Icon
                active
                name="settings-outline"
                style={{color: colors.Primary}}
              />
              <Text style={{marginLeft: 10, color: '#000'}}>Settings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.5} style={styles.ripple}>
            <View style={styles.viewItem}>
              <Icon
                active
                name="log-out-outline"
                style={{color: colors.Danger}}
              />
              <Text style={{marginLeft: 10}}>Log out</Text>
            </View>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  viewInfo: {
    padding: 20,
    alignItems: 'center',
  },

  imageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3773E1',
    marginBottom: 5,
  },

  ripple: {
    flex: 1,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 10,
    elevation: 1,
  },

  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
