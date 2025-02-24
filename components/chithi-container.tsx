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
import * as htmlToImage from 'html-to-image';
import Image from 'next/image'

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

    const splitText = (text: string, wordsPerPage: number) => {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const pages = [];
        for (let i = 0; i < words.length; i += wordsPerPage) {
            pages.push(words.slice(i, i + wordsPerPage).join(' '));
        }
        return pages;
    }

  const createPageElement = (content: string, isCover: boolean = false) => {
    const page = document.createElement('div');
    page.style.width = '794px';
    page.style.minHeight = '1123px';
    page.style.padding = '40px';
    page.style.backgroundColor = 'white';
    page.style.position = 'fixed';
    page.style.left = '-10000px';
    page.style.top = '0';
    page.style.fontFamily = 'system-ui, -apple-system, sans-serif'; // Use system fonts
    page.style.visibility = 'hidden'; // Instead of moving off-screen

    if(isCover) {
        page.innerHTML = `
            <div style="height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <h1 style="font-size: 48px; margin-bottom: 30px;">${title}</h1>
                <h2 style="font-size: 36px;">${userName}</h2>
            </div>
        `;
    } else {
        page.innerHTML = `
            <div style="height: 100%; font-size: 24px; line-height: 1.6; white-space: pre-wrap;">
                ${content}
            </div>
        `;
    }

    document.body.appendChild(page);
    return page;
}

const downloadImage = async (element: HTMLElement, name: string) => {
    try {
        // Ensure fonts are loaded
        await document.fonts.ready;
        
        // Make element visible temporarily
        element.style.visibility = 'visible';
        
        // Add small delay to ensure rendering
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const dataUrl = await htmlToImage.toPng(element, {
            preferredFontFormat: 'woff2',
            fontEmbedCSS: `
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali&display=swap');
            `
        });
        
        const link = document.createElement('a');
        link.download = name;
        link.href = dataUrl;
        link.click();
    } finally {
        document.body.removeChild(element);
    }
}

// Add this to your component initialization
useEffect(() => {
    // Preload Bengali font if needed
    const font = new FontFace(
        'Noto Sans Bengali',
        'url(https://fonts.gstatic.com/s/notosansbengali/v20/Cn-0JtiGWQ5qoGhSDmkc_VJZMzt6BsA3wBZed4.ttf)'
    );
    font.load().then(() => document.fonts.add(font));
}, []);

    const handleDownload = async () => {
        // Download cover
        const coverPage = createPageElement('', true);
        await downloadImage(coverPage, 'chithi-cover.png');

        // Download content pages
        const pages = splitText(chithi, 50);
        for(let i = 0; i < pages.length; i++) {
            const contentPage = createPageElement(pages[i]);
            await downloadImage(contentPage, `chithi-page-${i + 1}.png`);
        }
    }

    return (
        <>
        <Card className='min-w-[300px] md:w-[60%] w-[90%]'>
            <CardHeader className='flex flex-row justify-center'>
                <Image src='/logo.png' width={200} height={200} alt="Dakbaksho" />
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
                    <Label htmlFor="chithi">আপনার চিঠি</Label>
                    <Textarea className='border-primary' rows={10} value={chithi} onChange={(e)=>setchithi(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className='flex justify-end'>
                <Button onClick={handleDownload} disabled={!title||!userName||!chithi}><Download/> ডাউনলোড করুন</Button>
            </CardFooter>
        </Card>
        </>
    )
}

export default Chithicontainer