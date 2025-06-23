const { Schedule, Route } = require('../db/models');

// Create a new schedule
exports.createSchedule = async (req, res) => {
    try {
        const { routeId, departureTime, frequency, startDate, endDate, busType, activeDays } = req.body;

        // Validate input
        if (!routeId || !departureTime || !frequency || !startDate || !busType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Check if the route exists
        const route = await Route.findByPk(routeId);
        if (!route) {
            return res.status(404).json({ message: 'Route not found' });
        }

        const newSchedule = await Schedule.create({
            routeId,
            departureTime,
            frequency,
            startDate,
            endDate,
            busType,
            activeDays,
        });

        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ message: 'Error creating schedule', error: error.message });
    }
};

// Get all schedules
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [
                {
                    model: Route,
                    as: 'route',
                    attributes: ['from', 'to', 'distance', 'estimatedDuration', 'basePrice'],
                    include: [
                        {
                            model: Station,
                            as: 'from',
                            attributes: ['name', 'baseTown', 'address', 'coordinates'],
                        },
                        {
                            model: Station,
                            as: 'to',
                            attributes: ['name', 'baseTown', 'address', 'coordinates'],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error: error.message });
    }
};
