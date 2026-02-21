import { prisma } from "../../lib/prisma"

const createCategory = async(payload:any)=>{
    console.log("payload",payload)
   const result = await prisma.category.create({
    data:{
       ...payload
    }
   })
   return result;
}

const getCategory = async()=>{
    const result = await prisma.category.findMany();
    return result
}

export const categoryService = {
    createCategory,
    getCategory
}

