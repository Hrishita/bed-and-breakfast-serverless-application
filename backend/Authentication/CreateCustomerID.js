exports.handler = async (event) => {
    var name = event.firstName; 
    var curTime = Date.now()
    const customerId = name + curTime; 
    return customerId; 
 };
 