"use client"
import React, {useState} from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { v4 as uuidv4 } from 'uuid';
import {useUser} from '@clerk/nextjs'
import {db} from '@/utils/db'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { chatSession } from '@/utils/GeminiAIModel'
import { LoaderCircle } from 'lucide-react'
import { MockInterviewer } from '@/utils/schema'
import moment from 'moment'
import { useRouter } from 'next/navigation'

function AddNewInterview() {
    const [openDialog, setOpenDialog]=useState(false);
    const [jobPosition, setJobPosition]=useState();
    const [jobDescription, setJobDescription]=useState();
    const [jobExperience, setJobExperience]=useState();
    const [loading, setLoading]=useState(false);
    const [jsonResponse, setjsonResponse]=useState([]);
    const router=useRouter();
    const {user}=useUser();
    const onSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault();
        console.log(jobPosition, jobDescription, jobExperience);

        const InputPrompt="Job Position: "+jobPosition+"Job Description: "+jobDescription+"Years of Experience: "+jobExperience+"Depending on this Job Description generate the "+process.env.NEXT_PUBLIC_INTERVIEW_QUESTIONS_COUNT+" interview questions along with answers in JSON Format";

        const result=await chatSession.sendMessage(InputPrompt)

        const MockJsonResponse=(result.response.text()).replace('```json','').replace('```','');
        console.log(JSON.parse(MockJsonResponse));
        setjsonResponse(MockJsonResponse);
        

        
        if(MockJsonResponse){
        const resp=await db.insert(MockInterviewer)
        .values(
            {
                mockID:uuidv4(),
                jsonMockResp:MockJsonResponse,
                jobPosition:jobPosition,
                jobDesc:jobDescription,
                jobExperience:jobExperience,
                createdBy:user.primaryEmailAddress?.emailAddress,
                createdAt:moment().format('DD-MM-YYYY')
            }).returning({mockID:MockInterviewer.mockID});

            console.log("Inserted ID:", resp)
            if(resp){
                setOpenDialog(false);
                router.push('/dashboard/interview/'+resp[0]?.mockID)
            }
        }
        else{
            console.log("ERROR");
        }
        setLoading(false);
    
}
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md
        cursor-pointer transition-all'
        onClick={()=>setOpenDialog(true)}>
      <h2 className='text-lg text-center'>+ Add New</h2>
      </div>
      <Dialog open={openDialog}>
 
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">Tell us more about job interviewing</DialogTitle> 
      <form onSubmit={onSubmit}>
        <div>
            <h2>
                Add details about your job position/role, job description and years of experience
            </h2>
            <div className="mt-7 my-3">
                <label>Job Position</label>
                <Input placeholder="Ex. Full Stack Developer" required
                onChange={(event)=>setJobPosition(event.target.value)}
                />

            </div>

            <div className="my-3">
                <label>Job Description/ Tech Stack</label>
                <Textarea placeholder="Ex. React, Angular, NodeJs, MySQL etc." required
                onChange={(event)=>setJobDescription(event.target.value)}
                />

            </div>


            <div className="my-3">
                <label>Years of Experience</label>
                <Input placeholder=" Ex. 5" type="number" max="50" required
                onChange={(event)=>setJobExperience(event.target.value)}
                />

            </div>


        </div>
      
       <div className='flex gap-5 justify-end'>
            <Button type="button" variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
                {
                    loading?
                    <>
                    <LoaderCircle className='animal'/>'Generating from AI'</>:
                    'Start Interview'
                }
                </Button>
        </div>
        </form>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview
   

