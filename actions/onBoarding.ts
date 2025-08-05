"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { toast } from "sonner"

export async function setUserRole(formData: FormData) {
const role = formData.get("role")
const {userId} = await auth()


if(!role || !["PATIENT", "DOCTOR"].includes(role.toString().toUpperCase())){
    toast.error("Invalid Role")
    throw new Error("Invalid Role")
}

if(!userId){
    toast.error("Unauthorized")
    throw new Error("Unauthorized")
}

const user = await db.user.findUnique({
    where: {clerkUserId: userId},
})

if(!user) {
    toast.error("User Not Found In Database")
    throw new Error("User Not Found In Database")
}

try {
    if(role.toString().toUpperCase() === "PATIENT"){
        await db.user.update({
            where: {
                clerkUserId: userId
            },
            data: {
                role: "PATIENT"
            }
        })

        revalidatePath("/")
        
        return {success: true, status:200, redirect:"/doctors"}
    }

    if(role.toString().toUpperCase() === "DOCTOR"){

        const speciality = formData.get("speciality") as string
        const experience = formData.get("experience") as string
        const credentialUrl = formData.get("credentialUrl") as string
        const description = formData.get("description") as string

        if(!speciality || !experience || !credentialUrl || !description){
            throw new Error("All fields are required")
        }

        await db.user.update({
            where: {
                clerkUserId: userId
            },
            data: {
                role: "DOCTOR",
                speciality,
                experience,
                credentialUrl,
                description,
                verificationStatus: "PENDING",
            }
        })
        revalidatePath("/")
        return {message: "Success", status:200, redirect:"/doctors/verification"}
    }
} catch (error) {
    console.error(error)
    throw new Error(`Something went wrong in the server while updating the user role : ${error instanceof Error ? error.message : String(error)}`)
}

}

export async function getCurrentUser() {
    const {userId} = await auth()
    
    if(!userId) {
        throw new Error("Unauthorized")
    }
try {
    
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId
        }
    })
    return user
} catch (error) {
    console.error("error while fetching user",error);
    throw new Error(`Something went wrong in the server while fetching the user : ${error instanceof Error ?  error.message : String(error)}`)
    
}
}