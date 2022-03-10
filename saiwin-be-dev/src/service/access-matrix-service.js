var AccessMatrix = require("../models/access-matrix");

exports.create = async (req, res) => {
  let _body = req.body;

  AccessMatrix.findOne(
    {
      roleId: _body.roleId,
      resource: _body.resource,
      resourceAttribute: _body.resourceAttribute,
      userAttribute: _body.userAttribute,
    },
    (_err, _res) => { 
      if (_err) {
        console.error(_err);
        return res.status(500).json(_err);
      }

      if (_res) {
        AccessMatrix.findByIdAndDelete(_res._id, (_err_del, _res_del) => {
          if (_err_del) {
            console.error(_err_del);
            return res.status(500).json(_err_del);
          }

          if (_res_del) {
            return res.status(200).json({ message: "Removed" });
          } else {
            return res.status(500).json({ message: "Unable to process" });
          }
        });
      } else {
        let obj = {
          resource: _body.resource,
          roleId: _body.roleId,
          userAttribute: _body.userAttribute,
          resourceAttribute: _body.resourceAttribute,
        };

        let access = new AccessMatrix(obj);

        access.save((_err_save, _res_save) => {
          if (_err_save) {
            return res.status(500).json(_err_save);
          }

          if (_res_save) {
            return res.status(200).json({ message: "Added" });
          } else {
            return res.status(500).json({ message: "Unable to process" });
          }
        });
      }
    }
  );
};
