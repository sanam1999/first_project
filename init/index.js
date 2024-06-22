
const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js")
const mongolink = ''
async function main() {
    await mongoose.connect(mongolink);
    console.log("Connection successful");

    await initDB();
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) => ({...obj, owner:'6675b63326539de006e55e87'}))
    await Listing.insertMany(initData.data);
};

main().catch(err => console.log(err));
