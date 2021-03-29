const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync')
const { validateCampground, isLoggedIn, isAuthor } = require('../utilities/middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary'); //node automatically looks for an index.js file in the folder
const upload = multer({ storage });

router.get('/new', isLoggedIn, catchAsync(campgrounds.campgroundForm))
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampgroundForm))

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('images'), validateCampground, catchAsync(campgrounds.newCampground))

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;