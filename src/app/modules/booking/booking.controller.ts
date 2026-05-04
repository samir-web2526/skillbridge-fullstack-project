import { Request, Response } from "express";
import catchAsync from "../../sharedfile/catchAsync";
import sendResponse from "../../sharedfile/sendResponse";
import status from "http-status";
import { bookingService } from "./booking.service";
import { paginationHelper } from "../../sharedfile/paginationHelper";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const result = await bookingService.createBooking(
        req.body,
        user?.id as string,
    );
    sendResponse(res, {
        statusCode: Number(status.CREATED),
        success: true,
        message: "Booking Created Successfully",
        data: result,
    });
});

const getBooking = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const paginationOptions = paginationHelper.calculatePagination(req.query);
    const result = await bookingService.getBooking(
        paginationOptions,
        user?.id as string,
        user?.role as any,
    );
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Booking fetched successfully",
        data: result,
    });
});

const getBookingById = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { bookingId } = req.params;
    const result = await bookingService.getBookingById(
        user?.id as string,
        bookingId as string,
        user?.role as any,
    );
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Booking fetched successfully by id",
        data: result,
    });
});

const updateBooking = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { bookingId } = req.params;
    const result = await bookingService.updateBooking(
        req.body,
        user?.id as string,
        bookingId as string,
    );
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Booking updated successfully",
        data: result,
    });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const { bookingId } = req.params;
    const result = await bookingService.cancelBooking(
        user?.id as string,
        bookingId as string,
    );
    sendResponse(res, {
        statusCode: Number(status.OK),
        success: true,
        message: "Booking cancelled successfully",
        data: result,
    });
});

export const bookingController = {
    createBooking,
    getBooking,
    getBookingById,
    updateBooking,
    cancelBooking,
};
