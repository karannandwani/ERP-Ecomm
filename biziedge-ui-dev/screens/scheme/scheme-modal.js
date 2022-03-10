import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Button from "../../components/common/buttom/button";
import InputboxWithBorder from "../../components/common/inputBox/inputBoxWithBorder";
import CheckBox from "../../components/common/checkBox/checkbox";
import PopUp from "../../components/popUp/popUp";
import Icon from "../../components/common/icon";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { addScheme } from "../../redux/actions/scheme.action";
import uuid from "react-native-uuid";

const AddScheme = ({
  onChange,
  selectedBusiness,
  effectVariables,
  schemeVariables,
  navigation,
  addScheme,
  scheme,
}) => {
  const [name, setName] = useState("");
  const [ruleSetList, setRuleSetList] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [active, setActive] = useState(true);
  const [effects, setEffects] = useState([]);
  const [autoApplied, setAutoApplied] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [operators, setOperators] = useState([
    { name: "=" },
    { name: ">=" },
    { name: "<=" },
    { name: "IN" },
    { name: "NOT IN" },
  ]);

  // const scheme = navigation.getParam("scheme", {});
  useEffect(() => {
    setRuleSetList({
      condition: "AND",
      rules: [],
      parent: null,
      id: uuid.v4(),
    });
  }, []);

  // {
  //   rule: [
  //     {
  //       variable: null,
  //       operator: null,
  //       value: null,
  //     },
  //   ],
  // },

  const handleActiveCallback = (checked) => {
    setActive(checked);
  };
  const handleAutoAppliedCallback = (checked) => {
    setAutoApplied(checked);
  };
  const addRuleset = (parent) => {
    setRuleSetList([
      ...ruleSetList,
      [
        {
          variable: null,
          operator: null,
          value: null,
          level: index + 1,
          parent: parent ? 0 : 1,
        },
      ],
    ]);
  };
  const addRule = (index) => {
    setRuleSetList(
      ruleSetList?.map((cond, i) =>
        i === index
          ? [...cond, { variable: null, operator: null, value: null }]
          : cond
      )
    );
  };
  const addToEffect = () => {
    setEffects([...effects, {}]);
  };
  const removeRule = (ruleSetIndex, ruleIndex) => {
    setRuleSetList(
      ruleSetList
        .map((x, rsi) =>
          rsi === ruleSetIndex ? x.map((xx, ii) => ii !== ruleIndex) : rsi
        )
        .filter((x) => x.length > 0)
    );
  };

  const getRuleView = (rules) => {
    return rules.map((x) => (
      <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
        <View style={{ flex: 6,height:40 }}>
          <PopUp
            onSelection={conditionSelected}
            selectionValue={schemeVariables._id}
            renderData={schemeVariables}
            placeholder="Variable"
          ></PopUp>
        </View>
        <View style={{ flex: 4,height:40 }}>
          <PopUp
            onSelection={conditionSelected}
            selectionValue={schemeVariables._id}
            renderData={operators}
            placeholder="Operator"
          ></PopUp>
        </View>
        <TextInput
          style={{
            flex: 4,
            borderColor: "black",
            borderRadius: 1,
          }}
        ></TextInput>
        <TouchableOpacity
          onPress={() => removeRule(index, ruleIndex)}
          style={{
            flex: 2,
            borderRadius: 1,
            borderColor: "black",
          }}
        >
          <Icon name="cross"> </Icon>
        </TouchableOpacity>
      </View>
    ));
  };
  useEffect(() => {
    setName(scheme && scheme.name ? scheme.name : "");
    setConditions(scheme && scheme.conditions ? scheme.conditions : []);
    setActive(scheme ? scheme.active : true);
    setAutoApplied(scheme ? scheme.autoApplied : true);
    setEffects(scheme && scheme.effects ? scheme.effects : []);
  }, [scheme]);

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <Text style={styles.title}>
        {scheme && scheme._id ? "Update Scheme" : "Add Scheme"}
      </Text>
      <View>
        <InputboxWithBorder
          onChangeText={(e) => setName(e)}
          value={name}
          style={{
            borderWidth: 1,
            borderColor: "#E8E9EC",
            fontSize: 14,
            fontWeight: "normal",
          }}
          label="Name"
        ></InputboxWithBorder>
      </View>
      <View style={{ flex: 1, flexDirection: "row", height: "90%" }}>
        <ScrollView style={{ flex: 1, margin: 5 }}>
          <Text style={styles.label}>Conditions</Text>
          <View style={styles.section}>
            <View style={styles.rule_button}>
              <Button pressFunc={() => addRule(0)} title={"Rule +"}></Button>
              <Button
                pressFunc={() => addRuleset(0)}
                title={"Ruleset +"}
              ></Button>
            </View>
            <View>
              <Text>{ruleSetList.condition}</Text>
            </View>
          </View>
        </ScrollView>

        <ScrollView style={{ flex: 1, margin: 5 }}>
          <Text style={styles.label}>Effects</Text>
          <View style={styles.section}>
            <View style={styles.rule_button}>
              <Button
                pressFunc={() => addToEffect()}
                title={"Add Effect"}
              ></Button>
            </View>
          </View>
        </ScrollView>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            marginTop: 20,
            marginLeft: 5,
            flexDirection: "row",
            flex: 1,
          }}
        >
          <CheckBox
            style={styles.checkBox}
            isLabel={true}
            value={true}
            setValue={handleActiveCallback}
            label={"Active"}
          ></CheckBox>
        </View>
        <View
          style={{
            marginTop: 20,
            marginLeft: 5,
            flexDirection: "row",
            flex: 1,
          }}
        >
          <CheckBox
            style={styles.checkBox}
            isLabel={true}
            value={true}
            setValue={handleAutoAppliedCallback}
            label={"Auto Applied"}
          ></CheckBox>
        </View>
      </View>
      <View>
        <Button
          style={{ alignSelf: "center", minWidth: 200 }}
          pressFunc={() => {
            onChange({
              _id: scheme._id,
              name: name,
              query: query,
              selectedBusiness: selectedBusiness,
            });
          }}
          title={
            scheme && scheme._id
              ? "Update Scheme Variable"
              : "Add Scheme Variable"
          }
        ></Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    color: "#43425D",
    marginLeft: 15,
    marginBottom: 30,
  },
  textArea: {
    height: 150,
    borderColor: "#E8E9EC",
    borderWidth: 1,
    fontSize: 14,
    fontWeight: "normal",
  },
  label: {
    fontSize: 18,
    marginBottom: 3,
    color: "#43325D",
    flex: 1,
  },
  checkBox: {
    width: 18,
    minHeight: 20,
    maxHeight: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  section: {
    borderColor: "#E8E9EC",
    borderWidth: 1,
    flex: 14,
  },
  rule_button: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "flex-end",
    minHeight: 70,
    maxHeight: 70,
  },
});

const mapStateToProps = ({
  selectedBusiness,
  effectVariables,
  schemeVariables,
}) => ({
  selectedBusiness,
  effectVariables,
  schemeVariables,
});

export default connect(mapStateToProps, { addScheme })(AddScheme);
