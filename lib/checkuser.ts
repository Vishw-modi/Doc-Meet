

import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma"

export const checkUser = async () => {
    const user =await  currentUser()
     
    if(!user){
        return null
    }

    try {
        const loggedInUser = await db.user.findUnique({
            where: {
                clerkUserId: user.id
            },
            include: {
                transactions: {
                    where: {
                        type: "CREDIT_PURCHASE",
                        createdAt: {
                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                        }

                    },

                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 1
                }
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
                
            },
            include:{
                transactions: true
             }

        }) 
        console.log("New User Created", newUser.role);
        
        return newUser
    } catch (error: Error | unknown) {
        console.log("CheckUser Function Error", error);
        return null
        
    }
    
}