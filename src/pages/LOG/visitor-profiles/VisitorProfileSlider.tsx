import useEmblaCarousel from 'embla-carousel-react'
import VisitorProfileId from './visitorIdentityLandscape'
import { useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const VisitorProfileSlider = () => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })

    const handle = useFullScreenHandle();
    const contentRef = useRef<HTMLDivElement>(null)

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

    return (
        <>
            <FullScreen handle={handle}>
                <div className="w-full h-full relative flex justify-center items-center overflow-x-hidden">
                    <div className="w-full h-full" ref={emblaRef}>
                        <div className="flex h-full">
                            {[1, 2, 3, 4].map((id) => (
                                <div key={id} className="flex-[0_0_100%]">
                                    <VisitorProfileId />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Left Arrow */}
                    <button
                        onClick={scrollPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity duration-300 opacity-20 hover:opacity-100 bg-black/20 hover:bg-black/60 text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition-opacity duration-300 opacity-20 hover:opacity-100 bg-black/20 hover:bg-black/60 text-white"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </FullScreen>
            <div className="flex gap-2 mt-2">
                <button className="bg-[#333] text-white p-2" onClick={handle.enter}>Fullscreen</button>
                <button className="bg-blue-600 text-white p-2" onClick={downloadAsImage}>Download as Image</button>
                <button className="bg-green-600 text-white p-2" onClick={downloadAsPDF}>Download as PDF</button>
            </div>
        </>
    )
}

export default VisitorProfileSlider
