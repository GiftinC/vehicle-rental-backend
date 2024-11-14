import Vehicle from "../models/Vehicle.js";

export const createVehicle = async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
};

export const getVehicles = async (req, res) => {
    try {
        const { make, model, year, minPrice, maxPrice } = req.query;
        const filter = {};

        if (make) filter.make = make;
        if (model) filter.model = model;
        if (year) filter.year = year;
        if (minPrice || maxPrice) {
            filter.rentalPrice = {};
            if (minPrice) filter.rentalPrice.$gte = Number(minPrice);
            if (maxPrice) filter.rentalPrice.$lte = Number(maxPrice);
        }

        const vehicles = await Vehicle.find(filter);
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

