import React from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Card, CardItem, Text, Left, Body} from 'native-base';
import {colors} from '../res/colors';

export default function ProjectItem(props) {
  const {project, onPress, SetSourceImage, SetResizeModeImage} = props;
  return (
    <Card>
      <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
        <CardItem cardBody>
          <Image
            source={SetSourceImage}
            style={{
              height: 150,
              width: null,
              flex: 1,
              backgroundColor: colors.Primary,
            }}
            resizeMode={SetResizeModeImage}
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
