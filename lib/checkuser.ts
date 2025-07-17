

import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma"

export const checkUser = async () => {
    const user =await  currentUser()
     
    if(!user){
        return null
    }

    try {
        const loggedInUser = await db.User.findUnique({
            where: {
                clerkUserId: user.id
            }
        })

        if(loggedInUser) {
            return loggedInUser
        }

        const name = `${user.firstName} ${user.lastName}`

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name:name,
                email: user.emailAddresses[0].emailAddress,
                imageUrl: user.imageUrl,
                transactions: {
                    create: {
                        type: "CREDIT_PURCHASE",
                        packageId: "1",
                        amount: 2
                    }
                }
            }
        }) 
        return newUser
    } catch (error: Error | unknown) {
        console.log("CheckUser Function Error", error);
        return null
        
    }
    
}