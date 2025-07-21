import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { checkUser } from "@/lib/checkuser";
import { RoleBasedActions } from "./shared/RoleBasedActions";
import {
  checkAndAllocateCredits,
  userWithTransactions,
} from "@/actions/credits";
import { Badge } from "./ui/badge";
import { CreditCard } from "lucide-react";

const Header = async () => {
  const user: userWithTransactions = await checkUser();
  if (user?.role === "PATIENT") {
    await checkAndAllocateCredits(user);
  }
  await console.log("User Check: ", user);
  await console.log("Users lateest transaction: ", user?.transactions[0]);

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60 ">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={"/"}>
          <Image
            src={"/logo-single.png"}
            alt="Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="space-x-2 flex items-center">
          <SignedIn>
            {user?.role && <RoleBasedActions role={user?.role} />}
          </SignedIn>
          {(!user || user.role === "PATIENT") && (
            <Link href={"#pricing"}>
              <Badge
                variant="outline"
                className="h-9 px-3 py-1 flex items-center gap-2 border border-emerald-500/40 bg-emerald-700/20 text-emerald-600 hover:bg-emerald-100/30 transition-colors"
              >
                <CreditCard className="h-4 w-4 text-emerald-500" />
                {user && user?.role === "PATIENT" ? (
                  <span className="text-sm font-medium hidden md:inline">
                    {user.credits} Credits
                  </span>
                ) : (
                  <span className="text-sm font-medium">Pricing</span>
                )}
              </Badge>
            </Link>
          )}
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant={"secondary"}>Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant={"default"}>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
