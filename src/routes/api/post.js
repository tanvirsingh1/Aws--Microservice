const crypto = require('crypto');
const {createSuccessResponse} = require('../../response');
const {createErrorResponse} = require('../../response');
const { Fragment } = require('../../model/fragment');
function generateUUID() {
    return crypto.randomBytes(16).toString('hex');
}

module.exports = async (req, res) => {
   if(!Buffer.isBuffer(req.body))
   {
    res.status(415).json(createErrorResponse(415, "Unsupported Media Type"));
    
   }
   else{

    const newFragment = new Fragment({
        id: generateUUID(),
        ownerId: req.user || null ,
        created: new Date().toISOString(),
        update:new Date().toISOString(),
        type: req.headers['content-type'],
        size: Number(req.headers['content-length']),
      });
      await newFragment.save();
      await newFragment.setData(req.body)
     const location = `${req.protocol}://${req.hostname}:8080/v1${req.url}/${newFragment.id}`;
    res.location(location);

      createSuccessResponse(
        res.status(201).json({
          status: 'ok',
          fragments: {
            id: newFragment.id,
            ownerId: newFragment.ownerId,
            created: newFragment.created,
            update: newFragment.update,
            type: newFragment.type,
            size: newFragment.size,
          }
        })
      )

   }
  };