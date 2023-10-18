const Config = require("../../config/config");
const httpUtility = require("../helpers/httpUtility");
const qs = require("querystring");
// const counsellorModel = require("../../server/counsellor/counsellor.model");

const cmsStatus = Object.freeze({
  Cancelled : "CANCEL"
});

class bookingDataToCMS {
  constructor(doc) {
    this.doc = doc;
    this.httpModule = new httpUtility();
  }

   send(event) {
    return new Promise(async (resolve,reject) => {
      try {
        const data = await this.getDataFromDoc(event);
        const options = await this.getOptionsForURL(event);
        console.log('Data sent to CMS  ---->>>>>>>>', data);
        if(Config.cms_api_key){
          const res = await this.httpModule.post(options, data);
          resolve(res)
        }else
          resolve({})

      } catch (error) {
        console.error("Error in posting booking data to CMS ", error);
        reject(error);
      }
    })
  }

  async getDataFromDoc(event) {
    let obj;
    switch (event) {
      case "booking":
        let context = [];
        let preferredDate = [];
        this.doc.context.map(val => context.push(val.contextId));
        this.doc.preferred_slots.map(val => preferredDate.push(val.dateTime));
        obj = {
          apiKey: Config.cms_api_key,
          uuid: this.doc.user_details+"",
          preferred_slots : preferredDate.join(','),
          booking_Id: this.doc.booking_Id,
          booking_mode: this.doc.booking_mode? this.doc.booking_mode.bookingTypeId:'',
          concern: this.doc.concern?this.doc.concern.concernId:'',
          context: context.join(','),
          context_input :this.doc.context_input,
          location: this.doc.session_location,
          booking_status:this.doc.booking_status,
          audioURL :this.doc.audio_url[0]?this.doc.audio_url[0].url:'',
          appId:this.doc.appId[0],
          source:this.doc.source,
          isCouple : this.doc.is_couple
        };
        break;
      case "cancel":
        obj = {
          apiKey: Config.cms_api_key,
          uuid: this.doc.user_details+"",
          booking_Id:this.doc.booking_Id,
          booking_status: this.doc.booking_status?this.cmsEvent(this.doc.booking_status):'',
          updatedChannel:"App",
          cancellation_reasons:this.doc.cancellation_reasons,
          cancellation_date:this.doc.cancellation_date+"",
          comments:this.doc.comments,
          appId:this.doc.appId[0],
          source:this.doc.source
        };
        break;
    }
    return qs.stringify(obj);
  }

  async getOptionsForURL(event) {
    const path = await this.getPath(event);
    const method = await this.getmethod(event)
    return {
      hostname: Config.cms_url,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
  }

  getPath(event){
    switch (event) {
      case "booking":
         return "/api/integration/booking" ;
        break;
      case "cancel":
        return "/api/integration/bookingstatus";
        break;
    }
  }

  getmethod(event){
    switch (event) {
      case "booking":
        return "POST" ;
        break;
      case "cancel":
        return "POST";
        break;
    }
  }

  cmsEvent(event) {
    switch (event) {
      case "Cancelled":
        return cmsStatus.Cancelled;
        break;
    }
  }

}

module.exports = bookingDataToCMS;
