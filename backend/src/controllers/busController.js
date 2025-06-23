const { Bus, Agency, Station, sequelize } = require('../db/models');
const { Op } = require('sequelize');
const xlsx = require('xlsx');
const { validateRequest } = require('../utils/validation');
const { createBusSchema } = require('../schemas/busSchema');

// =============================================
//  Agency Admin Controllers
// =============================================

// @desc    Create a new bus
// @route   POST /api/bus/agency
// @access  Private (Agency Admin)
exports.createBus = async (req, res, next) => {
    try {

        const { error, value } = validateRequest(req.body, createBusSchema);
        if (error) return next(error);
        const { plateNumber, busType, capacity, seatLayout, baseStationId, amenities, agencyId } = value;

        const newBus = await Bus.create({
            plateNumber,
            busType,
            capacity,
            seatLayout,
            baseStationId,
            amenities: amenities || [],
            agencyId,
        });

        res.status(201).json({
            success: true,
            message: 'Bus created successfully!',
            data: newBus
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all buses for an agency with filtering
// @route   GET /api/bus/agency
// @access  Private (Agency Admin)
exports.getAgencyBuses = async (req, res, next) => {
    try {
        const { agencyId } = req.params;
        const { page = 1, limit = 5, search, station, type, status } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const whereClause = { agencyId };
        if (search) { whereClause.plateNumber = { [Op.iLike]: `%${search}%` }; }
        if (station) { whereClause.baseStationId = station; }
        if (type) { whereClause.busType = type; }
        if (status) { whereClause.status = status; }

        const { count, rows: buses } = await Bus.findAndCountAll({
            where: whereClause,
            include: [{ model: Station, as: 'baseStation', attributes: ['name'] }],
            limit: parseInt(limit),
            offset: offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            buses,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
            }
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Update a bus
// @route   PUT /api/bus/agency/:id
// @access  Private (Agency Admin)
exports.updateBus = async (req, res, next) => { res.status(501).json({ message: 'Not implemented' }) };

// @desc    Delete a bus
// @route   DELETE /api/bus/agency/:id
// @access  Private (Agency Admin)
exports.deleteBus = async (req, res, next) => { res.status(501).json({ message: 'Not implemented' }) };

// @desc    Bulk import buses
// @route   POST /api/bus/agency/bulk-import
// @access  Private (Agency Admin)
exports.bulkImportBuses = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const agencyId = req.user.agencyId;
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const busesToCreate = [];
    const errors = [];

    for (const [index, row] of data.entries()) {
        const { plateNumber, busType, capacity, seatLayout, baseStationName, status, ...amenities } = row;

        if (!plateNumber || !busType || !capacity || !seatLayout || !baseStationName) {
            errors.push({ row: index + 2, message: 'Missing required fields.' });
            continue;
        }

        try {
            const station = await Station.findOne({ where: { name: baseStationName, agencyId } });

            if (!station) {
                errors.push({ row: index + 2, message: `Station '${baseStationName}' not found.` });
                continue;
            }

            busesToCreate.push({
                plateNumber,
                busType,
                capacity,
                seatLayout,
                status: status || 'Available',
                agencyId,
                baseStationId: station.id,
                amenities: amenities || {},
            });
        } catch (error) {
            errors.push({ row: index + 2, message: `Server error: ${error.message}` });
        }
    }

    if (busesToCreate.length > 0) {
        try {
            await Bus.bulkCreate(busesToCreate, { validate: true });
        } catch (error) {
            next(error);
        }
    }

    const statusCode = errors.length > 0 && busesToCreate.length > 0 ? 207 : (busesToCreate.length > 0 ? 201 : 400);

    return res.status(statusCode).json({
        message: `Successfully imported ${busesToCreate.length} of ${data.length} buses.`,
        successCount: busesToCreate.length,
        errorCount: errors.length,
        errors,
    });
};

// @desc    Get a single bus by ID
// @route   GET /api/bus/agency/:id
// @access  Private (Agency Admin)
exports.getBusById = async (req, res, next) => { res.status(501).json({ message: 'Not implemented' }) };

// =============================================
//  Public Controllers
// =============================================

// @desc    Search for public buses
// @route   GET /api/bus/public/search
// @access  Public
exports.getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, agencyId, busType } = req.query;
        // Only show buses that are part of a route and active
        const whereClause = { status: 'Active' };
        const offset = (page - 1) * limit;

        if (agencyId) whereClause.agencyId = agencyId;
        if (busType) whereClause.busType = busType;

        const { count, rows } = await Bus.findAndCountAll({
            where: whereClause,
            include: [
                { model: Agency, as: 'agency', attributes: ['name', 'logo'] },
                { model: Station, as: 'baseStation', attributes: ['name', 'city'] },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            totalBuses: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            buses: rows,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single bus by ID
// @route   GET /api/bus/public/:id
// @access  Public
exports.getPublicBusById = async (req, res, next) => {
    try {
        const bus = await Bus.findByPk(req.params.id, {
            include: [
                { model: Agency, as: 'agency', attributes: ['name', 'logo'] },
                { model: Station, as: 'baseStation', attributes: ['name', 'city', 'address'] },
            ],
        });

        if (!bus) {
            return res.status(404).json({ message: 'Bus not found' });
        }

        res.status(200).json(bus);
    } catch (error) {
        next(error);
    }
};

// @desc    Get agency bus stats
// @route   GET /api/bus/stats/by-agency/:agencyId
// @access  Private (Agency Admin)
exports.getBusStatsByAgency = async (req, res, next) => {
    try {
        const { agencyId } = req.params;

        // Fetch counts for each status
        const statsResult = await Bus.findAll({
            where: { agencyId },
            attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
            group: ['status']
        });

        // Fetch the total count of all buses
        const totalCount = await Bus.count({ where: { agencyId } });

        // Format the stats into a clean object
        const stats = { total: totalCount, active: 0, available: 0, maintenance: 0, inactive: 0 };
        statsResult.forEach(stat => {
            const statusKey = stat.getDataValue('status').toLowerCase().replace(' under ', ''); // e.g., 'Under Maintenance' -> 'maintenance'
            if (stats.hasOwnProperty(statusKey)) {
                stats[statusKey] = parseInt(stat.getDataValue('count'));
            }
        });

        res.status(200).json({ success: true, stats });

    } catch (error) {
        next(error);
    }
};

// @desc    Bulk insert buses
// @route   POST /api/bus/agency/bulk-insert
// @access  Private (Agency Admin)
exports.bulkInsertBuses = async (req, res, next) => {
    const { agencyId } = req.params;
    const buses = req.body;

    if (!buses || !Array.isArray(buses) || buses.length === 0) {
        return res.status(400).json({ success: false, message: 'No bus data provided.' });
    }

    const transaction = await sequelize.transaction();
    try {
        const busesToCreate = buses.map(bus => ({
            ...bus,
            agencyId: agencyId,
            status: bus.status || 'Available'
        }));

        const createdBuses = await Bus.bulkCreate(busesToCreate, { transaction, validate: true });
        await transaction.commit();

        res.status(201).json({
            success: true,
            message: `${createdBuses.length} buses imported successfully!`,
            data: createdBuses
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};
