const checkModel = require('../models/checkModel');

exports.saveCheck = (check)=>{
    return new Promise((resolve, reject)=>{
        const savedCheck = new checkModel(check);
        savedCheck.save().then(()=>{
            resolve('check added');
        }).catch((error)=>{
            console.log(error);
            reject('failed to save check');
        });
    });
}

exports.updateCheck = (check)=>{
    return new Promise((resolve, reject)=>{
        checkModel.findOneAndUpdate({url: check.url}, check).then(updatedCheck=>{
            console.log(updatedCheck);
            resolve('check updated');
        }).catch(error=>{
            console.log(error);
            reject('failed to update check')
        });
    });
}

exports.deleteCheck = (check)=>{
    return new Promise((resolve, reject)=>{
        checkModel.findOneAndDelete({url: check.url}, check).then(deletedCheck=>{
            console.log(deletedCheck);
            resolve('check deleted');
        }).catch(error=>{
            console.log(error);
            reject('failed to delete check');
        });
    });
}