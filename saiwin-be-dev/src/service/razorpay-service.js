const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: process.env.RAZOR_PAY_KEY_ID || "rzp_test_91J1HpwqzmPsxE",
  key_secret: process.env.RAZOR_PAY_SECRET || "C3mxayDSoQwSjydDpz2mx4n0",
});

exports.createRazorPayOrder = async (amount, currency, receipt, notes) => {
  let amt = Number(amount * 100).toFixed(2);
  return new Promise((resolve, reject) => {
    instance.orders.create(
      { amount: Number(amt), currency, receipt, notes },
      (err, order) => {
        if (err || !order) {
          reject(err);
        } else {
          resolve(order);
        }
      }
    );
  });
};
