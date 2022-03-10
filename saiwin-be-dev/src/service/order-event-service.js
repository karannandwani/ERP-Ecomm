const {
  orderEvent,
  inventoryEvent,
  ecommerceEvent,
  categoryEvent,
  hsnEvent,
  pricelistEvent,
  manufacturerEvent,
  brandEvent,
} = require("../utils/event-util");
const {
  findAssignedUserByFacility,
} = require("./facility-user-mapping-service");
const { sendNotification } = require("./notification-service");
const { fetchRoleByName } = require("./role-service");
const { findUsersByQuery } = require("./user-service");

exports.orderEventServiceInit = () => {};

orderEvent.on("order-placed-facility", (data) => {
  try {
    if (data.suppliers.facility) {
      findAssignedUserByFacility(data.suppliers.facility).then((result) =>
        sendNotification(
          {
            operation: "FETCH_ORDER",
            navigation: "orderDetails",
            _id: data._id.toString(),
            facility: data.suppliers.facility.toString(),
            message: `New order #${data.orderNo} placed by ${data.facility.name}!`,
            type: "supply",
          },
          result.map((x) => x.user)
        )
      );
    }
  } catch (e) {
    console.error(e);
  }
});

orderEvent.on("order-delivered", (data) => {
  try {
    if (data.suppliers.facility) {
      console.log("delivery1");
      findAssignedUserByFacility(data.suppliers.facility).then((result) =>
        sendNotification(
          {
            message: `Order #${data.orderNo} delivered!`,
            operation: "FETCH_ORDER",
          },
          result.map((x) => x.user)
        )
      );
    }
  } catch (e) {
    console.error(e);
  }
});

inventoryEvent.on("lot-updated", (data) => {
  findAssignedUserByFacility(data.facility).then((result) => {
    sendNotification(
      {
        message: `Inventory updated!`,
        operation: "INVENTORY_REFRESH",
      },
      result.map((x) => x.user)
    );
  });
});

inventoryEvent.on("lot-updated-business", (data) => {
  try {
    fetchRoleByName("Business")
      .then((result) =>
        findUsersByQuery({
          query: {
            "businessRoleMap.business": data.business,
            "businessRoleMap.roles": result._id,
          },
          populate: [],
        })
      )
      .then((result) => {
        sendNotification(
          {
            message: `Inventory updated!`,
            operation: "INVENTORY_REFRESH",
          },
          result.map((x) => x._id)
        );
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
});

orderEvent.on("order-updated", (data) => {
  try {
    findAssignedUserByFacility(data.facility).then((result) => {
      console.log(result);
      sendNotification(
        {
          message: `Order ${data.orderNo} updated!`,
          operation: "FETCH_ORDER",
        },
        result.map((x) => x.user)
      );
    });
  } catch (e) {
    console.error(e);
  }
});

ecommerceEvent.on("order-place", (data) => {
  try {
    findAssignedUserByFacility(data.suppliers).then((result) => {
      sendNotification(
        {
          message: `New Order #${data.orderNo} placed!`,
          operation: "FETCH_ECOM_ORDER",
          navigation: "orderDetails",
          _id: data._id.toString(),
          facility: data.suppliers.toString(),
          type: "ecom",
        },
        result.map((x) => x.user)
      );
    });
  } catch (e) {
    console.error(e);
  }
});

ecommerceEvent.on("update-by-facility", (data) => {
  sendNotification(
    {
      message: `Order #${data.orderNo} ${
        data.operation === "Accept"
          ? " acepted."
          : data.operation === "Reject"
          ? " rejected."
          : data.operation === "Dispatch"
          ? " dispatched for delivery."
          : " OTP generated."
      }`,
      data: data,
      operation: "UPDATE_ORDER",
    },
    [data.createdBy._id]
  );
});

ecommerceEvent.on("delivered", (data) => {
  try {
    findAssignedUserByFacility(data.suppliers._id).then((result) => {
      sendNotification(
        {
          message: `Order #${data.orderNo} delivered!`,
          operation: "FETCH_ECOM_ORDER",
        },
        result.map((x) => x.user)
      );
    });
  } catch (e) {
    console.error(e);
  }
});

categoryEvent.on("new-created", (data) => {
  try {
    fetchRoleByName("Business")
      .then((result) =>
        findUsersByQuery({
          query: {
            "businessRoleMap.business": data.business,
            "businessRoleMap.roles": result._id,
          },
          populate: [],
        })
      )
      .then((result) => {
        sendNotification(
          {
            message: `Category Created!`,
            operation: "CATEGORY_REFRESH",
          },
          result.map((x) => x._id)
        );
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
});

hsnEvent.on("new-created", (data) => {
  try {
    fetchRoleByName("Business")
      .then((result) =>
        findUsersByQuery({
          query: {
            "businessRoleMap.business": data.business,
            "businessRoleMap.roles": result._id,
          },
          populate: [],
        })
      )
      .then((result) => {
        sendNotification(
          {
            message: `HSN Created!`,
            operation: "HSN_REFRESH",
          },
          result.map((x) => x._id)
        );
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
});

pricelistEvent.on("new-created", (data) => {
  try {
    fetchRoleByName("Business")
      .then((result) =>
        findUsersByQuery({
          query: {
            "businessRoleMap.business": data.business,
            "businessRoleMap.roles": result._id,
          },
          populate: [],
        })
      )
      .then((result) => {
        sendNotification(
          {
            message: `Pricelist Group Created!`,
            operation: "PLG_REFRESH",
          },
          result.map((x) => x._id)
        );
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
});

manufacturerEvent.on("new-created", (data) => {
  try {
    fetchRoleByName("Business")
      .then((result) =>
        findUsersByQuery({
          query: {
            "businessRoleMap.business": data.business,
            "businessRoleMap.roles": result._id,
          },
          populate: [],
        })
      )
      .then((result) => {
        sendNotification(
          {
            message: `Manufacturer Created!`,
            operation: "MANUFACTURER_REFRESH",
          },
          result.map((x) => x._id)
        );
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
});

brandEvent.on("new-created", (data) => {
  try {
    fetchRoleByName("Business")
      .then((result) =>
        findUsersByQuery({
          query: {
            "businessRoleMap.business": data.business,
            "businessRoleMap.roles": result._id,
          },
          populate: [],
        })
      )
      .then((result) => {
        sendNotification(
          {
            message: `Brand Created!`,
            operation: "BRAND_REFRESH",
          },
          result.map((x) => x._id)
        );
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.error(e);
  }
});
