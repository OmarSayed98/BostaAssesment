const cron = require("node-cron");
const checkResultModel = require("../models/checkResultModel");
const checkModel = require("../models/checkModel");
const axios = require("axios");
const https = require("https");
const mailSender = require("../services/emailSender");
const userModel = require("../models/userModel");

axios.interceptors.request.use(
  function (config) {
    config.metadata = { startTime: new Date() };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;
    return response;
  },
  function (error) {
    error.config.metadata.endTime = new Date();
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime;
    return Promise.reject(error);
  }
);
exports.cronJobs = () => {
  checkModel.find({}).then((result) => {
    for (let i = 0; i < result.length; i++) {
      cron.schedule(`*/${result[i].interval} * * * *`, () => {
        checkResultModel
          .findOne({ checkId: result[i]._id })
          .then((checkResult) => {
            if (!checkResult) return;
            axios
              .get(result[i].url, getRequestOptions(result[i]))
              .then((response) => {
                checkResult.numberOfConsecutiveFailures = 0;
                checkResult.uptime += result[i].interval * 60;
                checkResult.numberOfSuccessRequests++;
                checkResult.availability =
                  checkResult.numberOfSuccessRequests /
                  (checkResult.numberOfSuccessRequests + checkResult.outage);
                checkResult.responseTime =
                  (checkResult.responseTime + response.duration) /
                  checkResult.numberOfSuccessRequests;
                if (!checkResult.status) {
                  checkResult.status = true;
                  userModel
                    .findById(result[i].userId)
                    .then((foundUser) => {
                      mailSender
                        .sendMail(
                          `your url ${result[i].url} is now up`,
                          foundUser.email
                        )
                        .then(() => {
                          console.log("email sent");
                          checkResult
                            .save()
                            .then(() => console.log("check result updated"))
                            .catch((error) => console.error(error));
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    })
                    .catch((error) => console.error(error));
                } else {
                  checkResult
                    .save()
                    .then(() => console.log("check result updated"))
                    .catch((error) => console.error(error));
                }
              })
              .catch((error) => {
                checkResult.status = false;
                checkResult.numberOfConsecutiveFailures++;
                checkResult.downtime += result[i].interval * 60;
                checkResult.outage++;
                checkResult.availability =
                  checkResult.numberOfSuccessRequests /
                  (checkResult.numberOfSuccessRequests + checkResult.outage);
                if (
                  checkResult.numberOfConsecutiveFailures >= result[i].threshold
                ) {
                  userModel
                    .findById(result[i].userId)
                    .then((foundUser) => {
                      mailSender
                        .sendMail(
                          `your url ${result[i].url} is down and crossed the threshold`,
                          foundUser.email
                        )
                        .then(() => {
                          console.log("email sent");
                          checkResult.numberOfConsecutiveFailures = 0;
                          checkResult
                            .save()
                            .then(() => console.log("check result updated"))
                            .catch((error) => console.error(error));
                        })
                        .catch((error) => {
                          console.error(error);
                        });
                    })
                    .catch((error) => console.error(error));
                } else {
                  checkResult
                    .save()
                    .then(() => console.log("check result updated"))
                    .catch((error) => console.error(error));
                }
              });
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  });
};

const getRequestOptions = (check) => {
  let options = {
    timeout: check.timeout * 1000,
  };
  if (check.httpHeaders.length !== 0) {
    console.log(check.httpHeaders);
    options.httpHeaders = check.httpHeaders;
  }
  if (check.authentication.username) {
    options.auth = check.authentication;
  }
  if (check.protocol === "HTTPS") {
    options.httAgent = new https.Agent({
      rejectUnauthorized: check.ignoreSSL,
    });
  }
  return options;
};
