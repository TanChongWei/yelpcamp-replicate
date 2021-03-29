const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({}).populate('images');
    console.log(campgrounds[0].images.length)
    res.render('campgrounds/index', { campgrounds })
};

module.exports.campgroundForm = async (req, res, next) => {
    res.render('campgrounds/new')
};

module.exports.newCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id
    await camp.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`campgrounds/${camp.id}`)
};

module.exports.showCampground = async (req, res, next) => {
    const { id } = req.params
    const campgrounds = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campgrounds) {
        req.flash('error', 'Unable to find campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campgrounds })
};

module.exports.editCampgroundForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Unable to find campground');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let file of req.body.deleteImages) {
            await cloudinary.uploader.destroy(file);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save()
    req.flash('success', 'Successfully edited campground!')
    res.redirect(`/campgrounds/${campground.id}`)
};

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Campground deleted.')
    res.redirect('/campgrounds')
};