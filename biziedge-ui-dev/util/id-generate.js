class IdGenerate {
  generateId(key, facility, product) {
    let x = new Date();
    let id =
      key +
      facility.toUpperCase() +
      x.toISOString().split("T")[0].replace(/-/g, "") +
      x.toLocaleTimeString().replace(/:/g, "").split(" ")[0] +
      product.toUpperCase();

    return id;
  }
}

export default IdGenerate;
