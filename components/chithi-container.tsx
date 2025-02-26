"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import Image from "next/image";

const Chithicontainer = () => {
  const [title, settitle] = useState<string>("");
  const [userName, setuserName] = useState<string>("");
  const [chithi, setchithi] = useState<string>("");
  const [isLoading, setisLoading] = useState<boolean>(false)

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (window) {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400..800&display=swap";
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@100..900&display=swap"
      link.rel = "stylesheet";
      document.head.appendChild(link);
      const savedChithi = window.localStorage.getItem("chithi");
      try {
        const chithiObj = JSON.parse(savedChithi || "{}");
        if (chithiObj) {
          settitle(chithiObj.title);
          setuserName(chithiObj.userName);
          setchithi(chithiObj.chithi);
        }
      } catch (e) {
        console.error("Error parsing saved chithi:", e);
      }
    }
  }, []);

  // Save data to localStorage whenever title, userName, or chithi changes
  useEffect(() => {
    if (window) {
      window.localStorage.setItem(
        "chithi",
        JSON.stringify({ title, userName, chithi })
      );
    }
  }, [title, userName, chithi]);

  // Split the chithi text into pages with a fixed number of words per page
  const splitText = (text: string, wordsPerPage: number) => {
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const pages = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      pages.push(words.slice(i, i + wordsPerPage).join(" "));
    }
    return pages;
  };

  // Create a page element (either cover or content page)
  const createPageElement = (content: string, isCover: boolean = false) => {
    const page = document.createElement("div");
    page.style.width = "800px"; // Square width in pixels
    page.style.height = "800px"; // Square height in pixels
    page.style.padding = "20px";
    page.style.backgroundColor = "transparent"; // Deep red for cover, transparent for content
    page.style.backgroundImage = isCover?`url(${window.location.origin}/bg.jpeg)`:`url(${window.location.origin}/page.png)`; // Use bg.jpeg as background for content pages
    page.style.backgroundSize = "cover"; // Ensure the background image covers the entire element
    page.style.backgroundPosition = "center"; // Center the background image
    page.style.position = "fixed";
    page.style.left = "-10000px"; // Move off-screen
    page.style.top = "0";
    page.style.fontFamily = isCover? "Baloo Da 2":"Noto Sans Bengali"; // Use Baloo Da 2 for cover, Noto Sans Bengali for content
    page.style.visibility = "hidden"; // Hide the element initially
    page.style.color = "#A72120" // White text for cover, black for content
    page.style.display = "flex";
    page.style.flexDirection = "column";
    page.style.justifyContent = "center";
    page.style.alignItems = "center";
    page.style.textAlign = isCover?"center":"left";

    if (isCover) {
      page.innerHTML = `
        <h1 style="font-size: 62px; margin-bottom: 30px;">${title}</h1>
        <h2 style="font-size: 38px;">${userName}</h2>
      `;
    } else {
      page.innerHTML = `
        <div style="font-size: 25px; line-height: 1.6; white-space: pre-wrap; padding: 20px;font-weight:500">
          ${content}
        </div>
      `;
    }

    document.body.appendChild(page);
    return page;
  };

  // Download an image of the given element using html2canvas
  const downloadImage = async (element: HTMLElement, name: string) => {
    console.log(chithi)
    try {
      // Ensure fonts are loaded
      await document.fonts.ready;

      // Make the element visible temporarily
      element.style.visibility = "visible";

      // Add a small delay to ensure rendering
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Use html2canvas to capture the element as an image
      const canvas = await html2canvas(element, {
        useCORS: true, // Enable cross-origin resource sharing for external resources
        scale: 2, // Increase scale for better image quality
        logging: true, // Enable logging for debugging
      });

      // Convert the canvas to a data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Trigger the download
      const link = document.createElement("a");
      link.download = name;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error capturing image:", error);
    } finally {
      // Clean up: remove the element from the DOM
      document.body.removeChild(element);
    }
  };

  // Preload Bengali font on component initialization
  useEffect(() => {
    const font = new FontFace(
      "Noto Sans Bengali",
      "url(https://fonts.gstatic.com/s/notosansbengali/v20/Cn-0JtiGWQ5qoGhSDmkc_VJZMzt6BsA3wBZed4.ttf)"
    );
    font.load().then(() => document.fonts.add(font));
  }, []);

  // Handle the download process
  const handleDownload = async () => {
    // Download the cover page
    setisLoading(true)
    const coverPage = createPageElement("", true);
    await downloadImage(coverPage, "chithi-cover.png");

    // Split the chithi text into pages and download each page
    const pages = splitText(chithi, 100);
    const promises = Array.from({ length: pages.length }, (_, i) =>
      downloadImage(createPageElement(pages[i]), `chithi-page-${i + 1}.png`)
    );
    const result = await Promise.all(promises);
    console.log(result);
    setisLoading(false)
  };

  return (
    <>
      <Card className="min-w-[300px] md:w-[60%] w-[90%]">
        <CardHeader className="flex flex-row justify-center">
          <Image src="/logo.png" width={200} height={200} alt="Dakbaksho" />
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="title">শিরোনাম</Label>
            <Input
              className="border-primary"
              type="text"
              id="title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="userName">আপনার নাম</Label>
            <Input
              className="border-primary"
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <Label htmlFor="chithi">আপনার চিঠি</Label>
            <Textarea
              className="border-primary"
              rows={10}
              value={chithi}
              onChange={(e) => setchithi(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={handleDownload}
            disabled={!title || !userName || !chithi || isLoading}
          >
            {isLoading?<Loader2 className="animate-spin"/>:<Download />} ডাউনলোড করুন
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Chithicontainer;