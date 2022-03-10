import React, { useState } from "react";
import Modal from "../modal/modal";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ScrollView,
  Platform,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import Icon from "../common/icon";

const ModalView = ({ showModal, onSelection, modalViewStyle, add }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const size = useWindowDimensions();

  const closeModal = () => {
    setModalVisible(false);
    onSelection(false);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
      animationIn="slideInUp"
      visible={showModal}
      onRequestClose={() => {
        closeModal();
      }}
      ariaHideApp={false}
      style={{
        backgroundColor: "white",
      }}
    >
      <TouchableWithoutFeedback onPress={() => closeModal()}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View>
              <View
                nestedScrollEnabled={true}
                style={[styles.modalView, modalViewStyle]}
              >
                {add ? add : <></>}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalView: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DFE0E3",
  },
});
export default ModalView;
