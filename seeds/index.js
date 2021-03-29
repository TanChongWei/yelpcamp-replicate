const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Databse connected.');
});

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomPlace = Math.floor(Math.random() * places.length)
        const randomDescriptor = Math.floor(Math.random() * descriptors.length)
        const random1000 = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            //USER ID: BOB
            author: '5fef1187ba14f134d8f08bca',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${descriptors[randomDescriptor]} ${places[randomPlace]}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.Praesentium, dolores saepe.Maiores, modi hic? Rerum ducimus fugit consectetur nemo ipsum illo, quasi magnam quaerat temporibus officia minima at asperiores maiores.',
            price: Math.floor(Math.random() * 20) + 10,
            geometry: {
                type: "Point",
                coordinates: [-113.1331, 47.0202]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhizlmb4s/image/upload/v1609943741/yelpcamp/czaebp1qatfjd7ibuqnw.jpg',
                    filename: 'yelpcamp/czaebp1qatfjd7ibuqnw'
                },
                {
                    url: 'https://res.cloudinary.com/dhizlmb4s/image/upload/v1609943742/yelpcamp/su1qpynd9akxso1pew58.jpg',
                    filename: 'yelpcamp/su1qpynd9akxso1pew58'
                },
                {
                    url: 'https://res.cloudinary.com/dhizlmb4s/image/upload/v1609943744/yelpcamp/bmheocs4torxu2dghebt.jpg',
                    filename: 'yelpcamp/bmheocs4torxu2dghebt'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => db.close())