import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router()
router.post("/",auth(Role.STUDENT),bookingController.createBooking);
router.get("/",bookingController.getBooking);
router.get("/:bookingId",bookingController.getBookingById);
router.patch("/:bookingId",auth(Role.TUTOR),bookingController.updateBooking);

export const bookingRouter = router;