const checkModel = require('../models/checkModel');
const checkResultModel = require('../models/checkResultModel');

exports.getReportStatistics = (searchParameters)=>{
    return new Promise((resolve, reject)=>{
        checkModel.find({$or:{url: searchParameters.url}, tags:{$in: searchParameters.tags}
    }).then(checks=>{
            if(!checks.length){
                reject('tag value doesnt exist');
            }
            let checkReports = [];
            for(let i=0;i<checks.length;i++){
                checkReports.push(checkResultModel.findById(checks[i]._id));
            }
            Promise.all(checkReports).then((results)=>{
                resolve(results);
            });
        }).catch(error=>{
            reject(error);
        });
    });
}

