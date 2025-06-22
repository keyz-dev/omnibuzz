const { Route, Station, Agency, sequelize } = require('../db/models');
const { Op } = require('sequelize');
const { validateRequest } = require('../utils/validation');
const { createRouteSchema, updateRouteSchema } = require('../schemas/routeSchema');

// @desc    Create a new route
// @route   POST /api/routes/agency
// @access  Private (Agency Admin)
exports.createRoute = async (req, res, next) => {
    try {
        const { error, value } = validateRequest(req.body, createRouteSchema);
        if (error) return next(error);

        const agencyId = req.user.agencyId;
        const { originStationId, destinationStationId, distance, estimatedDuration, basePrice, status } = value;

        if (originStationId === destinationStationId) {
            return res.status(400).json({ success: false, message: 'Origin and destination stations cannot be the same.' });
        }

        const existingRoute = await Route.findOne({
            where: { agencyId, originStationId, destinationStationId },
        });

        if (existingRoute) {
            return res.status(409).json({ success: false, message: 'This route already exists for your agency.' });
        }

        const newRoute = await Route.create({
            ...value,
            agencyId,
        });

        res.status(201).json({ success: true, message: 'Route created successfully!', data: newRoute });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all routes for an agency
// @route   GET /api/routes/agency
// @access  Private (Agency Admin)
exports.getAgencyRoutes = async (req, res, next) => {
    try {
        const agencyId = req.user.agencyId;
        const { page = 1, limit = 10, search, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const whereClause = { agencyId };
        if (status) {
            whereClause.status = status;
        }

        let includeClause = [
            { model: Station, as: 'originStation', attributes: ['name'] },
            { model: Station, as: 'destinationStation', attributes: ['name'] },
        ];

        if (search) {
            whereClause[Op.or] = [
                { '$originStation.name$': { [Op.iLike]: `%${search}%` } },
                { '$destinationStation.name$': { [Op.iLike]: `%${search}%` } },
            ];
        }

        const { count, rows: routes } = await Route.findAndCountAll({
            where: whereClause,
            include: includeClause,
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            success: true,
            data: routes,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single route by ID
// @route   GET /api/routes/agency/:id
// @access  Private (Agency Admin)
exports.getRouteById = async (req, res, next) => {
    try {
        const route = await Route.findOne({
            where: { id: req.params.id, agencyId: req.user.agencyId },
            include: [
                { model: Station, as: 'originStation' },
                { model: Station, as: 'destinationStation' },
            ],
        });

        if (!route) {
            return res.status(404).json({ success: false, message: 'Route not found' });
        }

        res.status(200).json({ success: true, data: route });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a route
// @route   PUT /api/routes/agency/:id
// @access  Private (Agency Admin)
exports.updateRoute = async (req, res, next) => {
    try {
        const { error, value } = validateRequest(req.body, updateRouteSchema);
        if (error) return next(error);

        const route = await Route.findOne({ where: { id: req.params.id, agencyId: req.user.agencyId } });

        if (!route) {
            return res.status(404).json({ success: false, message: 'Route not found' });
        }

        await route.update(value);

        res.status(200).json({ success: true, message: 'Route updated successfully!', data: route });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a route
// @route   DELETE /api/routes/agency/:id
// @access  Private (Agency Admin)
exports.deleteRoute = async (req, res, next) => {
    try {
        const route = await Route.findOne({ where: { id: req.params.id, agencyId: req.user.agencyId } });

        if (!route) {
            return res.status(404).json({ success: false, message: 'Route not found' });
        }

        await route.destroy();

        res.status(200).json({ success: true, message: 'Route deleted successfully!' });
    } catch (error) {
        next(error);
    }
};
