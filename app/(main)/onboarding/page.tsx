"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { any } from "zod/v3";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Stethoscope, User } from "lucide-react";
import useFetch from "@/hooks/useFetch";
import { setUserRole } from "@/actions/onBoarding";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SPECIALTIES } from "@/lib/speciality";
import { Input } from "@/components/ui/input";

type SuccessData = {
  success: boolean;
  status: number;
  redirect: string;
};

const OnboardingPage = () => {
  const router = useRouter();

  const [step, setStep] = useState<string>("choose-step");

  const { data, loading, fn: submitUserRole } = useFetch(setUserRole);

  useEffect(() => {
    const typedData = data as SuccessData | null;

    if (typedData && typedData?.success) {
      toast.success("Role Set Successfully to Patient");
      router.push(typedData.redirect);
    }
  }, [data, router]);

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
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      speciality: "",
      experience: undefined,
      credentialUrl: "",
      description: "",
    },
  });

  const specialityValue = watch("speciality");
  console.log(FormData);

  const handlePatientSelection = async () => {
    if (loading) return;
    const formData = new FormData();
    formData.append("role", "PATIENT");
    console.log("formData", formData);

    await submitUserRole(formData);
  };

  if (step == "choose-step") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          onClick={() => !loading && handlePatientSelection()}
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
        >
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
            <Button
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue as Patient"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card
          onClick={() => !loading && setStep("doctor-form")}
          className="border-emerald-900/20 hover:border-emerald-700/40 cursor-pointer transition-all"
        >
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
            <Button
              disabled={loading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700"
            >
              Continue as Doctor
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (step == "doctor-form") {
    return (
      <Card className="border-emerald-900/20">
        <CardContent className="pt-6 ">
          <div className="mb-6">
            <CardTitle className="text-2xl font-bold text-white mb-2">
              Complete your Doctor Profile
            </CardTitle>
            <CardDescription className="mb-4">
              Please Provide your Professional Details for Verifiation
            </CardDescription>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="speciality">Speciality</Label>
              <Select
                value={specialityValue}
                onValueChange={(value) => setValue("speciality", value)}
              >
                <SelectTrigger id="speciality">
                  <SelectValue placeholder="Select your speciality" />
                </SelectTrigger>
                <SelectContent className=" flex items-center gap-2">
                  {SPECIALTIES.map((speciality) => (
                    <SelectItem key={speciality.name} value={speciality.name}>
                      {speciality.icon} {speciality.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.speciality && (
                <p className="text-sm font-medium mt-1 text-red-500">
                  {errors.speciality.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                {...(register("experience"), { valueAsNumber: true })}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
};

export default OnboardingPage;
