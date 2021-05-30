import React, {Component} from 'react';
import {
  Container,
  Header,
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
import SearchBar from '../components/SearchBar';

export default class ActivityScreen extends Component {
  constructor(props) {
    super(props);
    this.state={
      isFilter: false,
    }
  }

  render() {
    const {navigation} = this.props;
    const {activities}=this.props.route.params;
    const {isFilter}= this.state
    this.data = isFilter ? this.data : [...activities];

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
            <Right>
              <Button transparent>
                <Icon name="filter-sharp" />
              </Button>
            </Right>
          </Header>
          <View style={styles.viewSearch}>
            <SearchBar
              style={styles.searchBar}
              placeholder="Search activities..."
              onSearch ={(text)=>this.handleSearch(text)}
              endSearch={() => this.setState({isFilter: false})}
            />
          </View>
          <FlatList
            data={this.data}
            renderItem={item => this.renderItem(item)}
            keyExtractor={(item, index) => index}
          />
        </Container>
      </StyleProvider>
    );
  }

  renderItem(item) {
    const activity = item.item;
    const icon = iconActivities[activity.type];
    return (
      <View style={styles.item}>
        <View style={[styles.circle, {backgroundColor: icon.color}]}>
          <Icon
            name={icon.name}
            type={icon.type}
            style={{color: 'white', fontSize: 20}}
          />
        </View>
        <View style={styles.content}>
          <Text note>{FormatPeriodTime(activity.time)}</Text>
          <Text>{activity.content}</Text>
        </View>
      </View>
    );
  }

  handleSearch(text) {
    const {activities}=this.props.route.params;
    this.data = activities.filter(e => e.content.toLowerCase().includes(text.toLowerCase()));
    this.setState({isFilter: true});
  }
}

const iconActivities = [
  {name: 'person-add', type: 'MaterialIcons', color: colors.Primary},
  {name: 'person-remove-sharp', type: 'Ionicons', color: colors.Danger},
  {name: 'account-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'folder-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'logout', type: 'MaterialCommunityIcons', color: colors.Danger},
  {
    name: 'playlist-plus',
    type: 'MaterialCommunityIcons',
    color: colors.Primary,
  },
  {
    name: 'playlist-remove',
    type: 'MaterialCommunityIcons',
    color: colors.Danger,
  },
  {
    name: 'playlist-edit',
    type: 'MaterialCommunityIcons',
    color: colors.Warning,
  },
  {name: 'table-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'note-add', type: 'MaterialIcons', color: colors.Primary},
  {name: 'file-edit', type: 'MaterialCommunityIcons', color: colors.Warning},
  {name: 'page-delete', type: 'Foundation', color: colors.Danger},
  {
    name: 'checkmark-sharp',
    type: 'Ionicons',
    color: colors.Positive,
  },
  {
    name: 'restore',
    type: 'MaterialCommunityIcons',
    color: colors.Disable,
  },
  {
    name: 'create-new-folder',
    type: 'MaterialIcons',
    color: colors.Primary,
  },
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
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewSearch: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.Disable,
  },
  searchBar: {
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 5,
  },
});
