import { VisitortoPDLRelationship } from '@/lib/definitions';
import { PDLs } from '@/lib/pdl-definitions';
import { VisitorForm } from '@/lib/visitorFormDefinition';
import { Input, Select, message } from 'antd';
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PdlToVisitForm } from './PDLtovisit';


type Props = {
    setVisitorForm: Dispatch<SetStateAction<VisitorForm>>;
    visitorToPdlRelationship: VisitortoPDLRelationship[] | null;
    setPdlToVisitTableInfo: Dispatch<SetStateAction<PdlToVisitForm[] | null>>
    pdlToVisitTableInfo: PdlToVisitForm[]
    pdls: PDLs[];
    pdlsLoading: boolean;
    handlePdlToVisitModalCancel: () => void;
}

const PDLToVisitForm = ({ setVisitorForm, visitorToPdlRelationship, pdls, pdlsLoading, setPdlToVisitTableInfo, pdlToVisitTableInfo, handlePdlToVisitModalCancel }: Props) => {
    const [pdlToVisitID, setPdlToVisitID] = useState<number | null>(null)
    const [selectedPdl, setSelectedPdl] = useState<PDLs | null>(null);

    const [helperForm, setHelperForm] = useState<PdlToVisitForm>({
        lastName: null,
        firstName: null,
        middleName: null,
        relationship: null,
        level: null,
        annex: null,
        dorm: null,
        visitationStatus: null,
        multipleBirthClass: null,
    })

    useEffect(() => {
        if (pdlToVisitID !== null) {
            const pdl = pdls?.find(pdl => pdl?.id === pdlToVisitID) ?? null;
            setSelectedPdl(pdl);
            setHelperForm(prev => ({
                ...prev,
                lastName: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.person?.last_name ?? null,
                firstName: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.person?.first_name ?? null,
                middleName: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.person?.middle_name ?? null,
                annex: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.cell?.floor ?? null,
                multipleBirthClass: selectedPdl?.person?.multiple_birth_siblings?.[0] ?? null,
                dorm: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.cell?.cell_name ?? null,
                level: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.jail?.jail_name ?? null,
                visitationStatus: pdls?.find(pdl => pdl?.id === pdlToVisitID)?.visitation_status ?? null,
            }));
        } else {
            setSelectedPdl(null);
        }
    }, [pdlToVisitID, pdls, selectedPdl]);


    const insertHelperForm = () => {
        // Check if an entry with the same values already exists (you can define the condition here)
        const exists = pdlToVisitTableInfo.some(entry =>
            entry.lastName === helperForm.lastName &&
            entry.firstName === helperForm.firstName &&
            entry.middleName === helperForm.middleName &&
            entry.relationship === helperForm.relationship &&
            entry.level === helperForm.level &&
            entry.annex === helperForm.annex &&
            entry.dorm === helperForm.dorm &&
            entry.visitationStatus === helperForm.visitationStatus &&
            entry.multipleBirthClass === helperForm.multipleBirthClass
        );

        // If no duplicate, insert the helperForm data
        if (!exists) {
            setPdlToVisitTableInfo(prevState => [...(prevState || []), helperForm]);
        }
    };

    return (
        <div className='w-full'>
            <form
                className='w-full flex flex-col gap-4 p-4'
            >
                <div className='flex gap-8'>
                    <div className='flex-1'>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="last-name" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Last Name <span className='text-red-500'>*</span></span>
                                <Select
                                    loading={pdlsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdls?.map(pdl => ({
                                        value: pdl?.id,
                                        label: pdl?.person?.last_name
                                    }))}
                                    onChange={(value) =>
                                        setPdlToVisitID(value)
                                    }
                                />
                            </label>
                            <label htmlFor="first-name" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>First Name <span className='text-red-500'>*</span></span>
                                <Select
                                    loading={pdlsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdls?.map(pdl => ({
                                        value: pdl?.id,
                                        label: pdl?.person?.first_name
                                    }))}
                                    onChange={(value) =>
                                        setPdlToVisitID(value)
                                    }
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="middle-name" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Middle Name </span>
                                <Select
                                    loading={pdlsLoading}
                                    showSearch
                                    value={pdlToVisitID}
                                    optionFilterProp="label"
                                    className="h-12 rounded-md outline-gray-300 !bg-gray-100"
                                    options={pdls?.map(pdl => ({
                                        value: pdl?.id,
                                        label: pdl?.person?.middle_name
                                    }))}
                                    onChange={(value) =>
                                        setPdlToVisitID(value)
                                    }
                                />
                            </label>
                            <label htmlFor="mbc" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Multiple Birth Classification </span>
                                <Input
                                    value={helperForm?.multipleBirthClass?.multiple_birth_class ?? ""}
                                    className='h-12 rounded-md outline-gray-300'
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="level" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Level <span className='text-red-500'>*</span></span>
                                <Input
                                    value={helperForm?.level ?? ""}
                                    id='level'
                                    className='h-12'
                                />
                            </label>
                            <label htmlFor="annex" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Annex </span>
                                <Input
                                    value={helperForm?.annex ?? ""}
                                    id='annex'
                                    className='h-12'
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="dorm" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Dorm <span className='text-red-500'>*</span></span>
                                <Input
                                    value={helperForm?.dorm ?? ""}
                                    id='dorm'
                                    className='h-12'
                                />
                            </label>
                            <label htmlFor="pdl-visitation-status" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>PDL Visitation Status <span className='text-red-500'>*</span></span>
                                <Input
                                    value={helperForm?.visitationStatus ?? ""}
                                    id='pdl-visitation-status'
                                    className='h-12'
                                />
                            </label>
                        </div>
                        <div className='flex w-full justify-between gap-4'>
                            <label htmlFor="relationship" className='flex-1 flex flex-col gap-1'>
                                <span className='font-semibold'>Relationship <span className='text-red-500'>*</span></span>
                                <Select
                                    showSearch
                                    optionFilterProp="label"
                                    value={helperForm?.relationship}
                                    className='h-12 rounded-md outline-gray-300 !bg-gray-100'
                                    options={visitorToPdlRelationship?.map(relationship => ({
                                        value: relationship?.id,
                                        label: relationship?.relationship_name
                                    }))}
                                    onChange={value => setHelperForm(prev => ({
                                        ...prev,
                                        relationship: value
                                    }))}
                                />
                            </label>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <div className="border border-gray-400 bg-gray-200 rounded w-full h-full">
                            {
                                selectedPdl?.person?.biometrics && (
                                    // Find the object with the type 'face' in the biometrics array
                                    selectedPdl?.person?.biometrics.find(bio => bio.type === "face")?.image && (
                                        <img
                                            src={selectedPdl?.person?.biometrics.find(bio => bio.type === "face")?.image}
                                            alt="pdl image"
                                        />
                                    )
                                )
                            }
                        </div>
                    </div>
                </div>

                <div className='w-[30%] flex gap-4 ml-[70%]'>
                    <button
                        type="button"
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={() => {
                            setPdlToVisitID(null)
                            setSelectedPdl(null)
                            setHelperForm({
                                lastName: null,
                                firstName: null,
                                middleName: null,
                                relationship: null,
                                level: null,
                                annex: null,
                                dorm: null,
                                visitationStatus: null,
                                multipleBirthClass: null,
                            })
                            handlePdlToVisitModalCancel()
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                        onClick={() => {
                            // Only proceed if relationship is selected
                            if (!helperForm?.relationship) {
                                message.error("Please select a relationship");
                                return;
                            }

                            message.success("PDL to visit added successfully!");
                            setVisitorForm(prev => {
                                const alreadySelected = prev.pdl?.some(visitorPdl => visitorPdl.pdl === pdlToVisitID);
                                return {
                                    ...prev,
                                    pdl: alreadySelected
                                        ? prev.pdl
                                        : [...(prev.pdl || []), {
                                            pdl: pdlToVisitID as number,
                                            relationship_to_pdl: helperForm.relationship as number // Ensure it's always a number
                                        }].filter(item => item.pdl !== null)
                                };
                            });
                            insertHelperForm();
                            setPdlToVisitID(null)
                            setSelectedPdl(null)
                            setHelperForm({
                                lastName: null,
                                firstName: null,
                                middleName: null,
                                relationship: null,
                                level: null,
                                annex: null,
                                dorm: null,
                                visitationStatus: null,
                                multipleBirthClass: null,
                            })
                            handlePdlToVisitModalCancel()
                        }}
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    )
}

export default PDLToVisitForm