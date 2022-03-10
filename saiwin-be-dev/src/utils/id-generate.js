class IdGenerate {
    generateId(key, facility, product) {
      let x = new Date();
      let id =
        key +
        facility.toUpperCase() +
        x.toISOString().split("T")[0].replaceAll("-", "") +
        x.toLocaleTimeString().replaceAll(":", "").split(" ")[0]
        +
        product.toUpperCase();
  
      return id;
    }
  }
  
  export default IdGenerate;
  