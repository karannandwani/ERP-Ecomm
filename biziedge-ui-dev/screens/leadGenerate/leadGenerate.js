import React, { useState, useEffect } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { connect } from "react-redux";
import Button from "../../components/common/buttom/button";
import SearchBar from "../../components/common/serchBar/searchBar";
import { fetchLeads } from "../../redux/actions/leads.action";

const GenerateLead = ({ navigation, selectedBusiness, leads, fetchLeads }) => {
  const [selected, setSelected] = useState({});
  useEffect(() => {
    fetchLeads({
      business: selectedBusiness.business._id,
      pageNo: 0,
      pageSize: 15,
    });
  }, [!leads, selectedBusiness]);

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text style={styles.headingText}>Lead List</Text>
        <Button
          style={styles.addLead}
          title={"Add Lead"}
          pressFunc={() => {
            navigation.navigate("create_lead");
          }}
        />
      </View>

      <View style={styles.body}>
        <SearchBar
          renderData={leads}
          onSelection={() => setSelected(childData)}
        ></SearchBar>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  head: {
    // flex: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headingText: {
    fontSize: 28,
    color: "#43425D",
    alignSelf: "center",
  },
  addLead: {
    maxWidth: Platform.OS === "web" ? "22%" : "40%",
    minWidth: Platform.OS === "web" ? 250 : "40%",
  },
  body: {
    flex: 8,
  },
});

const mapStateToProps = ({ selectedBusiness, leads }) => ({
  selectedBusiness,
  leads,
});
export default connect(mapStateToProps, { fetchLeads })(GenerateLead);
