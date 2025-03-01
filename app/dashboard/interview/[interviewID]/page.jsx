"use client";

import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { MockInterviewer } from "@/utils/schema";
import React, { useEffect, useState, use } from "react";
import Webcam from "react-webcam";
import { Lightbulb, Link, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";



function Interview({ params: paramsPromise }) {
  const params = use(paramsPromise);
   const router = useRouter();


  const [interviewInfo, setInterviewInfo] = useState(null);
  const [webcamEnable, setWebcamEnable] = useState(false);

  useEffect(() => {
    if (!params?.interviewID) return;
    getInterviewDetails();
  }, [params.interviewID]);

  const getInterviewDetails = async () => {
    try {
      const result = await db
        .select()
        .from(MockInterviewer)
        .where(eq(MockInterviewer.mockID, params.interviewID));

      if (result.length > 0) {
        setInterviewInfo(result[0]);
      } else {
        console.warn("No interview data found for ID:", params.interviewID);
        setInterviewInfo(null);
      }
    } catch (error) {
      console.error("Error fetching interview details:", error);
    }
  };


  const handleStartInterview = () => {
    router.push(`/dashboard/interview/${params.interviewID}/start`);
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };


  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl mb-5">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="flex flex-col gap-5 mt-7">
            <div className='flex flex-col p-5 rounded-lg border gap-5'>
          <div>
            <h2>
              <strong>Job Role/Job Position:</strong>{" "}
              {interviewInfo?.jobPosition ?? "No job position available"}
            </h2>
          </div>

          <div>
            <h2>
              <strong>Job Description/Tech Stack:</strong>{" "}
              {interviewInfo?.jobDesc ?? "No job Description available"}
            </h2>
          </div>

          <div>
            <h2>
              <strong>Years of Experience:</strong>{" "}
              {interviewInfo?.jobExperience ?? "No job Experience available"}
            </h2>
          </div>
         </div>
          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-300">
            <h2 className="flex gap-2 items-center text-yellow-700"><Lightbulb/><strong>Information</strong></h2>
            <h2 className="mt-3 text-yellow-800">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>

         
            
        </div>


        <div>
          {webcamEnable ? (
            <Webcam
              onUserMedia={() => setWebcamEnable(true)}
              onUserMediaError={() => setWebcamEnable(false)}
              mirrored={true}
              style={{ height: 300, width: 300 }}
            />
          ) : (
            <>
              <div className="flex justify-center items-center h-72 my-7 bg-secondary rounded-lg border">
                <WebcamIcon className="w-20 h-20" />
              </div>
              <Button variant="ghost" onClick={() => setWebcamEnable(true)} className="w-full">
                Enable Camera and Microphone
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mt-5 flex justify-end items-end gap-5">
       <Button onClick={handleStartInterview}>Start Interview</Button>
       <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
       </div>
    </div>
   
  );
}

export default Interview;
