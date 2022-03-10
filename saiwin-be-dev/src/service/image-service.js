var sharp = require("sharp");

exports.resizeImage = async (image) =>
  new Promise((resolve, reject) => {
    try {
      if (!image) {
        resolve({ mimType: null, image: null });
      } else {
        let response = {};
        let imgParts = image.split(";");
        response.mimType = imgParts[0].split(":")[1];
        let imgData = imgParts[1].split(",")[1];
        sharp(Buffer.alloc(imgData.length, imgData, "base64"))
          .resize(320, 240)
          .jpeg({ quality: 70, progressive: true, force: true })
          .toBuffer()
          .then((data) => {
            resolve({ ...response, image: data.toString("base64") });
          })
          .catch((error) => {
            console.error(error);
            reject({
              message: "Image error",
            });
          });
      }
    } catch (e) {
      reject(e);
    }
  });
