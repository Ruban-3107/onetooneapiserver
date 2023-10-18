const { v4: uuidv4 } = require('uuid');

 const getuuid = () =>{
    return uuidv4(); 
}

module.exports = getuuid;