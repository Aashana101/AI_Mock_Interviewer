"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import { eq } from 'drizzle-orm';
import { MockInterviewer } from '@/utils/schema';
import QuestionsSections from './_components/QuestionsSections';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview({ params }) {
  const [interviewInfo, setInterviewInfo] = useState(null);
  const [mockInterviewQuestions, setMockInterviewQuestions] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  useEffect(() => {
    if (params) {
      params.then((resolvedParams) => {
        getInterviewDetails(resolvedParams.interviewID);
      });
    }
  }, [params]);

 
  const getInterviewDetails = async (interviewID) => {
  try {
    const result = await db
      .select()
      .from(MockInterviewer)
      .where(eq(MockInterviewer.mockID, interviewID));

    if (result.length > 0) {
      console.log("Raw DB Response:", result[0]);
      const jsonMockerResp = JSON.parse(result[0].jsonMockResp);

      

      // Extract the array correctly
      const questionsArray = Array.isArray(jsonMockerResp.interviewQuestions)
        ? jsonMockerResp.interviewQuestions
        : [];

      setMockInterviewQuestions(questionsArray);
      setInterviewInfo(result[0]);
    } else {
      console.warn("No interview data found for ID:", interviewID);
      setInterviewInfo(null);
      setMockInterviewQuestions([]);
    }
  } catch (error) {
    console.error("Error fetching interview details:", error);
    setMockInterviewQuestions([]);
  }
};

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Questions */}
        <QuestionsSections 
        mockInterviewQuestions={mockInterviewQuestions} 
        activeQuestionIndex={activeQuestionIndex}
        />



        {/* Video/ Audio Recording */}
        <RecordAnswerSection
        mockInterviewQuestions={mockInterviewQuestions} 
        activeQuestionIndex={activeQuestionIndex}
        interviewInfo={interviewInfo}
        />
      </div>

      <div className="flex justify-end gap-8">
        {activeQuestionIndex>0&& 
        <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Questions</Button>}
        {activeQuestionIndex!==mockInterviewQuestions.length-1&&
        <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Questions</Button>}
        {activeQuestionIndex===mockInterviewQuestions.length-1&&
        <Link href={'/dashboard/interview/'+interviewInfo?.mockID+'/feedback'}>
        <Button>End Interview</Button>
        </Link>}

      </div>
    </div>
  );
}

export default StartInterview;
