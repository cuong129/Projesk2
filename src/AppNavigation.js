import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  Badge,
  StyleProvider,
  Title,
} from 'native-base';
import {StatusBar} from 'react-native';
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import * as screen from './screens';
import {auth, firestore} from './firebase';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AuthContext} from './context';

const Stack = createStackNavigator();
const Home = createStackNavigator();
const Project = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function AppNavigation({navigation}) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    GoogleSignin.configure({
      webClientId:
        '706435595456-asko46clmok3aq8f8v7geppdjkkto3eu.apps.googleusercontent.com',
      offlineAccess: false,
    });

    setTimeout(function () {
      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
        auth().onAuthStateChanged(user => {
          dispatch({type: 'RESTORE_TOKEN', token: user});
        });
      } catch (e) {
        // Restoring token failed
        dispatch({type: 'RESTORE_TOKEN', token: null});
      }
    }, 1000);
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
        data.setState({loading: true});
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          //Save user account to database if it doesn't exist
          const googleCredential = auth.GoogleAuthProvider.credential(
            userInfo.idToken,
          );

          auth()
            .signInWithCredential(googleCredential)
            .then(async querySnapshot => {
              const user = querySnapshot.user;
              await firestore()
                .collection('Users')
                .doc(user.uid)
                .get()
                .then(querySnapshot => {
                  if (!querySnapshot.exists) {
                    firestore().collection('Users').doc(user.uid).set({
                      name: user.displayName,
                      email: user.email,
                      photoURL: user.photoURL,
                    });
                  }
                });
              dispatch({type: 'SIGN_IN', token: userInfo.idToken});
            });
        } catch (error) {
          console.log(error);
          data.setState({loading: false});
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
      },
      signOut: () => {
        GoogleSignin.signOut();
        auth()
          .signOut()
          .then(() => dispatch({type: 'SIGN_OUT'}));
      },

      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <Stack.Screen name="Splash" component={screen.SplashScreen} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <Stack.Screen
              name="SignIn"
              component={screen.SignInSceen}
              options={{
                title: 'Sign in',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
            // User is signed in
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

function HomeScreen() {
  return (
    <Home.Navigator headerMode="none">
      <Home.Screen name="Main" component={MainScreen} />
      <Home.Screen name="Project" component={ProjectScreen} />
    </Home.Navigator>
  );
}

function ProjectScreen() {
  return (
    <Project.Navigator headerMode="none">
      <Project.Screen name="ProjectMain" component={screen.ProjectScreen} />
      <Project.Screen name="Task" component={screen.TaskScreen} />
      <Project.Screen name="Member" component={screen.MemberScreen} />
      <Project.Screen name="Activity" component={screen.ActivityScreen} />
    </Project.Navigator>
  );
}

function MainScreen() {
  return (
    <Tab.Navigator
      tabBar={props => {
        return (
          <StyleProvider style={getTheme(material)}>
            <Footer>
              <FooterTab>
                <Button
                  badge
                  vertical
                  active={props.state.index === 0}
                  onPress={() => props.navigation.navigate('Notify')}>
                  <Badge>
                    <Text>0</Text>
                  </Badge>
                  <Icon name="notifications" />
                  <Text>Notify</Text>
                </Button>
                <Button
                  vertical
                  active={props.state.index === 1}
                  onPress={() => props.navigation.navigate('MyProject')}>
                  <Icon name="cube" />
                  <Text>project</Text>
                </Button>
                <Button
                  vertical
                  active={props.state.index === 2}
                  onPress={() => props.navigation.navigate('MyTask')}>
                  <Icon name="checkmark-done-circle" />
                  <Text>my task</Text>
                </Button>
                <Button
                  vertical
                  active={props.state.index === 3}
                  onPress={() => props.navigation.navigate('Account')}>
                  <Icon name="person" />
                  <Text>account</Text>
                </Button>
              </FooterTab>
            </Footer>
          </StyleProvider>
        );
      }}>
      <Tab.Screen name="Notify" component={screen.NotifyScreen} />
      <Tab.Screen name="MyProject" component={screen.MyProjectScreen} />
      <Tab.Screen name="MyTask" component={screen.MyTaskScreen} />
      <Tab.Screen name="Account" component={screen.AccountScreen} />
    </Tab.Navigator>
  );
}
