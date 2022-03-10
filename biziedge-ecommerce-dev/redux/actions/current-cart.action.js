export const setCurrentCart = (cart) => ({
  type: "CURRENT_CART",
  payload: {
    data: cart ?? null,
  },
});
