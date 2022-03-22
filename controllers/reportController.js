const checkModel = require('../models/checkModel');
const checkResultModel = require('../models/checkResultModel');

exports.getReportStatistics = (searchParameters)=>{
    return new Promise((resolve, reject)=>{
        checkModel.find({$or:[{url: searchParameters.url}, {tags:{$in: searchParameters.tags}}]
    }).then(checks=>{
            if(!checks.length){
                reject('tag value doesnt exist or url doesnt exist');
            }
            let checkReports = [];
            for(let i=0;i<checks.length;i++){
                checkReports.push(checkResultModel.findOne({checkId:checks[i]._id}));
            }
            Promise.all(checkReports).then((results)=>{
                resolve(results);
            });
        }).catch(error=>{
            reject(error);
        });
    });
}

exports.saveReportStatistics = (checkId)=>{
    return new Promise((resolve, reject)=>{
        const report = new checkResultModel( {checkId: checkId});
        report.save().then(()=>{
            resolve('check result added');
        }).catch(error=>{
            console.error(error);
            reject('failed to save result');
        })
    });
}

exports.deleteReportStatistics = (checkId)=>{
    return new Promise((resolve, reject)=>{
        checkResultModel.findOneAndDelete({checkId: checkId}).then(result=>{
            resolve('chec result deleted');
        }).catch(error=>{
            console.error(error);
            reject('failed to delete result check');
        })
    });
}

