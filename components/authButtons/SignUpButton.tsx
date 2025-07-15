"use client";

import { SignUpButton as ClerkSignUpButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "../ui/button";

type SignUpModelButtonProps = {
  text?: string;
};

const SignUpButton = ({ text = "Sign Up" }: SignUpModelButtonProps) => {
  return (
    <ClerkSignUpButton mode="modal">
      <Button className="bg-emerald-600 text-white hover:bg-emerald-700">
        {text}
      </Button>
    </ClerkSignUpButton>
  );
};

export default SignUpButton;
