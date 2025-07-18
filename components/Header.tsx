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

const Header = async () => {
  const user = await checkUser();
  console.log("User Check: ", user?.role);

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
