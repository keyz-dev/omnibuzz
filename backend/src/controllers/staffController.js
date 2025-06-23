const { StationWorker, User, Station, Agency } = require("../db/models");
const { Op } = require("sequelize");
const { validateRequest } = require("../utils/validation");
const {
    assignWorkerSchema,
    updateWorkerSchema,
} = require("../schemas/stationWorkerSchema");
const { ValidationError } = require("../utils/errors");
const { generateToken } = require("../utils/jwt");
const emailService = require("../services/emailService");

class StaffController {
    // get all staff

    // Get all staff for an agency
    async getAllByAgency(req, res, next) {
        try {
            const { agencyId } = req.params;
            const { page = 1, limit = 10, search, role, status } = req.query;

            const offset = (page - 1) * limit;
            const where = {};

            if (role) where.role = role;
            if (status) where.isActive = status === "Active";

            const userWhere = {};
            if (search) {
                userWhere[Op.or] = [
                    { fullName: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                ];
            }

            const { count, rows: workers } = await StationWorker.findAndCountAll({
                where,
                include: [
                    {
                        model: User,
                        as: "user",
                        where: userWhere,
                        attributes: ["id", "fullName", "email", "phone", "avatar"],
                    },
                    {
                        model: Station,
                        as: "station",
                        where: { agencyId },
                        attributes: ["id", "name"],
                    },
                ],
                limit: parseInt(limit),
                offset: parseInt(offset),
                order: [["createdAt", "DESC"]],
            });

            res.json({
                success: true,
                data: workers,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get staff statistics for an agency
    async getStats(req, res, next) {
        try {
            const { agencyId } = req.params;
            const countOptions = (role) => ({
                where: role ? { role } : {},
                include: [{ model: Station, as: "station", where: { agencyId } }],
            });

            const [total, stationManagers, ticketAgents] = await Promise.all([
                StationWorker.count(countOptions()),
                StationWorker.count(countOptions("station_manager")),
                StationWorker.count(countOptions("ticket_agent")),
            ]);

            res.json({
                success: true,
                data: { total, stationManagers, ticketAgents },
            });
        } catch (error) {
            next(error);
        }
    }

    // Create a new staff member (invite)
    async create(req, res, next) {
        // Assign a worker to a station
        try {
            const { error, value } = validateRequest(req.body, assignWorkerSchema);

            if (error) {
                throw new ValidationError(error.details[0].message);
            }

            const { stationId, fullName, email, role, phone } = value;

            // Check if station exists
            const station = await Station.findByPk(stationId, {
                include: [
                    {
                        model: Agency,
                        as: "agency",
                        include: [{ model: User, as: "owner" }],
                    },
                ],
            });

            if (!station) {
                throw new ValidationError("Station not found");
            }
            // Check if user already exists
            let user = await User.findOne({ where: { email } });
            let existingWorker = null;
            if (user) {
                // Check if user is already assigned to this station
                existingWorker = await StationWorker.findOne({
                    where: { stationId, userId: user.id },
                });

                if (existingWorker) {
                    // Verify the user's role
                    if (user.role == role) {
                        throw new ValidationError(
                            `${user.fullName} is already assigned to this station as the manager`
                        );
                    }
                }
                // update user role
                await user.update({ role });
            } else {
                user = await User.create({
                    email,
                    fullName,
                    phone,
                    role,
                    isActive: false,
                });
            }

            // Generate invitation token, signed with the user's email
            const invitationToken = generateToken({ userId: user.id, email }, "1d");
            const invitationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

            // Create station worker record
            const worker = existingWorker || new StationWorker();
            if (!existingWorker) {
                worker.stationId = stationId;
                worker.userId = user.id;
                worker.role = role;
                worker.isActive = false;
                worker.invitationToken = invitationToken;
                worker.invitationExpires = invitationExpiresAt;
                worker.invitedBy = req.user.id;
            }
            await worker.save();

            // Send invitation email
            await emailService.sendEmail({
                to: email,
                subject: "You've been invited to join OmniBuzz",
                template: "staffInvitation",
                data: {
                    name: user.fullName,
                    role,
                    stationName: station.name,
                    invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?token=${worker.invitationToken}`,
                },
            });

            res.status(201).json({
                success: true,
                message: "Worker assigned successfully. Invitation sent.",
                data: {
                    worker: {
                        id: worker.id,
                        email,
                        fullName,
                        role,
                        status: worker.status,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // Update a staff member
    async update(req, res, next) {
        try {
            const { error, value } = validateRequest(req.body, updateWorkerSchema);
            if (error) throw new ValidationError(error.details[0].message);

            const { workerId } = req.params;
            const worker = await StationWorker.findByPk(workerId);
            if (!worker)
                return res
                    .status(404)
                    .json({ success: false, message: "Staff member not found." });

            // Authorization check can be added here if needed

            await worker.update(value);
            res.json({
                success: true,
                message: "Staff member updated successfully.",
                data: worker,
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete a staff member
    async remove(req, res, next) {
        try {
            const { workerId } = req.params;
            const worker = await StationWorker.findByPk(workerId);
            if (!worker)
                return res
                    .status(404)
                    .json({ success: false, message: "Staff member not found." });

            // Authorization check can be added here if needed

            await worker.destroy();
            res.json({
                success: true,
                message: "Staff member deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    }

    // Resend invitation
    async resendInvite(req, res, next) {
        try {
            const { workerId } = req.params;
            const worker = await StationWorker.findByPk(workerId, {
                include: [
                    { model: User, as: "user" },
                    { model: Station, as: "station" },
                ],
            });

            if (!worker)
                return res
                    .status(404)
                    .json({ success: false, message: "Staff member not found." });
            if (worker.isActive)
                return res
                    .status(400)
                    .json({
                        success: false,
                        message: "This staff member is already active.",
                    });

            // Authorization check can be added here if needed

            worker.invitationToken = generateToken(
                { userId: worker.userId, email: worker.user.email },
                "1d"
            );
            worker.invitationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
            await worker.save();

            await emailService.sendEmail({
                to: worker.user.email,
                subject: "Invitation to Join OmniBuzz (Resent)",
                template: "staffInvitation",
                data: {
                    name: worker.user.fullName,
                    role: worker.role,
                    stationName: worker.station.name,
                    invitationLink: `${process.env.FRONTEND_URL}/accept-invitation?token=${worker.invitationToken}`,
                },
            });

            res.json({ success: true, message: "Invitation resent successfully." });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StaffController();
