"use client";
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import { useParams, useRouter} from 'next/navigation' // Import useParams hook

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';



function Feedback() {

    const params = useParams(); // Get params properly
    const interviewID = params?.interviewID; // Extract interviewID safely

    const [feedbackList, setFeedbackList]=useState([]);
    const router=useRouter();

    useEffect(() => {
        if (interviewID) { // Ensure interviewID exists before fetching
            GetFeedback();
        }
    }, [interviewID]);

    const GetFeedback = async () => {
        try {
            const result = await db
                .select()
                .from(UserAnswer)
                .where(eq(UserAnswer.mockIDRef, interviewID))
                .orderBy(UserAnswer.id);

            console.log(result);
            setFeedbackList(result);
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    return (
        <div className="p-10">
            
            {
                feedbackList?.length==0?
                <h2 className="font-bold text-xl text-gray-500">No Interview Record Found</h2>
                :
                <>

            <h2 className="text-3xl font-bold text-green-500">Congratulations</h2>
            <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
            <h2 className="text-primary text-lg my-3">Your overall interview rating: <strong></strong></h2>
            <h2 className="text-sm text-gray-500">
                Find below interview question with correct answer, your answer, and feedback for improvement
            </h2>
            {feedbackList&&feedbackList.map((item, index)=>(
                <Collapsible key={index} className="mt-7">
                <CollapsibleTrigger className='p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-10 w-full'>{item.question}<ChevronsUpDown className="h-5 w-5"/></CollapsibleTrigger>
                <CollapsibleContent>
                <div className="flex flex-col gap-2">
                    <h2 className="text-red-600 p-2 border rounded-lg"><strong>Rating:</strong>{item.rating}</h2>
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-600"><strong>Your Answer: </strong>{item.userAns}</h2>
                    <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-800"><strong>Correct Answer: </strong>{item.correctAns}</h2>
                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-800"><strong>Feedback: </strong>{item.feedback}</h2>


                </div>
                </CollapsibleContent>
                </Collapsible>
            ))}
            </>}
            <Button onClick={()=>router.replace('/dashboard')}>Go Home</Button>
        </div>
    );
}

export default Feedback;
