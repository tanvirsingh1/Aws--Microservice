// Please: note this route is only created for the purpose of testing Only.

module.exports = async (req, res,next) => {
  
 
    next(new Error('Simulated internal server error'));
  };