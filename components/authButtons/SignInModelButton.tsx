"use client";

import { SignInButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";

type SignInModelButtonProps = {
  text?: string;
};

const SignInModelButton = ({ text = "Sign In" }: SignInModelButtonProps) => {
  return (
    <SignInButton mode="modal">
      <Button>{text}</Button>
    </SignInButton>
  );
};

export default SignInModelButton;
