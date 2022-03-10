const navigateOnSuccessMiddleware = (store) => (next) => (action) => {
  const res = next(action);
  if (
    action.type &&
    action.type.endsWith("SUCCESS") &&
    action.meta.previousAction.navigate &&
    isFunction(action.meta.previousAction.navigate)
  ) {
    action.meta.previousAction.navigate();
  }
  return res;
};

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === "[object Function]"
  );
}

export default navigateOnSuccessMiddleware;
