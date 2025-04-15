import { FullScreen, useFullScreenHandle } from "react-full-screen"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useRef } from "react"

const IdentificationLandscape = () => {
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
    
    
    const Info = ({title, info}: {title: string, info: string | null}) => {
        return (
            <div className="flex items-center">
                <label className="w-56 text-[#8E8E8E]">{title}</label>
                <p className="mt-1 w-full bg-[#F9F9F9] rounded-md h-9">{info}</p>
            </div>
        )
    }

    const Title = ({title } : { title: string}) => {
        return (
            <div className="rounded-lg h-fit w-full bg-[#2F3237] text-white py-2 px-2 font-semibold">
                {title}
            </div>
        )
    }

    const Cards = ({title, img } : { title: string, img?: string }) => {
        return (
            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-[11.05rem]">
                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">{title}</div>
                <div className="w-full rounded-b-lg bg-[#7E7E7E] flex-grow">{img}</div>
            </div>
        )
    }
    return (
        <div>
            <FullScreen handle={handle}>
                <div ref={contentRef} className={`w-full min-h-screen flex flex-col space-y-3 ${handle.active ? "h-screen bg-white" : ""}`}>
                    <div className="w-full text-center py-5 bg-[#2F3237] text-[#FFEFEF]">
                        <h1 className="font-medium font-lg">QUEZON CITY JAIL MALE DORM</h1>
                        <h2 className="font-bold text-3xl">VISITORS CODE IDENTIFICATION</h2>
                    </div>
                    <div className="bg-white py-2 md:py-8 px-2 md:px-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div className="border border-[#EAEAEC] rounded-xl p-4 flex shadow-md shadow-[#8E8E8E]/20 bg-white">
                                <div className="bg-[#C4C4C4] w-full h-64 md:min-h-96 rounded-xl">
                                </div>
                            </div>
                            {/* Visitor History */}
                        <div className="border shadow-md space-y-5 shadow-[#8E8E8E]/20 border-[#EAEAEC] rounded-xl p-5">
                            <p className="text-[#404958] font-semibold">Visitor History</p>
                            <div className="flex">
                                <div className="w-full">
                                    <div className="rounded-l-lg bg-[#2F3237] text-white py-1 px-2 font-semibold">
                                        Date
                                    </div>
                                    <div className="rounded-l-lg border-l border-t border-b border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        0
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold">
                                        Duration
                                    </div>
                                    <div className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        <div className=" text-center rounded-full bg-[#D8D8D8]">
                                    0
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] text-white py-1 px-2 font-semibold">
                                        Login
                                    </div>
                                    <div className="border-b border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        <div className=" text-center">
                                    0
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full">
                                    <div className="bg-[#2F3237] rounded-r-lg text-white py-1 px-2 font-semibold">
                                        Logout
                                    </div>
                                    <div className="border-b border-r rounded-r-lg border-t border-[#DCDCDC] flex flex-col gap-2 text-center font-light p-1 mt-2">
                                        <div className="text-center">
                                    0
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        <div className="w-full space-y-4">
                            {/* Visitor's Basic Info Section */}
                        <div className="space-y-4">
                            <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-4 w-full">
                                <p className="text-[#404958] font-semibold">Visitors/Dalaw Basic Info</p>
                                <div className="grid grid-cols-1 mt-2 gap-4">
                                    <Info title="Type of Visitor:" info={''} />
                                    <Info title="Surname:" info={''}/>
                                    <Info title="First Name:" info={''}/>
                                    <Info title="Middle Name:" info={''} />
                                    <Info title="Address:" info={''} />
                                    <Info title="Gender:" info={''} />
                                    <Info title="Age:" info={''} />
                                    <Info title="Birthday:" info={''} />
                                    <Info title="Birthday:" info={''} />
                                    <Info title="Relationship to PDL:" info={''} />
                                    <Info title="Requirements:" info={''} />
                                </div>
                            </div> 
                        </div>
                        
                        </div>
                        <div className="border border-[#EAEAEC] rounded-xl p-4 md:p-2 space-y-2 shadow-md shadow-[#8E8E8E]/20  bg-white">
                            <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Title title="Waiver" />
                                    <Cards title="Waiver 1" img="" />
                                </div>
                                <div className="space-y-2">
                                    <Title title="Requirement" />
                                    <Cards title="Cohabitation" img="" />
                                </div>
                            </div>
                            <div className="space-y-2 text-center">
                                <Title title="Identification Markings" />
                                <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                                    <Cards title="Right Thumbmark" img=""/>
                                    <Cards title="Signature" img=""/>
                                </div>
                            </div>
                            <div className="space-y-2 text-center">
                                <Title title="Identification Pictures" />
                                <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                                    <Cards title="Close Up Front" img="" />
                                    <Cards title="Full Body Front" img="" />
                                </div>
                                <div className=" grid grid-cols-1 text-center md:grid-cols-2 gap-2">
                                    <Cards title="Left Side" img="" />
                                    <Cards title="Right Side" img="" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </FullScreen>
            <div className="flex gap-2 mt-2">
                <button className="bg-[#333] text-white p-2" onClick={handle.enter}>Fullscreen</button>
                <button className="bg-blue-600 text-white p-2" onClick={downloadAsImage}>Download as Image</button>
                <button className="bg-green-600 text-white p-2" onClick={downloadAsPDF}>Download as PDF</button>
            </div>
        </div>
    )
}

export default IdentificationLandscape
