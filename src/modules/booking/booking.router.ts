import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router()
router.post("/",auth(userRole.STUDENT),bookingController.createBooking);
router.get("/",auth(userRole.STUDENT,userRole.TUTOR),bookingController.getBooking);
router.get("/:bookingId",auth(userRole.STUDENT,userRole.TUTOR),bookingController.getBookingById);
router.patch("/:bookingId/cancel",auth(userRole.STUDENT),bookingController.cancelBooking);
router.patch("/:bookingId/status",auth(userRole.TUTOR),bookingController.updateBooking);


export const bookingRouter = router;