import React, {Component} from 'react';
import {Item, Input, Icon, Text, Content} from 'native-base';
import {View, StyleSheet} from 'react-native';

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: false,
    };
  }

  render() {
    const {search} = this.state;
    const {style, onSearch} = this.props;
    const componentSearch = () => {
      if (search)
        return (
          <View style={styles.searchView}>
            <Icon active name="search" style={styles.iconSearch} />
            <Input autoFocus style={styles.inputStyle} onChangeText={onSearch}/>
            <Icon
              name="close"
              style={styles.iconSearch}
              onPress={() => this.setState({search: false})}
            />
          </View>
        );
      return (
        <View style={styles.container}>
          <Icon
            active
            name="search"
            onPress={() => this.setState({search: true})}
            style={styles.iconSearch}
          />
          <Text
            style={styles.textSearch}
            onPress={() => this.setState({search: true})}>
            Search tasks...
          </Text>
        </View>
      );
    };

    return <View style={style}>{componentSearch()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconSearch: {
    color: '#494949',
    fontSize: 20,
    marginHorizontal: 10,
  },
  textSearch: {
    color: '#494949',
    fontSize: 17,
  },
  searchView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C3C2C8',
    borderRadius: 20,
  },
  inputStyle: {
    fontSize: 15,
    height: 40,
  },
});
