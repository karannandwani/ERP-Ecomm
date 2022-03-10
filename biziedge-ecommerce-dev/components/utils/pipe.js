import "intl";
import "intl/locale-data/jsonp/en";
class Pipe {
  formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  });
}

export default Pipe;
