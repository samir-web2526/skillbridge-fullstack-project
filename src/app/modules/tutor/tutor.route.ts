import { Router } from "express";
import { tutorController } from "./tutor.controller";
import auth, { userRole } from "../../middlewares/auth";

const router = Router();

router.post("/", auth(userRole.TUTOR), tutorController.createTutor);
router.get("/", tutorController.getTutors);
router.get("/stats", tutorController.getStats);
router.get("/profile", auth(userRole.TUTOR), tutorController.getMyProfile);
router.get("/:id", tutorController.getTutorById);
router.put("/:id", auth(userRole.TUTOR), tutorController.updateTutor);
router.delete("/:id", auth(userRole.ADMIN), tutorController.deleteTutor);

export const tutorRouter = router;
