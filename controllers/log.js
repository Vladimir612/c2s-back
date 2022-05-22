const Admin = require("../models/admin");

const logHR = async (prijavaId, userId) => {
  console.log(userId + " User Id");

  await Admin.updateOne(
    {
      _id: userId,
    },
    {
      $push: {
        izmenio: prijavaId,
      },
    }
  );
};

module.exports = {
  logHR,
};
