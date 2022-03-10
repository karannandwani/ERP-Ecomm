import React, { useEffect, useState, useContext } from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { connect } from "react-redux";
import PopUp from "../../components/popUp/popUp";
import {
  fetchAction,
  fetchPolicies,
  fetchResources,
  createPolicy,
  removePolicy,
} from "../../redux/actions/policies.action";
import { fetchRoles } from "../../redux/actions/role.action";
import Checkbox from "../../components/common/checkBox/checkbox";
import { Styles } from "../../globalStyle";
import { DimensionContext } from "../../components/dimensionContext";

const PolicyMatrix = ({
  selectedBusiness,
  resourcesData,
  actions,
  policySet,
  selectedRoleId,
  onCheckClick,
  removePolicies,
}) => {
  const [policyMatrix, setPolicyMatrix] = useState([]);
  useEffect(() => {
    setPolicyMatrix(policySet);
  }, [policySet]);

  return (
    <ScrollView
      scrollEnabled={true}
      style={{
        flex: 1,
        height: "100%",
        width: "100%",
      }}
    >
      {resourcesData.map((resource, rIndex) => {
        return (
          <View
            key={`id-${resource + rIndex}`}
            style={{ flex: 1, flexDirection: "row" }}
          >
            {actions.map((actionItem, aIndex) => {
              return (
                <View
                  key={`ida-${actionItem + aIndex}`}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    padding: 5,
                    alignItems: "center",
                    borderColor: "gray",
                    justifyContent: "center",
                    borderLeftWidth: aIndex === 0 ? 1 : 0,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth:
                      rIndex === resourcesData.length - 1 ? 1 : 0,
                    backgroundColor: rIndex === 0 ? "rgb(67, 66, 93)" : "#fff",
                  }}
                >
                  <View style={{ flexShrink: 1 }}>
                    {rIndex === 0 ? (
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        {actionItem}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                  <View style={{ flexShrink: 1 }}>
                    {aIndex === 0 && rIndex > 0 ? (
                      <Text style={{ color: "rgb(67, 66, 93)" }}>
                        {resource}
                      </Text>
                    ) : (
                      <></>
                    )}
                  </View>
                  <View style={{ flexShrink: 1 }}>
                    {rIndex !== 0 && aIndex !== 0 ? (
                      <Checkbox
                        value={
                          policyMatrix.findIndex(
                            (pm) =>
                              pm.action === actionItem &&
                              pm.resource === resource
                          ) > -1
                        }
                        setValue={() => {
                          let policyExists = policyMatrix.findIndex(
                            (pm) =>
                              pm.action === actionItem &&
                              pm.resource === resource
                          );
                          if (policyExists > -1) {
                            removePolicies(policyMatrix[policyExists]._id);
                            let x = policyMatrix.filter(
                              (p, i) => i != policyExists
                            );
                            setPolicyMatrix(x);
                          } else {
                            let y = [
                              ...policyMatrix,
                              {
                                resource: resource,
                                action: actionItem,
                                roleId: selectedRoleId,
                              },
                            ];
                            setPolicyMatrix(y);
                            onCheckClick({
                              resource: [resource],
                              action: [actionItem],
                              roleId: selectedRoleId,
                              businessId: selectedBusiness.business._id,
                            });
                          }
                        }}
                      ></Checkbox>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </ScrollView>
  );
};

function Policies({
  fetchPolicies,
  fetchRoles,
  roles,
  selectedBusiness,
  policies,
  fetchAction,
  actions,
  fetchResources,
  resources,
  createPolicy,
  removePolicy,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const arrayRole = ["Resource", "Create", "Update", "View", "Delete"];
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const { window } = useContext(DimensionContext);
  useEffect(() => {
    fetchRoles();
  }, [!roles]);

  useEffect(() => {
    fetchPolicies(selectedBusiness.business._id);
  }, [selectedBusiness]);

  useEffect(() => {
    fetchAction();
  }, []);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    onSelectionChange(roles[0]);
  }, [roles]);

  const onSelectionChange = (data, p) => {
    setSelectedRoleId(data?._id);
    setModalVisible(false);
  };

  const submitPolicies = (data) => {
    createPolicy(data);
  };

  const removePolicies = (id) => {
    removePolicy(id);
  };

  return (
    <View style={[Styles.MainContainer]}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.h1}>
          <View style={[{ maxwidth: 200, minWidth: 200 }]}>
            <PopUp
              renderData={roles}
              onSelection={(data) => {
                setSelectedRoleId(data?._id);
                setModalVisible(false);
              }}
              containerStyle={{
                backgroundColor: "#fff",
              }}
              placeholder={"Select Role"}
              selectionValue={roles && roles[0] ? roles[0] : []}
              visible={modalVisible}
              style={{
                borderWidth: 1,
                borderColor: "#E8E9EC",
                padding: 8,
                borderRadius: 5,
              }}
            ></PopUp>
          </View>
        </Text>
      </View>
      <View
        style={{
          padding: 20,
          maxHeight: window.height - 200,
          minHeight: window.height - 200,
        }}
      >
        <PolicyMatrix
          resourcesData={resources}
          removePolicies={removePolicies}
          actions={arrayRole}
          policySet={
            policies && policies[selectedRoleId] ? policies[selectedRoleId] : []
          }
          selectedRoleId={selectedRoleId}
          onCheckClick={submitPolicies}
          selectedBusiness={selectedBusiness}
        ></PolicyMatrix>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

const mapStateToProps = ({
  roles,
  selectedBusiness,
  policies,
  actions,
  resources,
}) => ({ roles, selectedBusiness, policies, actions, resources });

export default connect(mapStateToProps, {
  fetchRoles,
  fetchPolicies,
  fetchAction,
  fetchResources,
  createPolicy,
  removePolicy,
})(Policies);
