var selectedProduct = null;

function setSelectedProduct(s) {
  selectedProduct = s;
}

export function useSelectedProduct(d) {
  if (d) selectedProduct = d;
  return [selectedProduct, setSelectedProduct];
}
