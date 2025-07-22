"use server"

import {format} from "date-fns"
import { auth } from "@clerk/nextjs/server"
import { type User, type CreditTransactions } from "@/lib/generated/prisma"
import { db } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type userWithTransactions = User & {transactions: CreditTransactions[]}

const PLAN_CREDITS = {
    free_plan: 0,
    standard_plan: 10,
    premium_plan: 20,
}

const APPOINTMENT_COST = 2

export async function checkAndAllocateCredits(user: userWithTransactions | null){
    
    try {
        if(!user || user.role !== "PATIENT"){
            return user
        }

        const {has} = await auth()

        const hasBasic = has({plan:"free_plan"})
        const hasStandard =  has({plan: "standard_plan"})
        const hasPremium   = has({plan: "premium_plan"})

        let currentPlan = null
        let creditsToAllocate = 0

        if(hasPremium){
            currentPlan = "premium"
            creditsToAllocate = PLAN_CREDITS.premium_plan

        } else if(hasStandard){
            currentPlan = "standard"
            creditsToAllocate = PLAN_CREDITS.standard_plan

        } else if(hasBasic){
            currentPlan = "free_user"
            creditsToAllocate = PLAN_CREDITS.free_plan
        }
         if(!currentPlan){
            return user
        }
               
        const currentMonth = format(new Date, "yyyy-MM")
       

        if(user.transactions.length > 0) {
            const latestTransaction = user.transactions[0]
            const transactionMonth = format(new Date(latestTransaction.createdAt), "yyyy-MM")
            const transcationPlan = latestTransaction.packageId
        
            console.log(transcationPlan)

            if(transactionMonth === currentMonth && transcationPlan === currentPlan){
                return user
            }
            const updatedUser = await db.$transaction(async (tx) => {
                await tx.creditTransactions.create({
                    data: {
                        userId: user.id,
                        amount: creditsToAllocate,
                        type: "CREDIT_PURCHASE",
                        packageId: currentPlan,
                    }
                })

                const updatedUser = await tx.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        credits: {
                            increment: creditsToAllocate
                        }
                    }
                })
                return updatedUser
            })
            revalidatePath("/doctors")
            revalidatePath("/appointments")
            console.log("Main transaction",updatedUser);
            
            return updatedUser
        }

    } catch (error) {
        console.log("Failed to allocate credits", error)
        return null
    }

    } 