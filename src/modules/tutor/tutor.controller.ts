import { Request, Response } from "express";
import { tutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(403).json({
        message: "You ar unauthorized!!",
      });
    }
    const result = await tutorService.createTutor(req.body, user?.id as string);
    res.status(201).json({
      message: "Tutor Profile Created Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getTutor = async (req: Request, res: Response) => {
  try {
    const result = await tutorService.getTutor();
    res.status(201).json({
      message: "Tutor fetched successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const getTutorById = async (req: Request, res: Response) => {
  try {
    const tutorId = req.params.tutorId;
    const result = await tutorService.getTutorById(tutorId as string);
    res.status(201).json({
      message: "Tutor Fetched successfully by Id",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

const updateTutor = async (req: Request, res: Response) => {
  try {
    const tutorId = req.params.tutorId;
    const user = req.user;
    if (!user) {
      res.status(403).json({
        message: "You are unauthorized",
      });
    }
    const result = await tutorService.updateTutor(
      req.body,
      user?.id as string,
      tutorId as string,
    );
    res.status(201).json({
      message: "Tutor updated successfully",
      data: result,
    });
  } catch (error: any) {
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
};
