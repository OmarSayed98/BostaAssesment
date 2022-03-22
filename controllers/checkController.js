const checkModel = require("../models/checkModel");
const reportStatistics = require("../controllers/reportController");
exports.saveCheck = (check, userId) => {
  return new Promise((resolve, reject) => {
    checkModel.findOne({ url: check.url }).then((foundCheck) => {
      if (foundCheck) {
        return reject("url already added");
      }
      console.log(check);
      check.userId = userId;
      const savedCheck = new checkModel(check);
      savedCheck.userId = userId;
      savedCheck
        .save()
        .then((checkSaved) => {
          reportStatistics
            .saveReportStatistics(checkSaved._id)
            .then((result) => {
              console.log(result);
              resolve("check added");
            })
            .catch((error) => {
              console.error(error);
              reject("failed to save result check");
            });
        })
        .catch((error) => {
          console.log(error);
          reject("failed to save check");
        });
    });
  });
};

exports.updateCheck = (check) => {
  return new Promise((resolve, reject) => {
    checkModel
      .findOneAndUpdate({ url: check.url }, check)
      .then((updatedCheck) => {
        if (!updatedCheck) {
          reject("url doesnt exist");
        }
        console.log(updatedCheck);
        resolve("check updated");
      })
      .catch((error) => {
        console.log(error);
        reject("failed to update check");
      });
  });
};

exports.deleteCheck = (check) => {
  return new Promise((resolve, reject) => {
    checkModel
      .findOneAndDelete({ url: check.url }, check)
      .then((deletedCheck) => {
        if (!deletedCheck) {
          return reject("url doesnt exist");
        }
        reportStatistics
          .deleteReportStatistics(deletedCheck._id)
          .then((result) => {
            resolve("check deleted");
          })
          .catch((error) => {
            console.log(error);
            resolve("failed to delete check result");
          });
      })
      .catch((error) => {
        console.log(error);
        reject("failed to delete check");
      });
  });
};

exports.addTagToCheck = (tagValue, url) => {
  return new Promise((resolve, reject) => {
    checkModel
      .findOneAndUpdate(
        { url: url, tags: { $ne: tagValue } },
        { $push: { tags: tagValue } }
      )
      .then((Check) => {
        if (!Check) {
          reject("url doesnt exist or tag already exist for given url");
        }
        resolve("tag added to check");
      })
      .catch((error) => {
        console.log(error);
        reject("failed to add tag to check");
      });
  });
};
