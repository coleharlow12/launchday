'use strict';
let express   = require('express');
let router    = express.Router();
let location  = require('../controllers/location');

router.route('/api/location')
  .get(location.getLocation);

module.exports = router;
