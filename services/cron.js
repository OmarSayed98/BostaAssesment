const cron = require('node-cron');
const checkResultModel = require('../models/checkResultModel');
const checkModel = require('../models/checkModel');
const axios = require('axios');
const https = require('https');

axios.interceptors.response.use( x => {
    x.responseTime = new Date().getTime() - x.config.meta.beginTimer;
    return x;
});

exports.cronJobs = ()=>{
    checkModel.find({}).
    then((result)=>{
        for(let i =0;i<result.length;i++){
            cron.schedule(`*/${result[i].interval} * * * *`,()=>{
                checkResultModel.findById(result[i]._id).then((checkResult=>{
                    axios.get(result[i].url, getRequestOptions(result[i])).then((response=>{
                        console.log(response);
                        checkResult.status = true;
                        checkResult.numberOfConsecutiveFailures = 0;
                        checkResult.uptime += result[i].interval*60;
                        checkResult.numberOfSuccessRequests++;
                        checkResult.availability = checkResult.numberOfSuccessRequests / (checkResult.numberOfSuccessRequests + checkResult.outage);
                        checkResult.responseTime = (checkResult.responseTime + response.responseTime) / (checkResult.numberOfSuccessRequests);
                    })).catch(error=>{
                        console.error(error);
                        checkResult.status = false;
                        checkResult.numberOfConsecutiveFailures++;
                        checkResult.downtime += result[i].interval*60;
                        checkResult.outage++;
                        checkResult.availability = checkResult.numberOfSuccessRequests / (checkResult.numberOfSuccessRequests + checkResult.outage);
                    })
                })).catch(error=>{
                    console.error(error);
                })
            });
        }
    });
}


const getRequestOptions = (check)=>{
    let options = {
        timeout: check.timeout * 1000,
    }
    if(check.httpHeaders){
        options.httpHeaders = check.httpHeaders;
    }
    if(check.authentication){
        options.auth = check.authentication;
    }
    if(check.protocol === 'HTTPS'){
        options.httAgent = new https.Agent({
            rejectUnauthorized: check.ignoreSSL
        });
    }
    return options;
}

