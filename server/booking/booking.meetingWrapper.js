const Config = require('../../config/config');
const request = require("request");

const Counsellor = require('../counsellor/counsellor.model');
const User = require('../user/user.model');
const Booking=require('./booking.model.js')
const dateFormateUtils = require("../helpers/bookingDateFormatUtils");


class generateLink {
  constructor(req) {
    this.body = req.body;
    console.log(this.body)
  }

  async sendData(event) {
    return new Promise(async (resolve,reject) => {
    
      const dataObj = await this.getDataFromDoc(event);
      const options = await this.getOptionsForURL(event,dataObj);
      request(options, function (error, response) {
        if (!error && response.statusCode == 200) {
          console.log("SUCCESS : " + JSON.stringify(response.body));
          resolve(response.body) ;
        }
        else {
          try{
            console.log("ERROR : " + JSON.stringify(response.body.errors));
          }
          catch(e){
            console.log(e);
          }
          reject(error)
        }
      });
    })
  }

   async getDataFromDoc(event){
    return new Promise(async(resolve,reject)=>{
      try{
        let obj;
        if(event ==='update' || event === 'create'){
        let statusCondition;
        event ==='update' ? statusCondition = { booking_status: "Confirmed" }:statusCondition = { booking_status: "Requested" }
        // if(event === 'update')statusCondition = { booking_status: "Confirmed" };
        // if(event === 'create')statusCondition = { booking_status: "Requested" };
        
       
       
        const bookingID = await Booking.getBookingMongoIdByBookingId(this.body.booking_Id,statusCondition);
        
        const consellorEmail = await Counsellor.getEmail(this.body.counsellor_Id);
        
        const userDetails = await User.getUserDetails(this.body.user_details);
        
        let userEmail = userDetails.account_id.email ? userDetails.account_id.email : "";
        let userName = userDetails.first_name ? userDetails.first_name : 'User';
        let time = await dateFormateUtils(this.body.booking_startTime,"24hrs")
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

         obj = {
          appLink : "N/A",
          bookingID : bookingID,
          user : 'booking@1to1help.net',
          start_time : this.body.booking_startTime,
          end_time : this.body.booking_endTime,
          date : new Date(this.body.booking_startTime).getDate()+" "+months[new Date(this.body.booking_startTime).getMonth()],
          time : time,
          subject : '1to1Help',
          company: "1to1 team",
          name: userName,
          participants : userEmail+","+consellorEmail
        };
        if(event === 'update'){
          obj['event_id'] = this.body.meeting_url  
        }
      }else if(event ==='cancel'){
         obj = {
        
          user : 'booking@1to1help.net',
          comment: this.body.comments,
          event_id:this.body.meeting_url,
          
          
        }

      }
      
        resolve(obj)

      } catch (error){
        reject(error)
      }

    });

  }
//   async cancelMeeting(event){
//     return new Promise(async(resolve,reject)=>{
//     try{
//       let statusCondition;
//       // if(event === 'cancel')statusCondition = { booking_status: "Cancelled" };
//       let obj = {
        
//         user : 'booking@1to1help.net',
//         comment: this.body.comments,
//         event_id:this.body.meeting_url,
        
        
//       }
//       const options = await this.getOptionsForURL(event,obj);
//       request(options, function (error, response) {
//         if (!error && response.statusCode == 200) {
//           console.log("SUCCESS : " + JSON.stringify(response.body));
//           resolve(response.body) ;
//         }
//         else {
//           try{
//             console.log("ERROR : " + JSON.stringify(response.body.errors));
//           }
//           catch(e){
//             console.log(e);
//           }
//           reject(error)
//         }
//       });

//     }catch(error){

//     }

//   })
// }
  

  getOptionsForURL(event,data) {
    switch (event) {
      case "create":
        return {
          url: Config.meeting_url+"/meetings/v2/create",
          method: "POST",
          body:data,
          json: true,
          headers: {
            "Content-Type": "application/json"
          }
        };
        break;
      case "update":
        return {
          url: Config.meeting_url+"/meetings/v2/update",
          method: "POST",
          body:data,
          json: true,
          headers: {
            "Content-Type": "application/json"
          }
        };
        break;
        case "cancel":
          return {
          url: Config.meeting_url+"/meetings/v2/cancel",
          method: "POST",
          body:data,
          json: true,
          headers: {
            "Content-Type": "application/json"
          }

          };
          break;
        
    }
    
  }
}

module.exports = generateLink;
