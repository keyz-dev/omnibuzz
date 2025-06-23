const { Route, Station, Agency, sequelize } = require("../db/models");
const { Op } = require("sequelize");
const { validateRequest } = require("../utils/validation");
const {
    createRouteSchema,
    updateRouteSchema,
} = require("../schemas/routeSchema");

const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};

const { BadRequestError, NotFoundError } = require("../utils/errors");

// @desc    Create a new route
// @route   POST /api/routes/agency
// @access  Private (Agency Admin)
exports.createRoute = catchAsync(async (req, res, next) => {
    try {
        const { error, value } = validateRequest(req.body, createRouteSchema);
        if (error) return next(error);

        const { from, to, distance, estimatedDuration, basePrice, status } = value;
        const agencyId = req.params.agencyId;

        // Check for duplicate route
        const existingRoute = await Route.findOne({
            where: {
                agencyId,
                from,
                to,
            },
        });

        if (existingRoute) {
            return res.status(409).json({ success: false, message: 'A route with the same origin and destination already exists.' });
        }

        const newRoute = await Route.create({
            ...value,
            agencyId,
        });

        res.status(201).json({ success: true, message: 'Route created successfully!', data: newRoute });
    } catch (error) {
        next(error);
    }
});

// @desc    Get agency routes stats
// @route   GET /api/routes/agency/:agencyId/stats
// @access  Private (Agency Admin)
exports.getAgencyRoutesStats = catchAsync(async (req, res, next) => {
    const { agencyId } = req.params;

    const [total, active, inactive] = await Promise.all([
        Route.count({ where: { agencyId } }),
        Route.count({ where: { agencyId, status: "Active" } }),
        Route.count({ where: { agencyId, status: "Inactive" } }),
    ]);

    return res.status(200).json({
        success: true,
        status: "success",
        data: { total, active, inactive },
    });
});

// @desc    Get all routes for an agency
// @route   GET /api/routes/agency
// @access  Private (Agency Admin)
exports.getAgencyRoutes = catchAsync(async (req, res, next) => {
    const { agencyId } = req.params;
    const {
        page = 1,
        limit = 10,
        origin,
        destination,
        status,
        sortBy = "createdAt",
        order = "DESC",
    } = req.query;

    const whereClause = { agencyId };
    if (origin) whereClause["$from.name$"] = origin;
    if (destination) whereClause["$to.name$"] = destination;
    if (status) whereClause.status = status;

    const { count, rows } = await Route.findAndCountAll({
        where: whereClause,
        include: [
            { model: Station, as: "originStation", attributes: ["name", "baseTown"] },
            {
                model: Station,
                as: "destinationStation",
                attributes: ["name", "baseTown"],
            },
        ],
        offset: (page - 1) * limit,
        limit: parseInt(limit),
        order: [[sortBy, order]],
    });

    return res.status(200).json({
        success: true,
        status: "success",
        results: rows.length,
        data: {
            routes: rows,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalRecords: count,
        },
    });
});

// @desc    Get a single route by ID
// @route   GET /api/routes/agency/:id
// @access  Private (Agency Admin)
exports.getRouteById = catchAsync(async (req, res, next) => {
    const route = await Route.findOne({
        where: { id: req.params.id },
        include: [
            { model: Station, as: "originStation" },
            { model: Station, as: "destinationStation" },
        ],
    });

    if (!route) {
        throw new NotFoundError("Route not found");
    }

    return res.status(200).json({ success: true, data: route });
});

// @desc    Update a route
// @route   PUT /api/routes/agency/:id
// @access  Private (Agency Admin)
exports.updateRoute = catchAsync(async (req, res, next) => {
    try {
        const { error, value } = validateRequest(req.body, updateRouteSchema);
        if (error) return next(error);

        const route = await Route.findOne({ where: { id: req.params.id, agencyId: req.params.agencyId } });

        if (!route) {
            return res.status(404).json({ success: false, message: 'Route not found' });
        }

        // Check for duplicate route if origin/destination are being changed
        const { from, to } = value;
        if (from || to) {
            const existingRoute = await Route.findOne({
                where: {
                    id: { [Op.ne]: req.params.id },
                    agencyId: req.params.agencyId,
                    from: from || route.from,
                    to: to || route.to,
                },
            });

            if (existingRoute) {
                return res.status(409).json({ success: false, message: 'Another route with the same origin and destination already exists.' });
            }
        }

        await route.update(value);

        res.status(200).json({ success: true, message: 'Route updated successfully!', data: route });
    } catch (error) {
        next(error);
    }
});

// @desc    Delete a route
// @route   DELETE /api/routes/agency/:id
// @access  Private (Agency Admin)
exports.deleteRoute = catchAsync(async (req, res, next) => {
    const route = await Route.findOne({ where: { id: req.params.id, agencyId: req.params.agencyId } });

    if (!route) {
        throw new NotFoundError("Route not found");
    }

    await route.destroy();

    return res
        .status(200)
        .json({ success: true, message: "Route deleted successfully!" });
});
