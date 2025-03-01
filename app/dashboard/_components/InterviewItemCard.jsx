import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React from 'react'

function InterviewItemCard({interview}) {

    const router=useRouter();


    const onStart=()=>{
        router.push('/dashboard/interview/'+interview?.mockID)
    }

    const onFeedbackPress=()=>{
        router.push('/dashboard/interview/'+interview.mockID+'/feedback')
    }
  return (
    <div className="border shadow-sm rounded-lg p-3">
     <h2 className="font-bold text-blue-800">{interview?.jobPosition}</h2>
     <h2 className="text-sm text-gray-500">Years of Experience: {interview?.jobExperience}</h2>
     <h2 className="text-xs text-gray-400">Created At: {interview.createdAt}</h2>
     <div className="flex justify-between mt-2 gap-5">
        
        <Button size="sm" variant="outline" className="w-full"
        onClick={onFeedbackPress}
        >FeedBack</Button>
       
        <Button size="sm" className="w-full"
        onClick={onStart}
        >Start</Button>

     </div>
    </div>
  )
}

export default InterviewItemCard
