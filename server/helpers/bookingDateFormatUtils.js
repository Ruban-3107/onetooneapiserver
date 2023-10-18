
const getBookedDateFormat = (date, type) =>{
  let finalDate;
  const dateObj = new Date(date);
  if(type === 'date'){
    let day = dateObj.getDate();
    if(day < 10){
      day = "0"+day;
    }
    let month = dateObj.getMonth()+1;
    if(month < 10){
      month = "0"+month;
    }
    let year = dateObj.getFullYear();
    finalDate = day+'-'+month+'-'+year;
  }else if(type === 'time'){
    let hour = dateObj.getHours();
    if(hour < 10){
      hour = "0"+hour;
    }
    let minute = dateObj.getMinutes();
    if(minute < 10){
      minute = "0"+minute;
    }
    let seconds = dateObj.getSeconds();
    if(seconds < 10){
      seconds = "0"+seconds;
    }
    finalDate = hour+':'+minute+':'+seconds;
  }else if(type === '24hrs'){
    finalDate = dateObj.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric'})
  }
  return finalDate
}

module.exports = getBookedDateFormat;
