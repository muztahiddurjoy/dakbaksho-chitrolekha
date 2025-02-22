"use client"
import React, { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Download } from 'lucide-react'

const Chithicontainer = () => {
    const [title, settitle] = useState<string>('')
    const [userName, setuserName] = useState<string>('')
    const [chithi, setchithi] = useState<string>('')

    useEffect(() => {
        if(window){
          const chithi =  window.localStorage.getItem("chithi")
          try{
          const chithiObj = JSON.parse(String(chithi))
            if(chithiObj){
                settitle(chithiObj.title)
                setuserName(chithiObj.userName)
                setchithi(chithiObj.chithi)
            }
            }
            catch(e){
                console.log(e)
            }
        }
    }, [])

    useEffect(() => {
        if(window){
            window.localStorage.setItem("chithi", JSON.stringify({title, userName, chithi}))
        }
    }, [title, userName, chithi])

    
  return (
    <Card className='min-w-[300px] md:w-[60%] w-[90%]'>
      <CardHeader>
        {/* <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
      <CardContent>
        <div>
            <Label htmlFor="title">শিরোনাম</Label>
            <Input className='border-primary' type="text" id="title" value={title} onChange={(e)=>settitle(e.target.value)} />
        </div>
        <div className='mt-4'>
            <Label htmlFor="userName">আপনার নাম</Label>
            <Input className='border-primary' type="text" id="userName" value={userName} onChange={(e)=>setuserName(e.target.value)} />
        </div>
        <div className='mt-4'>
            <Label htmlFor="chithi">আপনার চিঠি</Label  >
            <Textarea className='border-primary' rows={10} value={chithi} onChange={(e)=>setchithi(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter className='flex justify-end'>
        <Button><Download/> ডাউনলোড করুন</Button>
      </CardFooter>
    </Card>
  )
}

export default Chithicontainer