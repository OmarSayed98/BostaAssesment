const checkModel = require('../models/checkModel');

exports.saveCheck = (check) => {
    return new Promise((resolve, reject) => {
        checkModel.findOne({url: check.url}).then((check)=>{
            if(check){
                reject('url already added');
            }
            const savedCheck = new checkModel(check);
            savedCheck.save().then(() => {
                resolve('check added');
            }).catch((error) => {
                console.log(error);
                reject('failed to save check');
            });
        });
    });
}

exports.updateCheck = (check) => {
    return new Promise((resolve, reject) => {
        checkModel.findOneAndUpdate({url: check.url}, check).then(updatedCheck => {
            if(!updatedCheck){
                reject('url doesnt exist');
            }
            console.log(updatedCheck);
            resolve('check updated');
        }).catch(error => {
            console.log(error);
            reject('failed to update check')
        });
    });
}

exports.deleteCheck = (check) => {
    return new Promise((resolve, reject) => {
        checkModel.findOneAndDelete({url: check.url}, check).then(deletedCheck => {
            if(!deletedCheck){
                reject('url doesnt exist');
            }
            console.log(deletedCheck);
            resolve('check deleted');
        }).catch(error => {
            console.log(error);
            reject('failed to delete check');
        });
    });
}

exports.addTagToCheck = (tagValue, url)=>{
    return new Promise((resolve, reject) => {
        checkModel.findOneAndUpdate({url: url, tags: {$ne: tagValue}},{$push: {tags: tagValue}}).then(Check => {
            if(!Check){
                reject('url doesnt exist or tag already exist for given url');
            }
            resolve('tag added to check');
        }).catch(error => {
            console.log(error);
            reject('failed to add tag to check');
        });
    });
}