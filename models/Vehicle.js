import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    make: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    rentalPrice: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
    },
})

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;