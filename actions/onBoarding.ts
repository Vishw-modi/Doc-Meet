"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function setUserRole(formData: FormData) {
const role = formData.get("role")
const {userId} = await auth()

if(!role || !["PATIENT", "DOCTOR"].includes(role.toString().toUpperCase())){
    throw new Error("Invalid Role")
}

if(!userId){
    throw new Error("Unauthorized")
}

const user = await db.user.findUnique({
    where: {clerkUserId: userId},
})

if(!user) {
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
        
        return {success: true, status:200, redirect:"/"}
    }

    if(role.toString().toUpperCase() === "DOCTOR"){

        const speciality = formData.get("speciality") 
        const experience = parseInt(formData.get("experience"), 10 )
        const credentialUrl = formData.get("credentialUrl")
        const description = formData.get("description")

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
        redirect("/doctors/verification")
        return {message: "Success", status:200, }
    }
} catch (error) {
    console.error(error)
    return NextResponse.json({message: "Error"}, {status:500})
}

}