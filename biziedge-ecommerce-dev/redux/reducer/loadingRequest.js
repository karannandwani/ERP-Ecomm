const initialState = [];

const get_time_int = function (uuid_str) {
  var uuid_arr = uuid_str.split("-"),
    time_str = [uuid_arr[2].substring(1), uuid_arr[1], uuid_arr[0]].join("");
  return parseInt(time_str, 16);
};

const get_date_obj = function (uuid_str) {
  var int_time = get_time_int(uuid_str) - 122192928000000000,
    int_millisec = Math.floor(int_time / 10000);
  return new Date(int_millisec);
};

const loadingReqs = (state = initialState, action) => {
  switch (action.type) {
    case "LOADING": {
      setTimeout(() => {
        action.asyncDispatch({
          type: "DONE_LOADING",
          payload: action.payload,
        });
      }, 6000);
      return [...state, action.payload];
    }

    case "DONE_LOADING": {
      return state.filter((m) => m && m != action.payload);
    }

    default:
      return state;
  }
};

export default loadingReqs;
