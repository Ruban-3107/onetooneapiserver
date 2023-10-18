const Config = require("../../config/config");
const httpUtility = require("../helpers/httpUtility");
const qs = require("querystring");
const _user = require("./user.model");
class userDataToCMS {
  constructor(doc) {
    this.doc = doc;
    this.httpModule = new httpUtility();

    if(this.doc.account_id.email)this.doc.userAuthType = "email";
    if(this.doc.account_id.employee_code)this.doc.userAuthType = "employee_code";
    if(this.doc.account_id.qr_code)this.doc.userAuthType = "qr_code"
  }

  send() {
    return new Promise(async (resolve,reject) => {
      const data = this.getDataFromDoc();
      const options = this.getOptionsForURL();
      try {
        console.log("cms data -->>>",data)
        const res = await this.httpModule.post(options, data);
        resolve(res)

      } catch (error) {
        console.error("Error in posting user data to CMS ", error);
        reject(error);
      }
    })

  }

  getDataFromDoc() {
    console.log("Data ", JSON.stringify(this.doc));
    return qs.stringify({
      apiKey: Config.cms_api_key,
      entityId: this.doc.account_id.domain.cmsId,
      uuid: this.doc._id.toString(),
      firstname: this.doc.first_name? this.doc.first_name.split(" ")[0]
        : this.doc.first_name,
      lastname: this.doc.first_name ? this.doc.first_name.split(" ")[1]
        : "",
      userName: "",
      email: this.doc.account_id.email,
      employee_code : this.doc.account_id.employee_code?this.doc.account_id.employee_code:"",
      qr_code : this.doc.account_id.qr_code?this.doc.account_id.qr_code:"",
      isActive:this.doc.account_id.activated,
      phone:this.doc.account_id.phone,
      gender: this.doc.gender,
      language: this.doc.language? this.doc.language[0] : '',
      location: this.doc.location,
      source:"App",
      birthYear : this.doc.birthdate?this.doc.birthdate:'',
      relationshipStatus : this.doc.relationship_status?this.doc.relationship_status:'',
      authenticationType: this.doc.userAuthType,
      userAccountType : this.doc.account_id.accountType,
      appId :this.doc.appId[0]
    });
  }

  getOptionsForURL() {
    return {
      hostname: Config.cms_url,
      path: "/api/integration/adduser",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
  }
}

module.exports = userDataToCMS;
