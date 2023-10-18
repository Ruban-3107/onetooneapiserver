const Employee = require('./employee.model');
const mongoose = require('mongoose');
const getMongoDBID = require('../helpers/mongoDBUtils');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

async function create(req, res, next) {

   const {entityId,phone,email,employee_code} = req.body ;

   try {
     const domainData = await getDomainId({'cmsId': entityId}, "_domain");
     let condition = [] ;
     if (phone) condition.push({'phone':phone});
     if(email) condition.push({'email':email});
     if(employee_code) condition.push({'employee_code':employee_code});
     let query = {$and:[{$or:condition}, {'domain': domainData._id}]};
     let validateData = await Employee.getEmployeeData(query);
     if(validateData){
       console.log("inside validata data--->>>>>:")
       req.body.updatedOn = new Date();

       Employee.updateData(validateData._id,req.body)
         .then(savedemployee => res.json(savedemployee))
         .catch(error => next(error));

     }else{
       const employee = new Employee({
         domain: getMongoDBID(domainData._id),
         phone: req.body.phone ,
         email: req.body.email ,
         employee_code: req.body.employee_code ,
         isActive: req.body.isActive ,
         company_name : domainData.company_name,
         createdOn : new Date()
       });
       employee.save()
         .then(savedemployee => res.json(savedemployee))
         .catch(error => next(error));
     }
   }catch(error){
     next(error)
   }

}


getDomainId = (cmsId,schemaName)=>{
  return new Promise(async (resolve, reject) => {
    let domain;
    const modelName = mongoose.model(schemaName);
    try {
      console.log("get domain---->>>>>>>>>..")
      domain = await modelName.findOne(cmsId).exec();
    } catch (error) {
      reject(error);
    }
    if (domain === undefined || domain === null) {
      reject(new APIError("No entityId exists!", httpStatus.NOT_FOUND));
    } else resolve(domain);
  });


}

module.exports = { create};
