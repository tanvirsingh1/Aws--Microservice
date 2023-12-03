const { Fragment } = require('../../model/fragment');


const { createSuccessResponse, createErrorResponse } = require('../../response');

module.exports = async (req, res) => {
    let id = req.params.id; 
try{
    await Fragment.delete(req.user, id);
   return  createSuccessResponse(res.status(200).json({
        status: 'ok',
        message: 'Successfully deleted the Fragment',
      }))
}catch (error) {
    console.error("Error deleting fragment:", error);
    createErrorResponse( res.status(404).json({
        status: 'error',
        message: error.message, // Send the error message from the server
      }));
  }

    };