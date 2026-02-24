import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();
router.post("/", auth(userRole.TUTOR), tutorController.createTutor);
router.get("/", tutorController.getTutor);
router.get("/:tutorId", tutorController.getTutorById);
router.put("/:tutorId", auth(userRole.TUTOR), tutorController.updateTutor);
router.delete("/:tutorId",auth(userRole.ADMIN),tutorController.deleteTutor)
export const tutorRouter = router;
