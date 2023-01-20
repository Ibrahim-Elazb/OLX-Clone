const HttpError = require("../util/HttpError");

// @ts-nocheck
const validation = (validationSchema) => {
    return (request, response, next) => {
        const dataSources = ["body", "params", "query","file","headers"];
        const validationErrors = [];
        dataSources.forEach(dataSource => {
            if (validationSchema[dataSource]) {
                const validationResult=validationSchema[dataSource].validate(request[dataSource],{abortEarly:false});
                if(validationResult.error?.details){
                    validationResult.error.details.forEach(item=>{
                        validationErrors.push(item.message)
                    })
                }
                // if(validationResult.error)
                //     validationErrors.push(validationResult.error);
            }
        })
        if(validationErrors.length>0){
            next(new HttpError(400,JSON.stringify(validationErrors)));
        }else{
            next();
        }
    }
}


module.exports = validation;