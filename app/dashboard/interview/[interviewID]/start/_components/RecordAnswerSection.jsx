"use client"

import React, {useState, useEffect} from 'react'
import Image from 'next/image'
import Webcam from 'react-webcam'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import {Mic} from 'lucide-react'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { UserAnswer } from '@/utils/schema'
import { useUser } from '@clerk/nextjs'
import { db } from '@/utils/db'
import moment from 'moment'

function RecordAnswerSection({mockInterviewQuestions, activeQuestionIndex, interviewInfo}) {
    const [userAnswer, setUserAnswer] = useState('')
    const {user}=useUser();
    const [loading, setLoading]=useState(false);
    const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
  if (results.length > 0) {
    setUserAnswer(results[results.length - 1]?.transcript || ''); // Only use the latest result
  }
}, [results]);


  useEffect(()=>{
    if(!isRecording&&userAnswer.length>10){
      UpdateUserAnswer();
    }
  }, [userAnswer])


  const StartStopRecording=async()=>{
    if(isRecording){
        stopSpeechToText()
    }
    else{
    setUserAnswer('');
    startSpeechToText()
    }
  }


  const UpdateUserAnswer = async () => {
    console.log("User Answer:", userAnswer);
    console.log("Active Question Index:", activeQuestionIndex);
    console.log("Active Question Object:", mockInterviewQuestions[activeQuestionIndex]);

    const correctAnswer = mockInterviewQuestions[activeQuestionIndex]?.answerExample || "No correct answer provided";
    console.log("Correct Answer:", correctAnswer);

    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. 
    Based on the given interview question, please provide a rating for the answer and feedback for improvement in 3-5 lines, formatted in JSON with fields "rating" and "feedback".`;

    try {
        const result = await chatSession.sendMessage(feedbackPrompt);
        const mockJsonResp = result.response.text().replace('```json', '').replace('```', '');
        console.log("AI Response:", mockJsonResp);

        const JsonFeedbackResp = JSON.parse(mockJsonResp);

        const resp = await db.insert(UserAnswer).values({
            mockIDRef: interviewInfo?.mockID,
            question: mockInterviewQuestions[activeQuestionIndex]?.question,
            correctAns: correctAnswer, // Ensuring correctAns is not NULL
            userAns: userAnswer,
            feedback: JsonFeedbackResp?.feedback,
            rating: JsonFeedbackResp?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-YYYY')
        });

        if (resp) {
            toast('User answer recorded successfully');
            setResults([]);
        }
        setResults([]);
      setUserAnswer('');
      setLoading(false);
    } catch (error) {
        console.error("Error saving answer:", error);
        toast("Failed to record answer", { variant: "destructive" });
    }

    setUserAnswer('');
    setLoading(false);
};



  return (
    <div className='flex items-center justify-center flex-col'>
    <div className='flex flex-col mt-20 justify-center items-center rounded-lg p-5 bg-black'>
      <Image src={'/webcam.png'} alt="webcam_logo" width={200} height={200} className='absolute'/>
      <Webcam
      mirrored={true}
      style={{
        height:300,
        width:'100%',
        zIndex:10,

      }}
      />
    </div>
    <Button 
    disabled={loading}
    variant="outline" className='my-5'
        onClick={StartStopRecording}>
        {
            isRecording?
            <h2 className='text-red-600 flex gap-10'>
                <Mic/> 'Stop Recording...'
            </h2>
            :<h2 className="text-blue-600 flex gap-2"> <Mic/>Record Answer </h2>
        }
       </Button>

       
    
    </div>
  )
}

export default RecordAnswerSection