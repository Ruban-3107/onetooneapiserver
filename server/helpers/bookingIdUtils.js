const settingModel = require('../setting/setting.model');

const getBookingId = async () =>{
    return await settingModel.upcoming.findOneAndUpdate({ $and : [{"screen": "upcoming"},{"appId": {$in: ["LEAP"]}}]}, {$inc: {bookingId_sequence : 1}},{new: true })
    .exec()
    .then((response) => {
      if(response)
        return response.bookingId_name + response.bookingId_sequence;

    const err = new APIError('No such setting exists!', httpStatus.NOT_FOUND);
    return Promise.reject(err);
    })
}

module.exports = getBookingId;
