import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth, { userRole } from "../../middlewares/auth";


const router = Router()
router.post("/",auth(userRole.STUDENT),bookingController.createBooking);
router.get("/",auth(userRole.STUDENT,userRole.TUTOR),bookingController.getBooking);
router.get("/:bookingId",bookingController.getBookingById);
router.patch("/:bookingId",auth(userRole.TUTOR),bookingController.updateBooking);

export const bookingRouter = router;