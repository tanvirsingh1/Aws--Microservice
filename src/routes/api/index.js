// src/routes/api/index.js

/**
 * The main entry-point for the v1 version of the fragments API.
 */
const express = require('express');
const { Fragment } = require('../../model/fragment');
// Create a router on which to mount our API endpoints
const router = express.Router();

// Define our first route, which will be: GET /v1/fragments
router.get('/fragments', require('./get'));
//This is just a test route
router.get('/fragments/tanvir', require('./gettest'));
////
router.get('/fragments/:id', require('./getId'));

router.get('/fragments/:id/info', require('./getIdInfo.js'));
// Support sending various Content-Types on the body up to 5M in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      // See if we can parse this content type. If we can, `req.body` will be
      // a Buffer (e.g., `Buffer.isBuffer(req.body) === true`). If not, `req.body`
      // will be equal to an empty Object `{}` and `Buffer.isBuffer(req.body) === false`
      const  type  = req.headers['content-type'];
    
      console.log(`Content type from request: ${req.headers['content-type']}`);

      return Fragment.isSupportedType(type);
    },
  });

// Use a raw body parser for POST, which will give a `Buffer` Object or `{}` at `req.body`
// You can use Buffer.isBuffer(req.body) to test if it was parsed by the raw body parser.
router.post('/fragments', rawBody(), require('./post'));

router.put('/fragments/:id', rawBody(), require('./put'));
// Other routes will go here later on...

router.delete('/fragments/:id', require('./delete'))

module.exports = router;