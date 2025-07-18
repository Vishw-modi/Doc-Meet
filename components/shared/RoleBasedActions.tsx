import Link from "next/link";
import { Button } from "../ui/button";
import { Calendar, ShieldCheck, Stethoscope, User } from "lucide-react";

interface Props {
  role: "UNASSIGNED" | "PATIENT" | "DOCTOR" | "ADMIN";
}
export const RoleBasedActions = ({ role }: Props) => {
  if (role === "UNASSIGNED") {
    return (
      <>
        <Link href="/onBoarding">
          <Button
            variant="outline"
            className="hidden md:inline-flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Complete Profile
          </Button>
        </Link>

        <Link href="/onBoarding">
          <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
            <User className="h-4 w-4" />
          </Button>
        </Link>
      </>
    );
  }

  if (role === "PATIENT") {
    return (
      <>
        <Link href="/appointments">
          <Button
            variant="outline"
            className="hidden md:inline-flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Book Appointment
          </Button>
        </Link>

        <Link href="/appointments">
          <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
            <User className="h-4 w-4" />
          </Button>
        </Link>
      </>
    );
  }

  if (role === "DOCTOR") {
    return (
      <>
        <Link href="/doctor">
          <Button
            variant="outline"
            className="hidden md:inline-flex items-center gap-2"
          >
            <Stethoscope className="h-4 w-4" />
            Doctor Dashboard
          </Button>
        </Link>

        <Link href="/appointments">
          <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
            <Stethoscope className="h-4 w-4" />
          </Button>
        </Link>
      </>
    );
  }

  if (role === "ADMIN") {
    return (
      <>
        <Link href="/admin">
          <Button
            variant="outline"
            className="hidden md:inline-flex items-center gap-2"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin Dashboard
          </Button>
        </Link>

        <Link href="/appointments">
          <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
            <ShieldCheck className="h-4 w-4" />
          </Button>
        </Link>
      </>
    );
  }

  return null;
};
