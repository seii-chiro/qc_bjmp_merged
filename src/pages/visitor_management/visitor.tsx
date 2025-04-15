import { getVisitorSpecific, getVisitorSpecificById } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useQuery } from "@tanstack/react-query"
import { message, Table, Modal } from "antd"
import { useState } from "react"
import { ColumnsType } from "antd/es/table"
import { VisitorRecord } from "@/lib/definitions"
import { calculateAge } from "@/functions/calculateAge"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import noimg from '../../../public/noimg.png'

type Visitor = VisitorRecord;

const Visitor = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const token = useTokenStore().token;
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const { data } = useQuery({
        queryKey: ['visitor'],
        queryFn: async () => {
            try {
                return await getVisitorSpecific(token ?? "");
            } catch (error) {
                console.error("Error fetching visitor data:", error);
                return [];
            }
        },
        retry: false,
    });
    
    const leftSideImage = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === "Left"
    );
    const ProfileImage = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === "Front"
    );
    const RightImage = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === "Right"
    );
    const Signature = selectedVisitor?.person?.media?.find(
        (m: any) => m.picture_view === null
    );
    const RightThumb = selectedVisitor?.person?.biometrics?.find(
        (m: any) => m.position === "finger_right_thumb"
    );
    const Waiver = selectedVisitor?.person?.media_requirements?.find(
        (m: any) => m.direct_image
    );

    const dataSource: (Visitor & { key: number })[] = data?.map((visitor, index) => ({
        ...visitor,
        key: index + 1,
        visitor_reg_no: visitor?.visitor_reg_no ?? 'N/A', 
        approved_by: visitor?.approved_by ?? 'N/A', 
    })) || [];
    
    const filteredData = dataSource?.filter((visitor:any) =>
        Object.values(visitor).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const getStatusBadge = (status:any) => {
        switch (status?.toLowerCase()) { 
            case 'verified':
                return { color: 'bg-green-500', text: 'Verified' };
            case 'pending approval':
                return { color: 'bg-yellow-500', text: 'Pending Approval' };
            case 'not verified':
                return { color: 'bg-red-500', text: 'Not Verified' };
            case 'incomplete':
                return { color: 'bg-orange-500', text: 'Incomplete' };
            case 'under review':
                return { color: 'bg-blue-500', text: 'Under Review' };
            case 'rejected':
                return { color: 'bg-gray-500', text: 'Rejected' };
            case 'banned':
                return { color: 'bg-black', text: 'Banned' };
            case 'flagged':
                return { color: 'bg-purple-500', text: 'Flagged' };
            case 'resubmitted required':
                return { color: 'bg-pink-500', text: 'Resubmitted Required' };
            case 'escorted':
                return { color: 'bg-teal-500', text: 'Escorted' };
            case 'pre-registered':
                return { color: 'bg-indigo-500', text: 'Pre-Registered' };
            default:
                return { color: 'bg-gray-300', text: 'Unknown' };
        }
    };
    
    const columns: ColumnsType<Visitor> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Visitor No.',
            dataIndex: 'visitor_reg_no',
            key: 'visitor_reg_no',
        },
        {
            title: 'Visitor Name',
            key: 'name',
            render: (_, visitor) => (
                `${visitor?.person?.first_name ?? 'N/A'} ${visitor?.person?.middle_name ?? ''} ${visitor?.person?.last_name ?? 'N/A'}`.trim()
            ),
        },
        {
            title: 'Gender',
            key: 'gender',
            render: (_, visitor) => visitor?.person?.gender?.gender_option ?? 'N/A',
        },
        {
            title: 'Visitor Type',
            dataIndex: 'visitor_type',
            key: 'visitor_type',
        },
        {
            title: 'Visitor Status',
            dataIndex: 'visitor_app_status',
            key: 'visitor_app_status',
            render: (status) => {
                const { color, text } = getStatusBadge(status);
                return (
                    <span className={`inline-block px-2 py-1 rounded text-white ${color}`}>
                        {text}
                    </span>
                );
            },
        },
        {
            title: 'Approved By',
            dataIndex: 'approved_by',
            key: 'approved_by',
        },
    ];

    const handleRowClick = async (record: Visitor) => {
        setSelectedVisitor(null); 
        try {
            const visitorDetails = await getVisitorSpecificById(record.id, token);
            setSelectedVisitor(visitorDetails);
        } catch (error) {
            console.error("Error fetching visitor details:", error);
            messageApi.error("Failed to load visitor details.");
        }
    };

    const closeModal = () => {
        setSelectedVisitor(null); 
    };

    const Info = ({ title, info }: { title: string; info: string | null }) => (
        <div className="flex items-center">
            <label className="w-28 text-[10px] text-[#8E8E8E]">{title}</label>
            <p className="mt-1 w-full bg-[#F9F9F9] rounded-md px-2 py-[1px] text-sm">{info || ""}</p>
        </div>
    );

    const Box = ({ title, cell }: { title: string; cell: string }) => (
        <div className="text-center w-full">
            <div className="w-full border-2 border-[#2F3237] rounded-lg h-8 flex items-center text-xs justify-center">
                {cell || ""}
            </div>
            <p className="text-[#27272] text-xs">{title}</p>
        </div>
    );

    const handleDownloadPDF = async () => {
        if (!modalContentRef.current) return;
    
        const canvas = await html2canvas(modalContentRef.current, {
            scale: 2,
            useCORS: true,
        });
    
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        
        const imgWidth = 210; 
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
        let heightLeft = imgHeight;
        let position = 0;
    
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
    
        pdf.save(`${selectedVisitor?.id || "visitor"}-profile.pdf`);
    };
    
    return (
        <div>
            <div className="h-[90vh] flex flex-col">
                {contextHolder}
                <div className="md:max-w-64 w-full bg-white flex ml-auto pb-2">
                    <input
                    type="text"
                    placeholder="Search visitors..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full p-2 outline-none border bg-gray-100 rounded-md"
                    />
                </div>
                <div className="flex-grow overflow-y-auto overflow-x-auto">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    scroll={{ x: 800, y: 'calc(100vh - 200px)' }} 
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                    })}
                    />
                </div>
                </div>
            <Modal
                open={selectedVisitor !== null}
                onCancel={closeModal}
                footer={null}
                className="top-0 pt-5"
                width={'45%'}
            >
                {selectedVisitor && (
                    <div ref={modalContentRef} className="flex flex-col items-center justify-center min-h-screen">
                        <div className="w-full max-w-xl space-y-3">
                            <div className="w-full text-center py-1 bg-[#2F3237] text-[#FFEFEF]">
                                <h1 className="text-xs font-medium">QUEZON CITY JAIL MALE DORM</h1>
                                <h2 className="font-bold">VISITORS CODE IDENTIFICATION</h2>
                            </div>
                            <div className="md:px-3 space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 space-y-3 md:space-y-0 md:space-x-3">
                                    <div className="space-y-3 w-full flex flex-col">
                                    <div className="border border-[#EAEAEC] rounded-xl p-2 flex shadow-md shadow-[#8E8E8E]/20 place-items-center bg-white">
                                            <div className="bg-[#C4C4C4] w-full h-56 rounded-xl">
                                            {ProfileImage?.media_binary ? (
                                                <img
                                                    src={`data:image/bmp;base64,${ProfileImage.media_binary}`}
                                                    alt="Profile Picture"
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                                ) : (
                                                    <img
                                                    src={noimg}
                                                    alt="No Image"
                                                    className="w-full h-full object-contain p-5 bg-gray-100 rounded-lg"
                                                    />
                                            )}
                                            </div>
                                        </div>
                                        <div className="border shadow-md shadow-[#8E8E8E]/20 h-[9.2rem] border-[#EAEAEC] rounded-xl py-2 px-3 overflow-hidden">
                                            <p className="text-[#404958] text-sm">Visitor History</p>
                                            <div className="overflow-y-auto h-full">
                                                <table className="w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            <th className="rounded-l-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Date</th>
                                                            <th className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Duration</th>
                                                            <th className="bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Login</th>
                                                            <th className="rounded-r-lg bg-[#2F3237] text-white py-1 px-2 font-semibold text-xs">Logout</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">0</td>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">0</td>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">0</td>
                                                            <td className="border-b border-[#DCDCDC] text-[9px] font-light p-1 text-center">0</td>
                                                        </tr>
                                                        {/* You can add more rows here as needed */}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-2 w-full">
                                            <p className="text-[#404958] text-sm">Visitors/Dalaw Basic Info</p>
                                            <div className="grid grid-cols-1 gap-2">
                                                <Info title="Type of Visitor:" info={selectedVisitor?.visitor_type ?? "N/A"} />
                                                <Info title="Surname:" info={selectedVisitor?.person?.last_name || "N/A"}/>
                                                <Info title="First Name:" info={selectedVisitor?.person?.first_name || "N/A"}/>
                                                <Info title="Middle Name:" info={selectedVisitor?.person?.middle_name || "N/A"} />
                                                <Info title="Address:" info={selectedVisitor?.person?.addresses?.[0]
                                                ? `${selectedVisitor?.person.addresses[0].street}, ${selectedVisitor?.person.addresses[0].barangay}, ${selectedVisitor?.person.addresses[0].municipality}, ${selectedVisitor?.person.addresses[0].province}, ${selectedVisitor?.person.addresses[0].region}, ${selectedVisitor?.person.addresses[0].postal_code}`
                                                : "N/A"
                                                } />
                                                <Info title="Gender:" info={selectedVisitor?.person?.gender?.gender_option || "N/A"} />
                                                <Info title="Age:" info={selectedVisitor?.person?.date_of_birth ? String(calculateAge(selectedVisitor?.person.date_of_birth)) : null} />
                                                <Info title="Birthday:" info={selectedVisitor?.person?.date_of_birth || "N/A"} />
                                                <div className="flex items-center">
                                                    <label className="w-48 text-[10px] text-[#8E8E8E]">Relationship to PDL:</label>
                                                    <p className="mt-1 block w-full bg-[#F9F9F9] rounded-md text-xs px-2 py-[1px]">
                                                        {selectedVisitor?.pdls?.[0]?.relationship_to_pdl_str || "No PDL relationship"}
                                                    </p>
                                                </div>
                                                <Info title="Requirements:" info={selectedVisitor?.person?.media_requirements?.[0]?.name || "N/A"} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border border-[#EAEAEC] shadow-md shadow-[#8E8E8E]/20 rounded-xl p-2 w-full">
                                    <div className="w-full flex flex-col">
                                        <div className="flex text-center mb-1">
                                            <div className="flex-grow">
                                                <h1 className="text-[#404958] text-sm">PDL Basic Info</h1>
                                            </div>
                                            <div className="flex-grow">
                                                <h1 className="text-[#404958] text-sm">Cell Assigned</h1>
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto h-10">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr className="bg-[#2F3237] text-white text-xs">
                                                        <th className="py-1 px-2">PDL NO.</th>
                                                        <th className="py-1 px-2">Surname</th>
                                                        <th className="py-1 px-2">First Name</th>
                                                        <th className="py-1 px-2">Middle Name</th>
                                                        <th className="py-1 px-2">Level</th>
                                                        <th className="py-1 px-2">Annex</th>
                                                        <th className="py-1 px-2">Dorm</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">N/A</td>
                                                        <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">N/A</td>
                                                        <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">N/A</td>
                                                        <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">N/A</td>
                                                        <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">N/A</td>
                                                        <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">N/A</td>
                                                        <td className="border-b border-[#DCDCDC] text-center text-[9px] font-light">N/A</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:mx-3 border border-[#EAEAEC] rounded-xl p-2 flex flex-col space-y-2 shadow-md shadow-[#8E8E8E]/20 place-items-center bg-white">
                                <div className="w-full flex flex-wrap gap-2 text-center"> 
                                    <div className="flex flex-col md:flex-row gap-2">
                                        <div className="flex flex-col md:flex-row gap-2">
                                            {/* Waiver */}
                                            <div className="space-y-2">
                                                <div className="rounded-lg bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                                    Waiver
                                                </div>
                                                <div className="border flex flex-col w-full rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Waiver 1</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                        {Waiver?.data ? (
                                                            <img
                                                                src={`data:image/bmp;base64,${Waiver.data}`}
                                                                alt="Waiver"
                                                                className="w-full md:max-w-[7.75rem] h-full object-cover rounded-b-lg"
                                                            />
                                                            ) : (
                                                            <img className="w-full md:max-w-[7.75rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        )}
                                                        </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="rounded-lg bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                                    Requirement
                                                </div>
                                                <div className="border flex flex-col w-full rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Cohabitation</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                        <img className="w-full md:max-w-[7.76rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        </div>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="rounded-lg w-full bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                                Identification Marking
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                                <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Right Thumbmark</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                    {RightThumb?.data ? (
                                                            <img
                                                                src={`data:image/bmp;base64,${RightThumb.data}`}
                                                                alt="Right Thumb"
                                                                className="w-full md:max-w-[7.76rem] h-full object-cover rounded-b-lg"
                                                            />
                                                            ) : (
                                                            <img className="w-full md:max-w-[7.75rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                            )}
                                                    </div>
                                                </div>
                                                <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                    <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Signature</div>
                                                    <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                        {Signature?.media_binary ? (
                                                            <img
                                                            src={`data:image/bmp;base64,${Signature.media_binary}`}
                                                            alt="Signature"
                                                            className="w-full md:max-w-[7.76rem] h-full object-cover rounded-b-lg"
                                                            />
                                                        ) : (
                                                            <img
                                                            src={noimg}
                                                            alt="No Image"
                                                            className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="w-full space-y-2 text-center">
                                        <div className="rounded-lg w-full bg-[#2F3237] text-white py-[2px] px-2 font-semibold text-xs">
                                        Identification Pictures
                                        </div>
                                        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-2">
                                        <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Close Up Front</div>
                                                <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                {ProfileImage?.media_binary ? (
                                                        <img
                                                            src={`data:image/bmp;base64,${ProfileImage.media_binary}`}
                                                            alt="Left side"
                                                            className="w-full h-full object-cover rounded-b-lg"
                                                        />
                                                        ) : (
                                                        <img className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        )}
                                                </div>
                                            </div>
                                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Full Body Front</div>
                                                <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                    {ProfileImage?.media_binary ? (
                                                        <img
                                                            src={`data:image/bmp;base64,${ProfileImage.media_binary}`}
                                                            alt="Left side"
                                                            className="w-full h-full object-cover rounded-b-lg"
                                                        />
                                                        ) : (
                                                        <img className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        )}
                                                </div>
                                            </div>
                                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                                <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Left Side</div>
                                                <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                    {leftSideImage?.media_binary ? (
                                                        <img
                                                            src={`data:image/bmp;base64,${leftSideImage.media_binary}`}
                                                            alt="Left side"
                                                            className="w-full h-full object-cover rounded-b-lg"
                                                        />
                                                        ) : (
                                                        <img className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg" src={noimg} alt="No Image" />
                                                        )}
                                                </div>
                                            </div>
                                            <div className="border flex flex-col rounded-xl border-[#EAEAEC] h-32">
                                            <div className="w-full bg-white rounded-t-xl text-[#404958] text-xs py-1.5 font-semibold">Right Side</div>
                                            <div className="rounded-b-lg bg-white flex-grow flex items-center justify-center overflow-hidden">
                                                {RightImage?.media_binary ? (
                                                <img
                                                    src={`data:image/bmp;base64,${RightImage.media_binary}`}
                                                    alt="Right side"
                                                    className="w-full h-full object-cover rounded-b-lg"
                                                />
                                                ) : (
                                                <img
                                                    src={noimg}
                                                    alt="No Image"
                                                    className="w-full md:max-w-[7.7rem] h-full object-contain p-5 bg-gray-100 rounded-b-lg"
                                                />
                                                )}
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end ml-auto pr-10 mt-5">
                            <button
                                onClick={handleDownloadPDF}
                                className="px-4 py-1 bg-[#2F3237] text-white rounded-md text-sm"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Visitor;
