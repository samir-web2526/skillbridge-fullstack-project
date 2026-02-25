import { bookingService } from "./booking.service";
import paginationSortHelpers from "../../helpers/paginationSortHelpers";
const createBooking = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            res.status(403).json({
                message: "You are Unauthorized!!!",
            });
        }
        const result = await bookingService.createBooking(req.body, user?.id);
        res.status(201).json({
            message: "Booking Created Successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const getBooking = async (req, res) => {
    try {
        const user = req.user;
        console.log(user);
        const { page, limit, skip, sortBy, sortOrder } = paginationSortHelpers(req.query);
        const result = await bookingService.getBooking({ page, limit, skip, sortBy, sortOrder }, user?.id, user?.role);
        res.status(201).json({
            message: "Booking fetched successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const getBookingById = async (req, res) => {
    try {
        const user = req.user;
        const bookingId = req.params.bookingId;
        const result = await bookingService.getBookingById(user?.id, bookingId, user?.role);
        res.status(201).json({
            message: "Booking Fetched successfully by id",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const cancelBooking = async (req, res) => {
    try {
        const user = req.user;
        const bookingId = req.params.bookingId;
        const result = await bookingService.cancelBooking(req.body, user?.id, bookingId);
        res.status(201).json({
            message: "Booking cancelled successfully",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
const updateBooking = async (req, res) => {
    try {
        const user = req.user;
        const bookingId = req.params.bookingId;
        const result = await bookingService.updateBooking(req.body, user?.id, bookingId);
        res.status(201).json({
            message: "Booking upadated successfully by tutor",
            data: result,
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};
export const bookingController = {
    createBooking,
    getBooking,
    getBookingById,
    updateBooking,
    cancelBooking,
};
//# sourceMappingURL=booking.controller.js.map