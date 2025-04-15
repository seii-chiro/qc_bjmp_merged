import { getIdTypes, getPDLs, getVisitor_to_PDL_Relationship } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries } from "@tanstack/react-query";
import { Table, Modal } from "antd";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineFileSearch } from "react-icons/ai";
import PDLToVisitForm from "./PDLToVisitForm";
import RequirementsForm from "./RequirementsForm";
import IdForm from "./IdForm";
import { PersonForm, VisitorForm } from "@/lib/visitorFormDefinition";
import { ColumnsType } from "antd/es/table";
import { AiOutlineFullscreen } from "react-icons/ai";
import { Sibling } from "@/lib/pdl-definitions";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

type Props = {
    deleteMediaRequirementByIndex: (index: number) => void;
    deleteMediaIdentifierByIndex: (index: number) => void;
    deletePdlToVisit: (index: number) => void;
    setPersonForm: Dispatch<SetStateAction<PersonForm>>;
    setVisitorForm: Dispatch<SetStateAction<VisitorForm>>;
    personForm: PersonForm
}

export type PdlToVisitForm = {
    lastName: string | null;
    firstName: string | null;
    middleName: string | null;
    relationship: number | null;
    level: string | null;
    annex: string | null;
    dorm: string | null;
    visitationStatus: string | null;
    multipleBirthClass: Sibling | null;
}

type PdlToVisitTable = PdlToVisitForm[] | null

const PDLtovisit = ({ setPersonForm, personForm, setVisitorForm, deletePdlToVisit, deleteMediaIdentifierByIndex, deleteMediaRequirementByIndex }: Props) => {
    const token = useTokenStore()?.token

    const idFullscreenHandle = useFullScreenHandle()
    const requirementFullscreenHandle = useFullScreenHandle()

    const [pdlToVisitModalOpen, setPdlToVisitModalOpen] = useState(false)
    const [requirementModalOpen, setRequirementModalOpen] = useState(false)
    const [idsModalOpen, setIdsModalOpen] = useState(false)

    const [pdlToVisitTableInfo, setPdlToVisitTableInfo] = useState<PdlToVisitTable>([])

    const results = useQueries({
        queries: [
            {
                queryKey: ['pdls'],
                queryFn: () => getPDLs(token ?? "")
            },
            {
                queryKey: ['realtionship-to-pdl'],
                queryFn: () => getVisitor_to_PDL_Relationship(token ?? "")
            },
            {
                queryKey: ['id-types'],
                queryFn: () => getIdTypes(token ?? "")
            }
        ]
    })

    const pdls = results?.[0]?.data
    const pdlsLoading = results?.[0]?.isLoading
    const visitorToPdlRelationship = results?.[1]?.data
    const idTypes = results?.[2]?.data

    const handlePdlToVisitModalOpen = () => {
        setPdlToVisitModalOpen(true)
    }

    const handlePdlToVisitModalCancel = () => {
        setPdlToVisitModalOpen(false)
    }

    const handleRequirementsModalOpen = () => {
        setRequirementModalOpen(true)
    }

    const handleRequirementsModalCancel = () => {
        setRequirementModalOpen(false)
    }

    const handleIdsModalOpen = () => {
        setIdsModalOpen(true)
    }

    const handleIdsModalCancel = () => {
        setIdsModalOpen(false)
    }

    const handleDeletePdl = (index: number) => {
        setPdlToVisitTableInfo(prev => prev?.filter((_, i) => i !== index) || []);
        deletePdlToVisit(index)
    };


    const pdlToVisitDataSource = pdlToVisitTableInfo?.map((pdl, index) => {
        return ({
            key: index,
            lastname: pdl?.lastName,
            firstName: pdl?.firstName,
            middleName: pdl?.middleName,
            relationship: pdl?.relationship,
            level: pdl?.level,
            annex: pdl?.annex,
            dorm: pdl?.dorm,
            visitationStatus: pdl?.visitationStatus,
            birthClassClassification: pdl?.multipleBirthClass?.multiple_birth_class,
            action: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        className="border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        className="border  border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-1 rounded flex w-10 h-10 items-center justify-center"
                    >
                        <AiOutlineFileSearch />
                    </button>
                    <button
                        type="button"
                        className="border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-1 rounded flex w-10 h-10 items-center justify-center"
                        onClick={() => handleDeletePdl(index)}
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const visitorToPdlRelationshipColumns: ColumnsType<{
        key: number;
        lastname: string | null;
        firstName: string | null;
        middleName: string | null;
        relationship: number | null;
        level: string | null;
        annex: string | null;
        dorm: string | null;
        visitationStatus: string | null;
        birthClassClassification: string | undefined;
        action: JSX.Element;
    }> = [
            {
                title: 'Last Name',
                dataIndex: 'lastname',
                key: 'lastname',
            },
            {
                title: 'First Name',
                dataIndex: 'firstName',
                key: 'firstName',
            },
            {
                title: 'Middle Name',
                dataIndex: 'middleName',
                key: 'middleName',
            },
            {
                title: 'Relationship to PDL',
                dataIndex: 'relationship',
                key: 'relationship',
            },
            {
                title: 'Level',
                dataIndex: 'level',
                key: 'level',
            },
            {
                title: 'Annex',
                dataIndex: 'annex',
                key: 'annex',
            },
            {
                title: 'Dorm',
                dataIndex: 'dorm',
                key: 'dorm',
            },
            {
                title: 'PDL Visitation Status',
                dataIndex: 'visitationStatus',
                key: 'visitationStatus',
            },
            {
                title: 'Multiple Birth Classification',
                dataIndex: 'birthClassClassification',
                key: 'multipleBirthClass',
            },
            {
                title: "Actions",
                key: "actions",
                align: 'center',
                dataIndex: 'action'
            },
        ];

    const requirementDataSources = personForm?.media_requirement_data?.map((requirement, index) => {
        return ({
            key: index,
            requirement: requirement?.name,
            description: requirement?.media_data?.media_description,
            image: (
                requirement?.media_data?.media_base64 ? (
                    <FullScreen handle={requirementFullscreenHandle} className="flex items-center justify-center">
                        <img
                            src={`data:image/bmp;base64,${requirement?.media_data?.media_base64}`}
                            alt="Identifier"
                            style={{
                                width: requirementFullscreenHandle?.active ? '50%' : '50px',
                                height: requirementFullscreenHandle?.active ? '50%' : '50px',
                                objectFit: 'cover'
                            }}
                        />
                    </FullScreen>
                ) : (
                    <span>No Image Available</span>
                )
            ),
            verificationStatus: requirement?.status,
            remarks: requirement?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={requirementFullscreenHandle?.enter}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineFullscreen />
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteMediaRequirementByIndex(index)}
                        className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const requirementColumn: ColumnsType<{
        key: number;
        requirement: string | undefined;
        description: string | undefined;
        image: JSX.Element;
        verificationStatus: "Under Review" | "Rejected" | "Approved" | "Pending";
        remarks: string;
        actions: JSX.Element;
    }> = [
            {
                title: 'Requirement',
                dataIndex: 'requirement',
                key: 'requirement',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Scanned Image',
                dataIndex: 'image',
                key: 'image',
                align: 'center',
            },
            {
                title: 'Verification Status',
                dataIndex: 'verificationStatus',
                key: 'verificationStatus',
            },
            {
                title: 'Notes / Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
                title: "Actions",
                key: "actions",
                dataIndex: "actions",
                align: 'center',
            },
        ];

    const IdentifierDataSource = personForm?.media_identifier_data?.map((identififier, index) => {
        return ({
            key: index,
            requirement: idTypes?.find(id => id?.id === identififier?.id_type_id)?.id_type,
            description: identififier?.media_data?.media_description,
            image: (
                identififier?.media_data?.media_base64 ? (
                    <FullScreen handle={idFullscreenHandle} className="flex items-center justify-center">
                        <img
                            src={`data:image/bmp;base64,${identififier?.media_data?.media_base64}`}
                            alt="Identifier"
                            style={{
                                width: idFullscreenHandle?.active ? '50%' : '50px',
                                height: idFullscreenHandle?.active ? '50%' : '50px',
                                objectFit: 'cover'
                            }}
                        />
                    </FullScreen>
                ) : (
                    <span>No Image Available</span>
                )
            ),
            verificationStatus: identififier?.status,
            remarks: identififier?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={idFullscreenHandle?.enter}
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineFullscreen />
                    </button>
                    <button
                        type="button"
                        onClick={() => deleteMediaIdentifierByIndex(index)}
                        className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })

    const identifierColumn: ColumnsType<{
        key: number;
        requirement: string | undefined;
        description: string | undefined;
        image: JSX.Element;
        verificationStatus: "Under Review" | "Rejected" | "Approved" | "Pending";
        remarks: string;
        actions: JSX.Element;
    }> = [
            {
                title: 'Requirement',
                dataIndex: 'requirement',
                key: 'requirement',
            },
            {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
            },
            {
                title: 'Scanned Image',
                dataIndex: 'image',
                key: 'image',
                align: 'center',
            },
            {
                title: 'Verification Status',
                dataIndex: 'verificationStatus',
                key: 'verificationStatus',
            },
            {
                title: 'Notes / Remarks',
                dataIndex: 'remarks',
                key: 'remarks',
            },
            {
                title: "Actions",
                key: "actions",
                dataIndex: "actions",
                align: 'center',
            },
        ];

    return (
        <div>
            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add PDL To Visit"
                open={pdlToVisitModalOpen}
                onCancel={handlePdlToVisitModalCancel}
                footer={null}
                width="70%"
            >
                <PDLToVisitForm
                    handlePdlToVisitModalCancel={handlePdlToVisitModalCancel}
                    pdlToVisitTableInfo={pdlToVisitTableInfo || []}
                    setPdlToVisitTableInfo={setPdlToVisitTableInfo}
                    setVisitorForm={setVisitorForm}
                    visitorToPdlRelationship={visitorToPdlRelationship || []}
                    pdls={pdls || []}
                    pdlsLoading={pdlsLoading}
                />
            </Modal>

            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Requirements"
                open={requirementModalOpen}
                onCancel={handleRequirementsModalCancel}
                footer={null}
                width="50%"
            >
                <RequirementsForm
                    handleRequirementsModalCancel={handleRequirementsModalCancel}
                    setPersonForm={setPersonForm}
                />
            </Modal>

            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add an ID"
                open={idsModalOpen}
                onCancel={handleIdsModalCancel}
                footer={null}
                width="50%"
            >
                <IdForm
                    setPersonForm={setPersonForm}
                    idTypes={idTypes || []}
                    handleIdsModalCancel={handleIdsModalCancel}
                />
            </Modal>

            <div className="w-full">
                {/* PDL to Visit */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>PDL to Visit</h1>
                        <button
                            className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                            type="button"
                            onClick={handlePdlToVisitModalOpen}
                        >
                            <Plus />
                            Add PDL To Visit
                        </button>
                    </div>
                    <Table
                        className="border text-gray-200 rounded-md"
                        dataSource={pdlToVisitDataSource}
                        columns={visitorToPdlRelationshipColumns}
                        scroll={{ x: 800 }}
                    />
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>Requirements</h1>
                        <button
                            className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                            type="button"
                            onClick={handleRequirementsModalOpen}
                        >
                            <Plus />
                            Add Requirements
                        </button>
                    </div>
                    <Table
                        className="border text-gray-200 rounded-md"
                        dataSource={requirementDataSources}
                        columns={requirementColumn}
                        scroll={{ x: 800 }}
                    />
                </div>

                {/* Identifiers */}
                <div className="flex flex-col gap-5 mt-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-xl'>Identifiers</h1>
                        <button
                            className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                            type="button"
                            onClick={handleIdsModalOpen}
                        >
                            <Plus />
                            Add Indentifiers
                        </button>
                    </div>
                    <Table
                        className="border text-gray-200 rounded-md"
                        dataSource={IdentifierDataSource}
                        columns={identifierColumn}
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
        </div>
    );
}

export default PDLtovisit;