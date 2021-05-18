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
  Modal
} from 'react-native';
import {colors} from '../res/colors';
import images from '../res/images';
import {AuthContext} from '../context';

export default class SignInScreen extends Component {
  static contextType = AuthContext;
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      isHiddenPassword: true,
      IconShowPassword: 'eye',
      loading: false,
    };
  }

  componentDidMount() {}
  handleShowPasswordPress = () => {
    const {isHiddenPassword, IconShowPassword} = this.state;
    if (isHiddenPassword) {
      this.setState({IconShowPassword: 'eye-off'});
    } else {
      this.setState({IconShowPassword: 'eye'});
    }
    this.setState({isHiddenPassword: !isHiddenPassword});
  };
  handleSignInButton = () => {
    const {email, password} = this.state;
    console.log(email);
    console.log(password);
  };

  render() {
    const {
      email,
      password,
      isHiddenPassword,
      IconShowPassword,
      loading,
    } = this.state;
    const {signIn} = this.context;
    return (
      <Container>
        <StatusBar barStyle="light-content" backgroundColor={colors.Primary} />
        <Modal animationType="fade" transparent={true} visible={loading}>
          <View style={styles.centeredView}>
            <ActivityIndicator color={colors.Primary} size="large" />
          </View>
        </Modal>
        <View style={styles.header}>
          <Image source={images.logo} style={styles.logo} />
          <View>
            <Text style={{color: 'white', fontSize: 10}}>Welcome to</Text>
            <Text style={{color: 'white', fontSize: 20}}>ProJesk</Text>
          </View>
        </View>
        <Content>
          <View style={styles.body}>
            <Text style={{alignSelf: 'center', marginVertical: 10}}>
              Sign in to your account
            </Text>
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
                secureTextEntry={isHiddenPassword}
                onChangeText={text => this.setState({password: text})}
                getRef={r => (this.passwordRef = r)}
              />
              <Icon
                name={IconShowPassword}
                style={styles.icon}
                onPress={this.handleShowPasswordPress}
              />
            </Item>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Forgot password?</Text>
            </TouchableOpacity>
            <Button
              backgroundColor={colors.Primary}
              style={styles.button}
              onPress={this.handleSignInButton}>
              <Text style={styles.buttonText}>Sign in</Text>
            </Button>
            <Text note style={{alignSelf: 'center'}}>
              Or With
            </Text>
            <Button
              backgroundColor="#DF4531"
              style={styles.button}
              onPress={() => signIn(this)}>
              <Icon name="logo-google" style={{position: 'absolute'}} />
              <Text style={styles.buttonText}>Google</Text>
            </Button>
          </View>
          <View style={styles.footer}>
            <Text note>Don't have an account?</Text>
            <TouchableOpacity>
              <Text style={{color: colors.Primary, marginHorizontal: 5}}>
                Sign up
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
    backgroundColor: colors.Primary,
    flexDirection: 'row',
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
