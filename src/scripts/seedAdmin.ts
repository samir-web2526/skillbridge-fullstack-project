import { prisma } from "../lib/prisma";
import { userRole } from "../middlewares/auth";


async function seedAdmin(){
    try {
        const adminData = {
            name:"admin",
            email:"admin@g.com",
            role:userRole.ADMIN,
            password:"adminpass"
        }

        const exitingUser = await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        })
        if(exitingUser){
            throw new Error("already registered")
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                "Content-type":"application/json",
                "Origin":"http://localhost:3000"
            },
            body:JSON.stringify(adminData)
        })
        console.log(signUpAdmin);
    } catch (error) {
        console.error(error)
    }
}

seedAdmin()