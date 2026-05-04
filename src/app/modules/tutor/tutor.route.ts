import { Router } from "express";
import { tutorController } from "./tutor.controller";
import { checkAuth } from "../../middlewares/auth";

import { validateRequest } from "../../middlewares/validateRequest";
import { TutorValidation } from "./tutor.validation";

const router = Router();

router.get("/", tutorController.getTutors);
router.get("/stats", tutorController.getStats);
router.get("/profile", checkAuth("TUTOR"), tutorController.getMyProfile);
router.get("/:id", tutorController.getTutorById);

router.patch(
    "/update-status/:id",
    checkAuth("ADMIN"),
    validateRequest(TutorValidation.updateTutorStatus),
    tutorController.updateTutorStatus
);

router.put("/:id", checkAuth("TUTOR"), tutorController.updateTutor);
router.delete("/:id", checkAuth("ADMIN"), tutorController.deleteTutor);

export const tutorRouter = router;
