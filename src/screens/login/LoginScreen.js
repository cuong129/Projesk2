import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Title, Left, Body, Icon } from 'native-base';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import colors from 'res/colors'
import images from 'res/images'
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-google-signin/google-signin'; 
import auth from '@react-native-firebase/auth';
export default class LoginScreen extends Component {
  state = {
    email: '',
    password: '',
    isHiddenPassword: true,
    IconShowPassword: 'eye',
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
      '706435595456-asko46clmok3aq8f8v7geppdjkkto3eu.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }
  handleShowPasswordPress = () => {
    const { isHiddenPassword, IconShowPassword } = this.state;
    if (isHiddenPassword) {
      this.setState({ IconShowPassword: 'eye-slash' });
    } else {
      this.setState({ IconShowPassword: 'eye' });
    };
    this.setState({ isHiddenPassword: !isHiddenPassword });
  };
  handleSignInButton = () => {
    const { email, password } = this.state;
    console.log(email);
    console.log(password);
  };
  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
      this.props.navigation.replace('Main', {user: userInfo});
      //Save user account to database if it doesn't exist
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  render() {
    const { email, password, isHiddenPassword, IconShowPassword } = this.state;
    return (
      <Container>
        <Content>
          <Header transparent>
            <Left>
              <Button transparent>
                <Icon name="arrowleft" style={{ color: colors.theme }} type="AntDesign" />
              </Button>
            </Left>
            <Body>
              <Title style={styles.title}>Sign In</Title>
            </Body>
          </Header>
          <Form style={styles.container}>
            <View style={styles.item}>
              <Icon name="email" style={styles.icon} type="MaterialCommunityIcons" />
              <Item floatingLabel style={styles.textInput}>
                <Label>Email</Label>
                <Input
                  keyboardType="email-address"
                  onChangeText={(text) => this.setState({ email: text })}
                  returnKeyType={'next'}
                  onSubmitEditing={(event) => { this.passwordRef._root.focus(); }} />
              </Item>
            </View>
            <View style={styles.item}>
              <Icon name="key" style={styles.icon} type="Fontisto" />
              <Item floatingLabel style={styles.textInput}>
                <Label>Password</Label>
                <Input
                  secureTextEntry={isHiddenPassword}
                  onChangeText={(text) => this.setState({ password: text })}
                  getRef={(r) => this.passwordRef = r}
                />
              </Item>
              <TouchableOpacity style={{ marginLeft: 10 }} onPress={this.handleShowPasswordPress}>
                <Icon name={IconShowPassword} style={styles.icon} type="FontAwesome5" />
              </TouchableOpacity>
            </View>
            <Button
              rounded 
              style={styles.button}
              onPress={this.handleSignInButton}
            >
              <Text>Sign in</Text>
            </Button>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot your password?</Text>
            </TouchableOpacity>

            <GoogleSigninButton
              style={{ height: 60 }}
              size={GoogleSigninButton.Size.Wide}
              onPress={this.signIn}/>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: colors.theme,
    fontSize: 24,
    fontWeight: 'bold',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center'
  },
  button: {
    flex: 1,
    marginTop: 30,
    paddingVertical: 5,
    backgroundColor: colors.theme,
  },
  icon: {
    color: colors.gray,
    fontSize: 28,
    paddingTop: 32,
  },
  GoogleIcon: {
    color: colors.theme,
    fontSize: 28,
  },
  textInput: {
    flex: 1,
    paddingVertical: 5,
  },
  forgotPassword: {
    padding: 10,
    marginVertical: 20,
    color: colors.theme,
  }
})