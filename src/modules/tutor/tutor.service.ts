
import { prisma } from "../../lib/prisma";

const createTutor = async (payload: any, userId: string) => {

  const existingTutor = await prisma.tutorProfile.findUnique({
        where:{
            userId:userId
        }
    });
    if(existingTutor){
        throw new Error("Tutor profile already exits!!!")
    }

  const result = await prisma.tutorProfile.create({
    data: {
      ...payload,
      userId,
    },
  });
  return result;
};

const getTutor = async () => {
  const result = await prisma.tutorProfile.findMany({});
  return result;
};

const getTutorById = async (tutorId: string) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
  });
  return result;
};

const updateTutor = async (payload: any, userId: string, tutorId: string) => {

  const tutorProfileData = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
  });
  console.log(tutorProfileData)

  if(!tutorProfileData){
    throw new Error("Tutor not found")
  }

   if(tutorProfileData.userId !== userId){
    throw new Error("You are not allowed to access this part")
   }

    return await prisma.tutorProfile.update({
      where: {
        id: tutorProfileData.id,
      },
      data: {
        ...payload,
      },
    });
   
};
export const tutorService = {
  createTutor,
  getTutor,
  getTutorById,
  updateTutor,
};
