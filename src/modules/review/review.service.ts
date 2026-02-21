import { prisma } from "../../lib/prisma"

const createReview = async(payload:any,userId:string)=>{

    const existBooking = await prisma.booking.findFirst({
        where:{
            id:payload.bookingId
        }
    })
    if(!existBooking){
        throw new Error("Booking not found")
    }

    if(existBooking.userId !== userId || existBooking.tutorId !== payload.tutorId){
        throw new Error("You cann't review this tutor because he is not your user");
    }

    const result = await prisma.review.create({
        data:{
            ...payload,userId
        }
    })
    return result;
   
}

const getReview = async()=>{
    const result = await prisma.review.findMany();
    return result;
}
export const reviewService = {
    createReview,
    getReview
}