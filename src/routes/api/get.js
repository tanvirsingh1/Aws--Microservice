// src/routes/api/get.js

/**
 * Get a list of fragments for the current user
 */
const { Fragment } = require('../../model/fragment');


const { createSuccessResponse } = require('../../response');
module.exports = async (req, res) => {
  const expand = req.query.expand;
  let frag_list; 

  if (expand == 1) {
    frag_list = await Fragment.byUser(req.user, true);
  } else {
    frag_list = await Fragment.byUser(req.user, false);
  }
 
    createSuccessResponse(
      res.status(200).json({
        status: 'ok',
        fragments: frag_list,
      })
    
    );
  };