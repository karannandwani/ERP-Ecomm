export const resolvePath = (...paths) =>
  "/" +
  paths
    .join("/")
    .split("/")
    .filter((part) => part && part !== ".")
    .join("/");

// Wrap function to support both Promise and callback
export const withCallback = async (callback, func) => {
  try {
    const result = await func();
    if (callback) callback(null, result);
    return result;
  } catch (err) {
    if (callback) callback(err);
    else throw err;
  }
};
