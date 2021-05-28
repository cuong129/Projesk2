import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  StyleProvider,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
} from 'native-base';
import {StatusBar, StyleSheet, View, FlatList, Alert} from 'react-native';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import {colors} from '../res/colors';
import FormatPeriodTime from '../utility/FormatPeriodTime';
import {typeActivity} from '../firebase';

export default class ActivityScreen extends Component {
  constructor(props) {
    super(props);

    this.activities = [{id: 1}, {id: 2}];
  }

  render() {
    const {navigation} = this.props;
    const {activities} = this.props.route.params;

    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <StatusBar translucent={false} />
          <Header style={{backgroundColor: colors.Primary}}>
            <Left>
              <Button transparent onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>Activity</Title>
            </Body>
            <Right></Right>
          </Header>
          <FlatList
            data={activities}
            renderItem={item => this.renderItem(item)}
            keyExtractor={(item, index) => index}
          />
        </Container>
      </StyleProvider>
    );
  }

  renderItem(item) {
    const icon = iconActivities[item.type];
    return (
      <View style={styles.item}>
        <Icon name={icon.name} type={icon.type} style={{color: icon.color}} />
        <View style={styles.content}>
          <Text note>{FormatPeriodTime(item.time)}</Text>
          <Text>{item.content}</Text>
        </View>
      </View>
    );
  }
}

const iconActivities = [
  {name: 'person-add', type: 'MaterialIcons', color: colors.Primary},
  {name: 'person-remove-sharp', type: 'Ionicons', color: colors.Danger},
  {name: 'account-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'folder-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'logout', type: 'MaterialCommunityIcons', color: colors.Danger},
  {name: 'table-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'file-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'clipboard-check', type: 'MaterialCommunityIcons', color: colors.Positive},
];

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    marginLeft: 20,
    marginRight: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.Disable,
    paddingBottom: 10,
    flex: 1,
  },
});
