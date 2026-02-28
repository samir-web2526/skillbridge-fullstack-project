import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { userRole } from "../../middlewares/auth";
import paginationSortHelpers from "../../helpers/paginationSortHelpers";

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(403).json({
        message: "You are Unauthorized!!!",
      });
    }
    const result = await bookingService.createBooking(
      req.body,
      user?.id as string,
    );
    res.status(201).json({
      message: "Booking Created Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    console.log(user);
    const { page, limit, skip, sortBy, sortOrder } = paginationSortHelpers(
      req.query,
    );
    const result = await bookingService.getBooking(
      { page, limit, skip, sortBy, sortOrder },
      user?.id as string,
      user?.role as userRole,
    );
    res.status(201).json({
      message: "Booking fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const bookingId = req.params.bookingId;

    const result = await bookingService.getBookingById(
      user?.id as string,
      bookingId as string,
      user?.role as userRole,
    );
    res.status(201).json({
      message: "Booking Fetched successfully by id",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const cancelBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const bookingId = req.params.bookingId;
    const result = await bookingService.cancelBooking(
      user?.id as string,
      bookingId as string,
    );
    res.status(201).json({
      message: "Booking cancelled successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const bookingId = req.params.bookingId;

    const result = await bookingService.updateBooking(
      req.body,
      user?.id as string,
      bookingId as string,
    );
    res.status(201).json({
      message: "Booking upadated successfully by tutor",
      data: result,
    });
  } catch (error: any) {
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
