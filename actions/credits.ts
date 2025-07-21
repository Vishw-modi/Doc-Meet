"use server"

import {format} from "date-fns"
import { auth } from "@clerk/nextjs/server"
import { type User, type CreditTransactions } from "@/lib/generated/prisma"

export type userWithTransactions = User & {transactions: CreditTransactions[]}

const PLAN_CREDITS = {
    free_user: 0,
    standard: 10,
    premium: 20    
}

export async function checkAndAllocateCredits(user: userWithTransactions | null){
    
    try {
        if(!user){
            return user
        }
        if(user.role !== "PATIENT"){
            return user
        }

        const {has} = await auth()

        const hasBasic = has({plan: "free_user"})
        const hasStandard =  has({plan: "standard_user"})
        const hasPremium   = has({plan: "premium_user"})

        let currentPlan = null
        let creditsToAllocate = 0

        if(hasPremium){
            currentPlan = "premium"
            creditsToAllocate = PLAN_CREDITS.premium

        } else if(hasStandard){
            currentPlan = "standard"
            creditsToAllocate = PLAN_CREDITS.standard

        } else if(hasBasic){
            currentPlan = "free_user"
            creditsToAllocate = PLAN_CREDITS.free_user
        }

        const alreadyRecieved = user.transactions.length > 0

        if(!alreadyRecieved && creditsToAllocate > 0){
            
        }

        if(!currentPlan){
            return user
        }
        
        const currentMonth = format(new Date, "yyyy-MM")
        
        if(user.transactions.length > 0) {
            const latestTransaction = user.transactions[0]
            const transactionMonth = format(new Date(latestTransaction.createdAt), "yyyy-MM")
            const transcationPlan = latestTransaction.packageId
        
            if(transactionMonth === currentMonth && transcationPlan === currentPlan){
                return user
            }
            
        }



    } catch (error) {
        console.log(error)
        
    }

    } 