import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post("/",auth(Role.TUTOR),tutorController.createTutor);
router.get("/",tutorController.getTutor);
router.get("/:tutorId",tutorController.getTutorById);
router.put("/:tutorId",auth(Role.TUTOR),tutorController.updateTutor);
export const tutorRouter = router;