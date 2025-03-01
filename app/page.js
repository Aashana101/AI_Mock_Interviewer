"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();

  const handleButtonClick = () => {
    // Redirect to the dashboard page
    router.push("/dashboard");
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>Go to Dashboard</Button>
    </div>
  );
}
