import Image from 'next/image'
import React from 'react'
import { Button, buttonVariants } from './ui/button'
import Link from 'next/link'

const LandingPage = () => {
  return (
    <div className='h-[100vh] w-full bg-darkRed flex items-center justify-center flex-col gap-3'>
        <Image src='/next.svg' width={200} height={200} alt="Dakbaksho" />
        <p className='w-[400px] mt-5 text-center font-semibold text-lightBrown'>"ডাকবাক্স- খোলা চিঠি উৎসব ১৪৩১" হলো একটি সাহিত্যিক আয়োজন, যেখানে অংশগ্রহণকারীরা তাদের অনুভূতি চিঠির মাধ্যমে প্রকাশ করতে পারবেন এবং সেরা চিঠিগুলো পুরস্কৃত হবে।</p>
        <Link href="/dakbaksho" className={buttonVariants({variant:"secondary",className:"font-semibold text-darkRed"})}>
        আপনার চিঠি লিখুন
        </Link>
    </div>
  )
}

export default LandingPage