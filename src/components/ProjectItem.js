import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Card, CardItem, Text, Left, Body} from 'native-base';
import {colors} from '../res/colors';

SetDefaultStyleImage = url => {
  if (url == null) return 'center';
  return 'cover';
};

SetDefaultImage = url => {
  if (url == null) return require('../res/images/ic_app.png');
  return require('../res/images/background.jpg');
};

export default function ProjectItem(props) {
  const {project, onPress} = props;
  return (
    <Card>
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <CardItem cardBody>
          <Image
            source={SetDefaultImage(project.urlBackground)}
            style={{
              height: 150,
              width: null,
              flex: 1,
              backgroundColor: colors.Primary,
            }}
            resizeMode={SetDefaultStyleImage(project.urlBackground)}
          />
        </CardItem>
        <CardItem>
          <Left>
            <Body>
              <Text>{project.name}</Text>
              <Text note>{project.note}</Text>
            </Body>
          </Left>
        </CardItem>
        {/* <CardItem>
        <Left>
          <Button transparent>
            <Icon active name="thumbs-up" />
            <Text>12 Likes</Text>
          </Button>
        </Left>
        <Body>
          <Button transparent>
            <Icon active name="chatbubbles" />
            <Text>4 Comments</Text>
          </Button>
        </Body>
        <Right>
          <Text>11h ago</Text>
        </Right>
      </CardItem> */}
      </TouchableOpacity>
    </Card>
  );
}
