import React from 'react';

import { View, FlatList, ScrollView } from 'react-native';

class Column extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
    };
  }

  componentDidMount() {
    this.props.rowRepository.addListener(
      this.props.column.id(),
      'reload',
      this.reload.bind(this)
    );
  }

  reload() {
    this.setState({ dataSource: this.data() });
  }

  data() {
    return this.props.rowRepository.items(this.props.column.id());
  }

  rowHasChanged(item1, item2) {
    return item1.row.id !== item2.row.id;
  }

  onLongPress(item) {
    let callback = () => {
      this.reload();
    };
    return this.props.onLongPress(this.props.column.id(), item, callback);
  }

  onPressOut(item) {
    return this.props.onPressOut(item);
  }

  onPress(item) {
    return this.props.onPress(item);
  }

  setItemRef(item, ref) {
    this.props.rowRepository.setItemRef(this.props.column.id(), item, ref);
  }

  updateItemWithLayout(item) {
    return () => {
      this.props.rowRepository.updateItemWithLayout(
        this.props.column.id(),
        item
      );
    };
  }

  setColumnRef(ref) {
    this.props.rowRepository.setColumnRef(this.props.column.id(), ref);
  }

  updateColumnWithLayout() {
    this.props.rowRepository.updateColumnWithLayout(this.props.column.id());
  }

  renderWrapperRow({ item }) {
    let props = {
      onLongPress: this.onLongPress(item),
      onPressOut: this.onPressOut(item),
      onPress: this.onPress(item),
      hidden: item.isHidden(),
      item: item,
    };
    return (
      <View
        ref={(ref) => this.setItemRef(item, ref)}
        onLayout={this.updateItemWithLayout(item)}>
        {this.props.renderWrapperRow(props)}
      </View>
    );
  }

  handleScroll(event) {
    // Needed if simple scroll started, without moving mode
    this.props.onScrollingStarted();

    const column = this.props.rowRepository.column(this.props.column.id());
    const liveOffset = event.nativeEvent.contentOffset.y;
    this.scrollingDown = liveOffset > column.scrollOffset();
  }

  endScrolling(event) {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const column = this.props.rowRepository.column(this.props.column.id());
    const scrollingDownEnded =
      this.scrollingDown && currentOffset >= column.scrollOffset();
    const scrollingUpEnded =
      !this.scrollingDown && currentOffset <= column.scrollOffset();
    if (scrollingDownEnded || scrollingUpEnded) {
      this.props.rowRepository.setScrollOffset(column.id(), currentOffset);
      this.props.rowRepository.updateColumnsLayoutAfterVisibilityChanged();
      this.props.onScrollingEnded();
    }
  }

  onScrollEndDrag(event) {
    this.endScrolling(event);
  }

  onMomentumScrollEnd(event) {
    this.endScrolling(event);
    this.props.onScrollingEnded();
  }

  onContentSizeChange(_, contentHeight) {
    this.props.rowRepository.setContentHeight(
      this.props.column.id(),
      contentHeight
    );
  }

  setListView(ref) {
    this.props.rowRepository.setListView(this.props.column.id(), ref);
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        ref={this.setColumnRef.bind(this)}
        onLayout={this.updateColumnWithLayout.bind(this)}>
        <FlatList
          ref={this.setListView.bind(this)}
          data={this.data()}
          keyExtractor={item => item.id()}
          onScroll={this.handleScroll.bind(this)}
          onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
          onScrollEndDrag={this.onScrollEndDrag.bind(this)}
          renderItem={this.renderWrapperRow.bind(this)}
          scrollEnabled={!this.props.movingMode}
          onContentSizeChange={this.onContentSizeChange.bind(this)}
        />
      </View>
    );
  }
}

export default Column;
