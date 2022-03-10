module.exports = {
  jwtSecret: "saiwin-express",
  db: process.env.MONGO_URI || "mongodb://localhost:27017/SaiWin",
  mail_from: "xxxxx",
  mail_port: 465,
  mail_password: "xxxx",
  mail_smtp_server: "xxxx",
  user_password: process.env.PROD_MODE
    ? Math.random().toString(36).substring(2, 10).toUpperCase()
    : "1234",
  lotPriceChoose: process.env.PRODUCT_PRICE_LOGIC || "LAST_RECEIVED",
};
