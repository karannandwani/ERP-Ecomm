import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import Button from "../../../components/common/buttom/button";
import moment from "moment";
import { DataTable } from "../../../components/dataTable/dataTable";
import AddModal from "../../../components/addModal/addModal";
import Pipes from "../../../util/pipes";
import { Styles } from "../../../globalStyle";
import { DimensionContext } from "../../../components/dimensionContext";
import FilterComponent from "../../../components/filter/filter";
const PosBills = ({
  navigation,
  selectedFacility,
  bills,
  draftBills,
  selectedBusiness,
}) => {
  const [isDraftModal, setIsDraftModal] = useState(false);
  const headerItems = ["Bill no.", "Date", "Total"];
  const [width, setWidth] = useState(Dimensions.get("window").width - 400);
  const [height, setHeight] = useState(Dimensions.get("window").height);
  const [draftBillList, setDraftBillList] = useState([]);
  const [billList, setBillList] = useState([]);
  const { window } = useContext(DimensionContext);
  let pipe = new Pipes();
  const onChange = ({ window }) => {
    setWidth(window.width - 400);
    setHeight(window.height);
  };

  const [filterConfig, setFilterConfig] = useState({
    type: "date",
    valueKey: "",
    value: `${new Date()}`,
    display: "",
    dependsOn: [],
    order: 0,
    defaultValue: "",
    displayLabel: "Date",
    multiple: false,
  });

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      Dimensions.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      setDraftBillList([
        ...draftBills.filter((x) => x.suppliers === selectedFacility._id),
      ]);
      setBillList([
        ...bills.filter((x) => x.suppliers === selectedFacility._id),
      ]);
    }
  }, [selectedFacility, bills, draftBills]);

  useEffect(() => {
    if (
      selectedBusiness &&
      selectedBusiness?.roles?.find((x) => x.name === "Business") &&
      !selectedFacility
    ) {
      setBillList([...bills.map((x) => x)]);
    }
  }, [selectedBusiness, selectedFacility]);

  const onColumnClickHandler = (data) => {
    navigation.navigate("bill-invoice", {
      billId: data.id,
    });
  };
  const handleCallBackDraft = (data) => {
    setIsDraftModal(false);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        // selectItem(item);
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: "bold",
          marginBottom: 10,
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={[Styles.container]}>
      <View style={{ flexDirection: "column" }}>
        {selectedFacility ? (
          <View
            style={{
              flexDirection: "row-reverse",
            }}
          >
            <View style={{ margin: 5 }}>
              <Button
                style={{ borderRadius: 5 }}
                title={"Create Bill"}
                pressFunc={() => {
                  navigation.navigate("createBill");
                  // Platform.OS === "web"
                  //   ? navigation.navigate("createBill")
                  //   : navigation.navigate("scanProduct");
                }}
              ></Button>
            </View>
            {/* <View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  flexWrap: "wrap",
                  borderColor: "rgb(67, 66, 93)",
                  backgroundColor: "rgb(67, 66, 93)",
                  borderRadius: 5,
                  margin: 5,
                  maxHeight: 32,
                  minWidth: 300,
                }}
              >
                <Text
                  style={{
                    padding: 8,
                    alignSelf: "center",
                    color: "#fff",
                    borderRadius: 5,
                  }}
                >
                  Date
                </Text>
                <FilterComponent
                  type={"date"}
                  filterConfig={{
                    value: filterConfig.value
                      ? new Date(filterConfig.value)
                      : new Date(),
                  }}
                  onFilterChange={(vv) => {
                    setFilterConfig({ ...filterConfig, value: vv.value });
                    setBillList([
                      ...bills
                        .filter((x) => x.suppliers === selectedFacility._id)
                        .filter(
                          (x) =>
                            moment(
                              parseInt(x._id.toString().substring(0, 8), 16) *
                                1000
                            ).format("YYYY-MM-DD") ===
                            moment(vv.value).format("YYYY-MM-DD")
                        ),
                    ]);
                  }}
                />
              </View> 
            </View>*/}
          </View>
        ) : (
          <></>
        )}
        <View
          style={[
            {
              width:
                window.width >= 1040
                  ? window.width - (320 + 20)
                  : window.width - 20,
              minHeight: Math.max(window.height - 84),
              height: Math.max(window.height - 84),
              paddingBottom: 20,
            },
            Styles.tableContainer,
          ]}
        >
          {billList.length > 0 ? (
            <DataTable
              data={billList}
              extractionLogic={({ row, index }) => {
                return [
                  { value: row.id, component: null },
                  {
                    value: row._id
                      ? moment(
                          new Date(
                            parseInt(row._id.toString().substring(0, 8), 16) *
                              1000
                          )
                        ).format("MMMM Do YYYY, h:mm:ss a")
                      : row.createdAt
                      ? moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")
                      : "",
                    component: null,
                  },
                  // { value: formatter.format(row.subTotal), component: null },
                  {
                    value: pipe.formatter.format(row.subTotal),
                    component: null,
                  },
                ];
              }}
              headerStyle={[Styles.headerStyle]}
              cellStyle={[Styles.cellStyle, { padding: 5 }]}
              rowStyle={[Styles.rowStyle]}
              headers={[
                { value: "Order No", minWidth: 100 },
                { value: "Date", minWidth: 200 },
                { value: "Total", minWidth: 500 },
              ]}
              width={
                window.width >= 1040
                  ? window.width - (320 + 20)
                  : window.width - 20
              }
              height={
                Platform.OS === "web"
                  ? Math.max(window.height - 204)
                  : Math.max(window.height - 104)
              }
              onClickColumn={onColumnClickHandler}
            ></DataTable>
          ) : (
            <View
              style={{
                padding: 10,
                height: 40,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                No Data Available...
              </Text>
            </View>
          )}
        </View>
      </View>
      <AddModal
        showModal={isDraftModal}
        onSelection={handleCallBackDraft}
        modalViewStyle={{ maxHeight: "50%", padding: 100 }}
        add={
          <FlatList
            style={{ marginTop: 3, flex: 1 }}
            keyExtractor={(item, index) => item?._id.toString()}
            data={draftBillList}
            renderItem={renderItem}
          />
        }
      ></AddModal>
    </View>
  );
};
const mapStateToProps = ({
  selectedBusiness,
  products,
  bills,
  draftBills,
  selectedFacility,
}) => ({
  selectedBusiness,
  products,
  bills,
  draftBills,
  selectedFacility,
});
export default connect(mapStateToProps)(PosBills);

const styles = StyleSheet.create({
  heading: {
    flex: 1,
    padding: 20,
  },
  card: {
    flex: 1,
  },
});
