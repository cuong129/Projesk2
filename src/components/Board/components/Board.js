import React from 'react';
import _ from 'underscore';
import ReactTimeout from 'react-timeout';
import Column from './Column';
import TaskWrapper from './TaskWrapper';
import DraggableFlatList from 'react-native-draggable-flatlist';

import {
  PanResponder,
  Animated,
  Platform,
  Dimensions,
  FlatList,
  View,
  ScrollView,
} from 'react-native';

const deviceWidth = Dimensions.get('window').width;

class Board extends React.Component {
  MAX_RANGE = 100;
  MAX_DEG = 30;
  TRESHOLD = 100;

  constructor(props) {
    super(props);

    this.verticalOffset = 0;

    this.state = {
      rotate: new Animated.Value(0),
      startingX: 0,
      startingY: 0,
      x: 0,
      y: 0,
      movingMode: false,
      columns: this.props.rowRepository.columns(),
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => this.state.movingMode,
      onMoveShouldSetPanResponder: () => this.state.movingMode,
      onPanResponderTerminationRequest: () => !this.state.movingMode,
      onPanResponderMove: this.onPanResponderMove.bind(this),
      onPanResponderRelease: this.onPanResponderRelease.bind(this),
      onPanResponderTerminate: this.onPanResponderRelease.bind(this),
    });

    this.scrollOffsetBoard = 0;
  }

  onPanResponderMove(evt, gestureState) {
    this.isHasMove = true;
    const leftTopCornerX = this.state.startingX + gestureState.dx;
    const leftTopCornerY = this.state.startingY + gestureState.dy;
    if (this.state.movingMode) {
      const draggedItem = this.state.draggedItem;
      this.x = evt.nativeEvent.pageX;
      this.y = evt.nativeEvent.pageY;

      if (this.x + gestureState.dx < 50 && gestureState.vx < 0) {
        this.scrollOffsetBoard -= 50;
        this.scrollBoard.current
          .getNode()
          .scrollToOffset({offset: this.scrollOffsetBoard});
        this.props.rowRepository.updateColumnsLayoutAfterVisibilityChanged();
      }
      if (this.x + gestureState.dx + 50 > deviceWidth && gestureState.vx > 0) {
        this.scrollOffsetBoard += 50;
        this.scrollBoard.current
          .getNode()
          .scrollToOffset({offset: this.scrollOffsetBoard});
        this.props.rowRepository.updateColumnsLayoutAfterVisibilityChanged();
      }

      const columnAtPosition = this.props.rowRepository.move(
        draggedItem,
        this.x,
        this.y,
      );
      if (columnAtPosition) {
        let {scrolling, offset} = this.props.rowRepository.scrollingPosition(
          columnAtPosition,
          this.x,
          this.y,
        );
        if (this.shouldScroll(scrolling, offset, columnAtPosition)) {
          this.scroll(columnAtPosition, draggedItem, offset);
        }
      }

      this.setState({
        x: leftTopCornerX,
        y: leftTopCornerY,
      });
    }
  }

  shouldScroll(scrolling, offset, column) {
    const placeToScroll =
      (offset < 0 && column.scrollOffset() > 0) ||
      (offset > 0 && column.scrollOffset() < column.contentHeight());

    return scrolling && offset != 0 && placeToScroll;
  }

  onScrollingStarted() {
    this.scrolling = true;
  }

  onScrollingEnded() {
    this.scrolling = false;
  }

  isScrolling() {
    return this.scrolling;
  }

  scroll(column, draggedItem, anOffset) {
    const scrollOffset = column.scrollOffset() + 50 * anOffset;
    this.props.rowRepository.setScrollOffset(column.id(), scrollOffset);
    this.props.rowRepository.updateColumnsLayoutAfterVisibilityChanged();

    column.listView().scrollToOffset({offset: scrollOffset});
  }

  endMoving() {
    this.setState({movingMode: false});
    const {srcColumnId, draggedItem} = this.state;
    const {rowRepository, onDragEnd} = this.props;
    rowRepository.show(draggedItem.columnId(), draggedItem);
    rowRepository.notify(draggedItem.columnId(), 'reload');

    const destColumnId = draggedItem.columnId();
    onDragEnd && onDragEnd(srcColumnId, destColumnId, draggedItem);
  }

  onPanResponderRelease(e, gesture) {
    this.endTouch();
  }

  endTouch() {
    this.x = null;
    this.y = null;
    if (this.state.movingMode) {
      this.rotateBack();
      this.endMoving();
    }
  }

  rotateTo(value) {
    Animated.spring(this.state.rotate, {
      toValue: value,
      duration: 5000,
      useNativeDriver: true,
    }).start();
  }

  rotate() {
    this.rotateTo(this.MAX_DEG);
  }

  rotateBack() {
    this.rotateTo(0);
  }

  open(row) {
    this.props.open(row);
  }

  onLongPress(columnId, item, columnCallback) {
    if (item.isLocked()) {
      return;
    }
    return () => {
      if (!item || (item.isLocked() && this.isScrolling())) {
        return;
      }
      if (!item || !item.layout()) {
        return;
      }
      const {x, y} = item.layout();
      console.log(item.layout());
      this.props.rowRepository.hide(columnId, item);
      this.setState({
        movingMode: true,
        draggedItem: item,
        srcColumnId: item.columnId(),
        startingX: x,
        startingY: y,
        x: x,
        y: y,
      });
      columnCallback();
      this.rotate();
      this.isHasMove = false;
    };
  }

  onPressOut(item) {
    return () => {
      if (!this.isHasMove) this.endTouch();
    };
  }

  onPress(item) {
    if (item.isLocked()) {
      return;
    }

    return () => {
      if (item.isLocked()) {
        return;
      }

      if (!this.state.movingMode) {
        this.open(item.row());
      } else {
        this.endMoving();
      }
    };
  }

  onScrollEnd(event) {
    this.props.rowRepository.updateColumnsLayoutAfterVisibilityChanged();
  }

  movingStyle(zIndex) {
    var interpolatedRotateAnimation = this.state.rotate.interpolate({
      inputRange: [-this.MAX_RANGE, 0, this.MAX_RANGE],
      outputRange: [`-${this.MAX_DEG}deg`, '0deg', `${this.MAX_DEG}deg`],
    });
    return {
      transform: [{rotate: interpolatedRotateAnimation}],
      position: 'absolute',
      zIndex: zIndex,
      top: this.state.y - this.TRESHOLD,
      left: this.verticalOffset + this.state.x,
    };
  }

  movingTask() {
    const {draggedItem, movingMode} = this.state;
    // Without this when you drop a task it's impossible to drag it again...
    // And -1 is really needed for Android
    const zIndex = movingMode ? 1 : -1;
    const data = {
      item: draggedItem,
      hidden: !movingMode,
      style: this.movingStyle(zIndex),
    };
    return this.renderWrapperRow(data);
  }

  renderWrapperRow(data) {
    const {renderRow} = this.props;
    return (
      <TaskWrapper {...data}>
        {renderRow && data.item && renderRow(data.item.row())}
      </TaskWrapper>
    );
  }

  renderColumnWrapper(data) {
    const {renderRow} = this.props;
    return (
      <TaskWrapper {...data}>
        {renderRow && data.item && renderRow(data.item.row())}
      </TaskWrapper>
    );
  }

  render() {
    const columnWrappers = ({item, index, drag, isActive}) => {
      const columnComponent = (
        <Column
          column={item}
          movingMode={this.state.movingMode}
          rowRepository={this.props.rowRepository}
          onLongPress={this.onLongPress.bind(this)}
          onPressOut={this.onPressOut.bind(this)}
          onPress={this.onPress.bind(this)}
          onPanResponderMove={this.onPanResponderMove.bind(this)}
          onPanResponderRelease={this.onPanResponderRelease.bind(this)}
          renderWrapperRow={this.renderWrapperRow.bind(this)}
          onScrollingStarted={this.onScrollingStarted.bind(this)}
          onScrollingEnded={this.onScrollingEnded.bind(this)}
        />
      );
      return this.props.renderColumnWrapper(
        item.data(),
        item.index(),
        columnComponent,
        drag,
      );
    };

    return (
      <View {...this.panResponder.panHandlers} style={{flex: 1, justifyContent:'center'}}>
        {this.movingTask()}
        <DraggableFlatList
          horizontal
          data={this.state.columns}
          renderItem={columnWrappers}
          keyExtractor={item => item.id()}
          onDragEnd={({data}) => {
            this.setState({columns: data});
            this.props.rowRepository.updateColumnsLayoutAfterVisibilityChanged();
          }}
          style={this.props.style}
          onRef={ref => (this.scrollBoard = ref)}
          contentContainerStyle={this.props.contentContainerStyle}
          scrollEnabled={!this.state.movingMode}
          onScrollEndDrag={this.onScrollEnd.bind(this)}
          onMomentumScrollEnd={this.onScrollEnd.bind(this)}
        />
      </View>
    );
  }
}

export default ReactTimeout(Board);
