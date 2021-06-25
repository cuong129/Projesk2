import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Title,
  Left,
  Body,
  Icon,
} from 'native-base';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  AppRegistry,
  StatusBar,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {colors} from '../res/colors';
import images from '../res/images';
import {AuthContext} from '../context';

export default class SignUpScreen extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Container>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <View style={styles.header}>
          <Icon
            name="arrow-back-sharp"
            style={{alignSelf: 'flex-start'}}
            onPress={() => this.props.navigation.goBack()}
          />
          <Text style={{fontSize: 24, marginTop: 40}}>Let's Get Started!</Text>
          <Text note>Create an account to Projesk to get all features</Text>
        </View>
        <Content>
          <View style={styles.body}>
            <Item floatingLabel style={styles.textInput}>
              <Icon name="mail-sharp" style={styles.icon} />
              <Label style={styles.label}>Email</Label>
              <Input
                keyboardType="email-address"
                onChangeText={text => this.setState({email: text})}
                returnKeyType={'next'}
                onSubmitEditing={event => {
                  this.passwordRef._root.focus();
                }}
              />
            </Item>
            <Item floatingLabel style={styles.textInput}>
              <Icon name="key" style={styles.icon} type="Fontisto" />
              <Label style={styles.label}>Password</Label>
              <Input
                onChangeText={text => this.setState({password: text})}
                getRef={r => (this.passwordRef = r)}
              />
              <Icon
                style={styles.icon}
                onPress={this.handleShowPasswordPress}
              />
            </Item>
            <Item floatingLabel style={styles.textInput}>
              <Icon name="unlocked" style={styles.icon} type="Fontisto" />
              <Label style={styles.label}>Confirm Password</Label>
              <Input
                onChangeText={text => this.setState({password: text})}
                getRef={r => (this.passwordRef = r)}
              />
              <Icon
                style={styles.icon}
                onPress={this.handleShowPasswordPress}
              />
            </Item>
            <Button backgroundColor={colors.Primary} style={styles.button}>
              <Text style={styles.buttonText}>Sign up</Text>
            </Button>
          </View>
          <View style={styles.footer}>
            <Text note>Already have an account?</Text>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Text style={{color: colors.Primary, marginHorizontal: 5}}>
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'column',
    paddingHorizontal: 30,
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 10,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: colors.Primary,
    borderRadius: 10,
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  button: {
    width: '100%',
    marginVertical: 15,
    marginTop: 50,
    borderRadius: 6,
  },
  label: {
    marginLeft: 10,
  },
  icon: {
    color: colors.Disable,
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    paddingVertical: 5,
    marginVertical: 5,
  },
  forgotPassword: {
    color: colors.Primary,
    marginVertical: 5,
    alignSelf: 'flex-end',
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
  },
});
