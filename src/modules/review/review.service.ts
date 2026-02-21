import { prisma } from "../../lib/prisma"

const createReview = async(payload:any,userId:string)=>{

    const existBooking = await prisma.booking.findFirst({
        where:{
            id:payload.bookingId
        }
    })

    const alreadyReviewed = await prisma.review.findUnique({
        where:{
            bookingId:payload.bookingId
        }
    })

    if(alreadyReviewed){
        throw new Error("You cann't reviewed again because you already reviewed this session")
    }

    if(!existBooking){
        throw new Error("Booking not found")
    }

    if(existBooking.status !== 'COMPLETED'){
        throw new Error("You cann't review this tutor because session is not completed")
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