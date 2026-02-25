import { tutorService } from "./tutor.service";
import paginationSortHelpers from "../../helpers/paginationSortHelpers";
const createTutor = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).json({
                message: "You ar unauthorized!!",
            });
        }
        const result = await tutorService.createTutor(req.body, user?.id);
        res.status(201).json({
            message: "Tutor Profile Created Successfully",
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
// const getTutor = async (req: Request, res: Response) => {
//   try {
//     const search =
//       typeof req.query.search === "string" ? req.query.search : undefined;
//     const { page, limit, skip, sortBy, sortOrder } = paginationSortHelpers(
//       req.query,
//     );
//     const result = await tutorService.getTutor({
//       search,
//       page,
//       limit,
//       skip,
//       sortBy,
//       sortOrder,
//     });
//     res.status(201).json({
//       message: "Tutor fetched successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(404).json({
//       success: false,
//       message: error.message || "Something went wrong",
//     });
//   }
// };
const getTutor = async (req, res) => {
    try {
        const search = typeof req.query.search === "string" ? req.query.search : undefined;
        const { page, limit, skip, sortBy, sortOrder } = paginationSortHelpers(req.query);
        const result = await tutorService.getTutor({
            ...(search !== undefined ? { search } : {}),
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
        });
        res.status(201).json({
            message: "Tutor fetched successfully",
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
const getTutorById = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;
        const result = await tutorService.getTutorById(tutorId);
        res.status(201).json({
            message: "Tutor Fetched successfully by Id",
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
const updateTutor = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;
        const user = req.user;
        if (!user) {
            res.status(403).json({
                message: "You are unauthorized",
            });
        }
        const result = await tutorService.updateTutor(req.body, user?.id, tutorId);
        res.status(201).json({
            message: "Tutor updated successfully",
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
const deleteTutor = async (req, res) => {
    try {
        const tutorId = req.params.tutorId;
        const result = await tutorService.deleteTutor(tutorId);
        res.status(201).json({
            message: "Tutor updated successfully",
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
export const tutorController = {
    createTutor,
    getTutor,
    getTutorById,
    updateTutor,
    deleteTutor,
};
//# sourceMappingURL=tutor.controller.js.map