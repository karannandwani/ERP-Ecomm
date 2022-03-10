import React, { useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { connect } from "react-redux";

import { doneLoading } from "../../redux/actions/loading.action";

const Loader = ({ loadingReqs, doneLoading }) => {
  useEffect(() => {
    loadingReqs.forEach((l) => {
      setTimeout(() => {
        doneLoading(l);
      }, 6000);
    });
  }, [loadingReqs]);

  return loadingReqs.length > 0 ? (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#00000080",
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#FFD500" />
      <Text style={{ color: "#ffffff", marginTop: 10 }}>Loading...</Text>
    </View>
  ) : (
    <></>
  );
};

const mapStateToProps = ({ loadingReqs }) => ({ loadingReqs });

export default connect(mapStateToProps, { doneLoading })(Loader);
