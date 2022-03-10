import React from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import SearchIndex from "../../components/common/searchIndex/searchIndex";
import { setSelectedBusiness } from "../../redux/actions/selectedBusiness.action";
import {
  removeNotification,
  clearNotifications,
} from "../../redux/actions/notifications.action";
const BusinessDashboard = ({
  user,
  setSelectedBusiness,
  notifications,
  selectedFacility,
  navigation,
  removeNotification,
  clearNotifications,
}) => {
  const clear = () => {
    clearNotifications({ facility: selectedFacility?._id });
  };
  return (
    <View style={{ flex: 1 }}>
      <SearchIndex
        renderData={notifications?.filter(
          (x) => x.data?.facility === selectedFacility?._id
        )}
        removeNotification={removeNotification}
        clearNotifications={clear}
        navigation={navigation}
      ></SearchIndex>
    </View>
  );
};

const mapStateToProps = ({ user, notifications, selectedFacility }) => ({
  user,
  notifications,
  selectedFacility,
});
export default connect(mapStateToProps, {
  setSelectedBusiness,
  removeNotification,
  clearNotifications,
})(BusinessDashboard);
// import React from "react";
// import { Text, View } from "react-native";
// import { connect } from "react-redux";
// import SearchIndex from "../../components/common/searchIndex/searchIndex";
// import { setSelectedBusiness } from "../../redux/actions/selectedBusiness.action";
// import FilterComponent from "../../components/filter/filter";
// import moment from "moment";
// import PopUp from "../../components/popUp/popUp";
// const BusinessDashboard = ({ user, setSelectedBusiness }) => {
//   return (
//     <View style={{ flex: 1 }}>
//       {/* <SearchIndex style={{ minHeight: 60 }}></SearchIndex> */}
//       <View
//         style={{
//           flex: 1,
//           flexDirection: "row",
//           flexWrap: "wrap",
//           borderColor: "#5794f2",
//           backgroundColor: "#5794f2",
//           borderRadius: 5,
//           margin: 5,
//           maxHeight: 32,
//           minWidth: 300,
//         }}
//       >
//         <Text
//           style={{
//             padding: 8,
//             alignSelf: "center",
//             color: "#fff",
//             borderRadius: 5,
//           }}
//         >
//           Date
//         </Text>
//         <FilterComponent
//           filterConfig={{
//             type: "date",
//             valueKey: "",
//             value: `${new Date()}`,
//             display: "",
//             dependsOn: [],
//             order: 0,
//             defaultValue: "",
//             displayLabel: "Date",
//             multiple: false,
//           }}
//           onFilterChange={(vv) => {
//             console.log(vv)
//             // setVariables({
//             //   ...variables,
//             //   from: {
//             //     type: "dateRange",
//             //     valueKey: "",
//             //     value: vv.value[0],
//             //     display: "",
//             //     dependsOn: [],
//             //     order: 0,
//             //     defaultValue: "",
//             //     displayLabel: "Date",
//             //     multiple: false,
//             //   },
//             //   to: {
//             //     type: "dateRange",
//             //     valueKey: "",
//             //     value: vv.value[1],
//             //     display: "",
//             //     dependsOn: [],
//             //     order: 0,
//             //     defaultValue: "",
//             //     displayLabel: "Date",
//             //     multiple: false,
//             //   },
//             // });
//           }}
//           // variables={variables}
//         />
//       </View>
//     </View>
//   );
// };

// const mapStateToProps = ({ user }) => ({ user });
// export default connect(mapStateToProps, { setSelectedBusiness })(
//   BusinessDashboard
// );
