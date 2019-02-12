import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';

interface AppState {
  visibleModal?: number;
  scrollOffset?: number;
  scrollContentsHeight: number;
  fullHeight: number;
  longText: boolean;
}

export default class App extends React.Component<{}, AppState> {
  private scrollViewRef?: ScrollView | null;

  constructor(props: {}) {
    super(props);
    this.state = {
      visibleModal: undefined,
      scrollContentsHeight: 0,
      fullHeight: Dimensions.get('window').height,
      longText: false,
    };
  }

  render() {

    const modalContent = (
      <View
        style={styles.modalContent}
        onLayout={this.onLayout}
      >
        <Text>Hello, I am a Modal.</Text>
        <Button
          title="close"
          onPress={() => this.setState({ visibleModal: undefined })}
        />
      </View>
    );
    const scrollModalContent = (
      <View
        style={styles.scrollModalContent}
        onLayout={this.onLayout}
      >
        {this.state.longText ? (
          <View>
            <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
            <Text>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</Text>
          </View>
        ) : (
          <Text>Hello, I am a Modal.</Text>
        )}
        <Button
          title="close"
          onPress={() => this.setState({ visibleModal: undefined })}
        />
      </View>
    );
    return (
      <View style={styles.container}>
        <Text>react-native-modal-sample</Text>

        <Button title="Default modal" onPress={() => this.setState({ visibleModal: 1 })}/>
        <Button title="Sliding from the sides" onPress={() => this.setState({ visibleModal: 2 })}/>
        <Button title="A slower modal" onPress={() => this.setState({ visibleModal: 3 })}/>
        <Button title="Fancy modal!" onPress={() => this.setState({ visibleModal: 4 })}/>
        <Button title="Bottom half modal" onPress={() => this.setState({ visibleModal: 5 })}/>
        <Button title="Modal that can be closed on backdrop press" onPress={() => this.setState({ visibleModal: 6 })}/>
        <Button title="Swipeable modal" onPress={() => this.setState({ visibleModal: 7 })}/>
        <Button title="Scrollable modal" onPress={() => this.setState({ longText: false, visibleModal: 8 })}/>
        <Button title="Scrollable modal with long text" onPress={() => this.setState({ longText: true, visibleModal: 8 })}/>

        <View>
          <Modal
            isVisible={this.state.visibleModal === 1}
          >
            <View style={{ flex: 1 }}>
              {modalContent}
            </View>
          </Modal>
          <Modal
            isVisible={this.state.visibleModal === 2}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
          >
            {modalContent}
          </Modal>
          <Modal
            isVisible={this.state.visibleModal === 3}
            animationInTiming={2000}
            animationOutTiming={2000}
            backdropTransitionInTiming={2000}
            backdropTransitionOutTiming={2000}
          >
            {modalContent}
          </Modal>
          <Modal
            isVisible={this.state.visibleModal === 4}
            backdropColor={"pink"}
            backdropOpacity={1}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}
          >
            {modalContent}
          </Modal>
          <Modal
            isVisible={this.state.visibleModal === 5}
            style={styles.bottomModal}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}
          >
            {modalContent}
          </Modal>
          <Modal
            isVisible={this.state.visibleModal === 6}
            onBackdropPress={() => this.setState({ visibleModal: undefined })}
          >
            {modalContent}
          </Modal>
          <Modal
            isVisible={this.state.visibleModal === 7}
            onSwipe={() => this.setState({ visibleModal: undefined })}
            swipeDirection="left"
          >
            {modalContent}
          </Modal>
          <Modal
            isVisible={this.state.visibleModal === 8}
            onSwipe={() => this.setState({ visibleModal: undefined })}
            swipeDirection="down"
            scrollOffset={this.state.scrollOffset}
            scrollOffsetMax={this.state.fullHeight - this.state.scrollContentsHeight} // content height - ScrollView height
            scrollTo={this.scrollTo}
            style={styles.bottomModal}
            propagateSwipe={true}
          >
            <View
              style={{ height: this.state.scrollContentsHeight > this.state.fullHeight ? this.state.fullHeight : this.state.scrollContentsHeight }}
            >
              <ScrollView
                ref={ref => (this.scrollViewRef = ref)}
                onScroll={this.onScroll}
                scrollEventThrottle={16}
              >
                {scrollModalContent}
              </ScrollView>
            </View>
          </Modal>
        </View>
      </View>
    );
  }

  private onLayout = (event: LayoutChangeEvent) => {
    this.setState({ scrollContentsHeight: event.nativeEvent.layout.height });
    console.log({ scrollContentsHeight: event.nativeEvent.layout.height, fullHeight: this.state.fullHeight });
  }

  private onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.setState({ scrollOffset: event.nativeEvent.contentOffset.y });
  }

  private scrollTo(event: {}) {
    if (this.scrollViewRef) {
      this.scrollViewRef.scrollTo(event);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  scrollModalContent: {
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: 'lightblue',
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0
  }
});
