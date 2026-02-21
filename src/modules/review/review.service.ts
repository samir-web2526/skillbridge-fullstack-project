import { prisma } from "../../lib/prisma"

const createReview = async(payload:any,userId:string)=>{

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