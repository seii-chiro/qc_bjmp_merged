import { MultipleBirthClassType, Prefix, Suffix } from "@/lib/definitions"
import { Gender, Person } from "@/lib/pdl-definitions"
import { MultiBirthSiblingForm as MultiBirthSiblingFormType, PersonForm } from "@/lib/visitorFormDefinition"
import { Input, Select } from "antd"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { MultiBirthSibling } from "./MultipleBirthSiblings"

type Props = {
    setTableInfo: Dispatch<SetStateAction<MultiBirthSibling>>;
    persons: Person[]
    genders: Gender[]
    setPersonForm: Dispatch<SetStateAction<PersonForm>>;
    birthClassTypes: MultipleBirthClassType[];
    birthClassTypesLoading: boolean;
    handleIdsModalCancel: () => void;
    prefixes: Prefix[];
    suffixes: Suffix[];
    personLoading: boolean
}

const MultiBirthSiblingForm = ({ persons, setPersonForm, handleIdsModalCancel, prefixes, personLoading, setTableInfo, suffixes }: Props) => {
    const [chosenSibling, setChosenSibling] = useState<Person | null>(null)
    const [multiBirthSiblingForm, setMultiBirthSiblingForm] = useState<MultiBirthSiblingFormType>({
        is_identical: true,
        is_verified: false,
        multiple_birth_class_id: 1,
        remarks: "",
        person_id: null,
    })

    const handleSubmit = () => {
        setPersonForm(prev => ({
            ...prev,
            multiple_birth_sibling_data: [
                ...(prev?.multiple_birth_sibling_data || []),
                multiBirthSiblingForm
            ]
        }));

        // Fixing setTableInfo to correctly handle the array update
        setTableInfo(prev => [
            ...(prev || []), // Ensure 'prev' is an array by defaulting to an empty array
            {
                sibling_group: chosenSibling?.multiple_birth_siblings?.[0]?.multiple_birth_class || "",
                short_name: chosenSibling?.shortname || "",
                gender: chosenSibling?.gender?.gender_option || "",
                identical: multiBirthSiblingForm?.is_identical ? "Yes" : "No",
                verified: multiBirthSiblingForm?.is_verified ? "Yes" : "No",
            }
        ]);

        setMultiBirthSiblingForm({
            is_identical: true,
            is_verified: false,
            multiple_birth_class_id: 1,
            remarks: "",
            person_id: null,
        })

        setChosenSibling(null)

        handleIdsModalCancel();
    };

    const handleCancel = () => {
        setMultiBirthSiblingForm({
            is_identical: true,
            is_verified: false,
            multiple_birth_class_id: 1,
            remarks: "",
            person_id: null,
        })
        setChosenSibling(null)
        handleIdsModalCancel();
    }

    useEffect(() => {
        if (multiBirthSiblingForm?.person_id) {
            setMultiBirthSiblingForm(prev => ({
                ...prev,
                multiple_birth_class_id: chosenSibling?.multiple_birth_siblings?.[0]?.id ?? 1

            }))

            setChosenSibling(persons?.find(person => person?.id === multiBirthSiblingForm?.person_id) ?? null)
        }

    }, [multiBirthSiblingForm?.person_id, persons, chosenSibling?.multiple_birth_siblings])

    return (
        <div className="p-5">
            <form className="flex flex-col gap-4">
                <div>
                    <label className="flex flex-col gap-1 w-[30%]">
                        <span className="font-semibold">Person</span>
                        <Select
                            value={multiBirthSiblingForm.person_id ?? undefined}
                            loading={personLoading}
                            showSearch
                            optionFilterProp="label"
                            className='mt-2 h-10 rounded-md outline-gray-300 !bg-gray-100'
                            options={persons?.map(person => ({
                                value: person?.id,
                                label: `${person?.first_name ?? ""} ${person?.middle_name ?? ""} ${person?.last_name ?? ""}`
                            }))}
                            onChange={(value) => {
                                setMultiBirthSiblingForm(prev => (
                                    {
                                        ...prev,
                                        person_id: value
                                    }
                                ))
                            }}
                        />
                    </label>
                </div>
                <div className="flex gap-2">
                    <label htmlFor="" className="flex-1">
                        <span className="font-semibold">Prefix</span>
                        <Input
                            value={prefixes?.find(prefix => prefix?.id === chosenSibling?.prefix)?.prefix}
                            className="h-12"
                        />
                    </label>
                    <label htmlFor="" className="flex-[2]">
                        <span className="font-semibold">Last Name</span>
                        <Input
                            className="h-12"
                            value={chosenSibling?.last_name}
                        />
                    </label>
                    <label htmlFor="" className="flex-[2]">
                        <span className="font-semibold">First Name</span>
                        <Input
                            className="h-12"
                            value={chosenSibling?.first_name}
                        />

                    </label>
                    <label htmlFor="" className="flex-[2]">
                        <span className="font-semibold">Middle Name</span>
                        <Input
                            className="h-12"
                            value={chosenSibling?.middle_name}
                        />
                    </label>
                    <label htmlFor="" className="flex-1">
                        <span className="font-semibold">Suffix</span>
                        <Input
                            className="h-12"
                            value={suffixes?.find(suffix => suffix?.id === chosenSibling?.prefix)?.suffix}
                        />
                    </label>
                </div>

                <div className="flex gap-2 items-center">
                    <label htmlFor="" className="flex-[3]">
                        <span className="font-semibold">Short Name</span>
                        <Input
                            className="h-12"
                            value={chosenSibling?.shortname}
                        />
                    </label>
                    <label htmlFor="" className="flex-[2]">
                        <span className="font-semibold">Gender</span>
                        <Input
                            className="h-12"
                            value={chosenSibling?.gender?.gender_option}
                        />
                    </label>
                    <label htmlFor="" className="flex-[2]">
                        <span className="font-semibold">Sibling Group</span>
                        <Input
                            className="h-12"
                            value={chosenSibling?.multiple_birth_siblings?.[0]?.multiple_birth_class ?? ""}
                        />
                    </label>
                    <label htmlFor="" className="flex-1 flex items-center gap-2 mt-2">
                        <span className="font-semibold">Identical</span>
                        <input
                            checked={multiBirthSiblingForm?.is_identical}
                            type="checkbox"
                            className="w-4 h-4"
                            onChange={e =>
                                setMultiBirthSiblingForm(prev => ({
                                    ...prev,
                                    is_identical: e.target.checked,
                                }))
                            }
                        />
                    </label>
                    <label htmlFor="" className="flex-1 flex items-center gap-2 mt-2">
                        <span className="font-semibold">Verified</span>
                        <input
                            checked={multiBirthSiblingForm?.is_verified}
                            type="checkbox"
                            className="w-4 h-4"
                            onChange={e =>
                                setMultiBirthSiblingForm(prev => ({
                                    ...prev,
                                    is_verified: e.target.checked,
                                }))
                            }
                        />
                    </label>
                </div>

                <div>
                    <label htmlFor="">
                        <span className="font-semibold">Remarks</span>
                        <Input.TextArea
                            className="!h-40"
                            onChange={e => setMultiBirthSiblingForm(prev => ({ ...prev, remarks: e.target.value }))}
                        />
                    </label>
                </div>
                <div className="w-full flex items-end justify-end">
                    <div className="flex gap-4 w-[30%]">
                        <button
                            type="button"
                            className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1 font-semibold"
                            onClick={handleCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1 font-semibold"
                            onClick={handleSubmit}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default MultiBirthSiblingForm