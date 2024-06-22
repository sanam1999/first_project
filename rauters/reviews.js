const express = require('express');
const router = express.Router({mergeParams: true});
const warpAsync = require("../utils/warpAsync.js")
const { isAuthenticated } = require('../Middleware.js'); 
const {validatereview,isOeviewOwner} = require('../Middleware.js')
const {reviewDelete,reviewCreate} = require('../Controller/reviews.js')

router.delete('/:rid',isAuthenticated,isOeviewOwner, warpAsync(reviewDelete));

router.post('/',  isAuthenticated,validatereview, warpAsync(reviewCreate));

module.exports = router;