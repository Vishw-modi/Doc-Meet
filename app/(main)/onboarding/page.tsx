"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, User } from "lucide-react";
const OnboardingPage = () => {
  const [step, setStep] = useState<string>("choose-step");

  const doctorFormSchema = z.object({
    speciality: z
      .string()
      .min(1, "Speciality is required")
      .max(100, "Speciality must be less than 100 characters"),
    experience: z
      .number()
      .min(1, "Experience is required")
      .max(100, "Experience must be less than 100 years"),
    credentialUrl: z
      .string()
      .url("Invalid URL")
      .min(1, "Credential URL is required"),
    description: z
      .string()
      .min(10, "Description is required")
      .max(1000, "Description must be less than 1000 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      speciality: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  if (step == "choose-step") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <User className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Patient
            </CardTitle>
            <CardDescription className="mb-4">
              Book appointments, consult with doctors, and manage your
              healthcare journey
            </CardDescription>
            <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
              Continue as Patient
            </Button>
          </CardContent>
        </Card>

        <Card className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <div className="p-4 bg-emerald-900/20 rounded-full mb-4">
              <Stethoscope className="h-8 w-8 text-emerald-400" />
            </div>
            <CardTitle className="text-xl font-semibold text-white mb-2">
              Join as a Doctor
            </CardTitle>
            <CardDescription className="mb-4">
              Create your professional profile, set your availability, and
              provide consultations
            </CardDescription>
            <Button className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700">
              Continue as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (step == "doctor-form") {
    return (
      <div>
        <h1>Doctor Form</h1>
      </div>
    );
  }
};

export default OnboardingPage;
