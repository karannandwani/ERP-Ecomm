var AccessMatrix = require("../models/access-matrix");

AccessMatrix.find({roleId: {$in: req.user.roleIds}, resource: 'Order'}, (_err, _res) => {
    if(_err) {
      return res.status(500).json(_err);
    }

    if(_res && _res.length > 0) {
      accessMatrixArray = _res;
    } 
    resolve();
  })