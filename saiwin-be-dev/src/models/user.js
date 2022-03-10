var mongoose = require("mongoose");
var bcrypt = require("bcrypt");

var BusinessRoleMap = mongoose.Schema({
  business: { type: mongoose.Types.ObjectId, ref: "Business", required: true },
  roles: [{ type: mongoose.Types.ObjectId, required: true, ref: "Role" }],
  selected: { type: Boolean, required: true, default: false },
});

var OTPSchema = mongoose.Schema({
  otp: { type: String },
  createdAt: { type: Date },
});

var UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
    sparse: true,
  },
  password: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, index: true, unique: true, sparse: true },
  image: { type: String },
  mimType: { type: String },
  active: { type: Boolean, required: true, default: false },
  facilityId: { type: mongoose.Types.ObjectId, ref: "Facility" },
  address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
  businessRoleMap: { type: [BusinessRoleMap] },
  otp: { type: OTPSchema },
});

UserSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.compareOTP = function (otp, cb) {
  bcrypt.compare(otp, this.otp.otp, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);
