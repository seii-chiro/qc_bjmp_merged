/* eslint-disable @typescript-eslint/no-explicit-any */
import useEmblaCarousel from 'embla-carousel-react'
import VisitorProfileId from './visitorIdentityLandscape'
import { useCallback, useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useQuery } from '@tanstack/react-query'
import { useTokenStore } from '@/store/useTokenStore'

async function getOneVisitor(token: string): Promise<any[]> {
    const res = await fetch("http://192.168.50.204:8001/api/visitors/visitor/7/", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch PDLs data.");
    }

    return res.json();
}

const VisitorProfileSlider = () => {
    const token = useTokenStore()?.token
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
    const [autoPlay, setAutoPlay] = useState(true)
    const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null)

    const handle = useFullScreenHandle();
    const contentRef = useRef<HTMLDivElement>(null)

    const { data } = useQuery({
        queryKey: ['test'],
        queryFn: () => getOneVisitor(token ?? "")
    })

    console.log(data)

    const downloadAsImage = async () => {
        if (!contentRef.current) return
        const canvas = await html2canvas(contentRef.current, { scale: 2 })
        const link = document.createElement("a")
        link.download = "identification.png"
        link.href = canvas.toDataURL("image/png")
        link.click()
    }

    const downloadAsPDF = async () => {
        if (!contentRef.current) return
        const canvas = await html2canvas(contentRef.current, { scale: 2 })
        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
        pdf.save("identification_landscape.pdf")
    }

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    // Toggle autoplay function
    const toggleAutoPlay = useCallback(() => {
        setAutoPlay(prev => !prev)
    }, [])

    // Setup autoplay functionality
    useEffect(() => {
        if (!emblaApi) return

        if (autoPlay) {
            // Start autoplay with 5 second interval
            autoPlayIntervalRef.current = setInterval(() => {
                if (emblaApi.canScrollNext()) {
                    emblaApi.scrollNext()
                } else {
                    emblaApi.scrollTo(0) // Reset to first slide if at the end
                }
            }, 5000)
        } else if (autoPlayIntervalRef.current) {
            // Clear interval when autoplay is disabled
            clearInterval(autoPlayIntervalRef.current)
            autoPlayIntervalRef.current = null
        }

        // Cleanup function
        return () => {
            if (autoPlayIntervalRef.current) {
                clearInterval(autoPlayIntervalRef.current)
                autoPlayIntervalRef.current = null
            }
        }
    }, [emblaApi, autoPlay])

    // Add keyboard event listener for arrow keys
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                scrollPrev();
                // Temporarily pause autoplay on manual navigation
                if (autoPlay && autoPlayIntervalRef.current) {
                    clearInterval(autoPlayIntervalRef.current)
                    autoPlayIntervalRef.current = setTimeout(() => {
                        setAutoPlay(true)
                    }, 5000) // Resume autoplay after 5 seconds
                }
            } else if (event.key === 'ArrowRight') {
                scrollNext();
                // Temporarily pause autoplay on manual navigation
                if (autoPlay && autoPlayIntervalRef.current) {
                    clearInterval(autoPlayIntervalRef.current)
                    autoPlayIntervalRef.current = setTimeout(() => {
                        setAutoPlay(true)
                    }, 5000) // Resume autoplay after 5 seconds
                }
            }
        };

        // Add event listener
        window.addEventListener('keydown', handleKeyDown);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [scrollPrev, scrollNext, autoPlay]);

    return (
        <>
            <FullScreen handle={handle}>
                <div className="w-full h-full relative flex justify-center items-center overflow-x-hidden">
                    <div className="w-full h-full" ref={emblaRef}>
                        <div className="flex h-full">
                            {[1, 2, 3, 4].map((id) => (
                                <div key={id} className="flex-[0_0_100%]" ref={id === 1 ? contentRef : undefined}>
                                    <VisitorProfileId />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity duration-300 opacity-20 hover:opacity-100 bg-black/20 hover:bg-black/60 text-white"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity duration-300 opacity-20 hover:opacity-100 bg-black/20 hover:bg-black/60 text-white"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Play/Pause Button */}
                    <button
                        onClick={toggleAutoPlay}
                        className="absolute bottom-4 right-4 p-2 rounded-full transition-opacity duration-300 opacity-40 hover:opacity-100 bg-black/30 hover:bg-black/70 text-white"
                        aria-label={autoPlay ? "Pause automatic slideshow" : "Play automatic slideshow"}
                    >
                        {autoPlay ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                </div>
            </FullScreen>
            <div className="flex gap-2 mt-2">
                <button className="bg-gray-800 text-white p-2 rounded" onClick={handle.enter}>Fullscreen</button>
                <button className="bg-blue-600 text-white p-2 rounded" onClick={downloadAsImage}>Download as Image</button>
                <button className="bg-green-600 text-white p-2 rounded" onClick={downloadAsPDF}>Download as PDF</button>
                <button
                    className={`p-2 rounded flex items-center gap-1 ${autoPlay ? 'bg-red-500' : 'bg-green-500'} text-white`}
                    onClick={toggleAutoPlay}
                >
                    {autoPlay ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Play</>}
                </button>
            </div>
        </>
    )
}

export default VisitorProfileSlider