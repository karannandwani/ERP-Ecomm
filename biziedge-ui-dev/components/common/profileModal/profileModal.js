import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import Icon from "../icon";
import Modal from "../modal/modal";
const profileModal = ({ showModal, onSelection }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    onSelection(false);
    setModalVisible(true);
  };
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        presentationStyle="overFullScreen"
        visible={showModal}
        onRequestClose={() => {
          closeModal();
        }}
        ariaHideApp={false}
      >
        <TouchableWithoutFeedback onPress={() => closeModal()}>
          <View
            style={{
              height: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
              //   marginTop: 22,
              backgroundColor: "rgba(0,0,0,0.00)",
            }}
          >
            <TouchableOpacity style={{ alignSelf: "flex-end" }}>
              <ScrollView nestedScrollEnabled={true} style={styles.modalView}>
                <Text>dvfvvfdvv</Text>
              </ScrollView>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalView: {
    maxHeight: 400,
    minHeight: 400,
    maxWidth: 300,
    minWidth: 300,
    backgroundColor: "#FFFFFF",

    borderRadius: 8,
    marginTop: 20,
    borderWidth: 3,
    borderColor: "#DFE0E3",
    marginRight: 20,
  },
});
export default profileModal;
