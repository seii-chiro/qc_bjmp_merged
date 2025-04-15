import { Button, message, Modal, Table } from "antd";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { useTokenStore } from "@/store/useTokenStore";
import { ETHNICITYPROVINCE } from "@/lib/urls";
import { useMutation } from "@tanstack/react-query";
import AddEthnicGroup from "./AddEthicGroup";

type AddEthnicProps = {
    ethnicity: string;
    ethnicity_id: number;
    region: string;
    region_id: number;
    province: string;
    province_id: number;
    description: string;
    key?: number;
};


const AddEthnicity = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [ethnicGroups, setEthnicGroups] = useState<AddEthnicProps[]>([]);
    const [selectedEthnicity, setSelectedEthnicity] = useState<AddEthnicProps | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSaveEthnicity = (newEthnicity: AddEthnicProps) => {
        setEthnicGroups(prevEthnicGroups => [
            ...prevEthnicGroups,
            { ...newEthnicity, key: prevEthnicGroups.length + 1 },
        ]);
        setSelectedEthnicity(newEthnicity);
        setIsModalOpen(false);
    };

    const addEthnicity = async (ethnicity: AddEthnicProps) => {
        const res = await fetch(ETHNICITYPROVINCE.postETHNICITYPROVINCE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
                ethnicity_id: ethnicity.ethnicity_id,
                region_id: ethnicity.region_id,
                province_id: ethnicity.province_id,
                description: ethnicity.description,
            }),
        });
    
        if (!res.ok) {
            let errorMessage = "Error Adding Ethnicity Group";
            try {
                const errorData = await res.json();
                console.log("Error data:", errorData); 
                errorMessage =
                    errorData?.message || errorData?.error || JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }
            throw new Error(errorMessage);
        }
    
        return res.json();
    };

    const ethnicityMutation = useMutation({
        mutationKey: ['ethnicity'],
        mutationFn: addEthnicity,
        onSuccess: () => {
            messageApi.success("Ethnicity group added successfully");
        },
        onError: (error: any) => {
            console.error(error);
            messageApi.error(error.message);
        },
    });

    const handleSubmitAll = async () => {
        if (ethnicGroups.length === 0) {
            messageApi.warning("No ethnic groups to submit.");
            return;
        }
    
        for (const group of ethnicGroups) {
            if (!group.ethnicity_id || group.ethnicity_id <= 0) {
                messageApi.warning("Please select a valid Ethnicity.");
                return;
            }
            if (!group.province_id || group.province_id <= 0) {
                messageApi.warning("Please select a valid Province.");
                return;
            }
        }
    
        setIsSubmitting(true);
        try {
            for (const group of ethnicGroups) {
                await ethnicityMutation.mutateAsync(group);
            }
            messageApi.success("All ethnic groups submitted successfully.");
            onClose();
        } catch (err) {
            console.error(err);
            messageApi.error("An error occurred while submitting ethnic groups.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    

    const columns = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Ethnic Group',
            dataIndex: 'ethnicity',
            key: 'ethnicity',
        },
        {
            title: 'Region',
            dataIndex: 'region',
            key: 'region',
        },
        {
            title: 'Province',
            dataIndex: 'province',
            key: 'province',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: "Actions",
            key: "actions",
            render: () => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="primary">
                        <AiOutlineEdit />
                    </Button>
                    <Button type="primary" danger>
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}

            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                <div className="space-y-2 mt-5">
                    <h1 className="text-[#1E365D] font-bold text-lg">Ethnic Group Name</h1>
                    <div className="h-10 border border-gray-300 rounded-lg px-2 w-full flex items-center">
                        {selectedEthnicity?.ethnicity || <span className="text-gray-400">No data</span>}
                    </div>
                </div>
                <div className="space-y-2 mt-5">
                    <h1 className="text-[#1E365D] font-bold text-lg">Description</h1>
                    <div className="h-10 border border-gray-300 rounded-lg px-2 w-full flex items-center">
                        {selectedEthnicity?.description || <span className="text-gray-400">No data</span>}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center pt-4 pb-2 justify-between">
                    <h1 className="text-[#1E365D] font-bold md:text-lg">Add a Filipino Ethnic Group</h1>
                    <button
                        type="button"
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center text-sm md:text-[16px] justify-center"
                        onClick={showModal}
                    >
                        <GoPlus />
                        Add Provinces
                    </button>
                </div>
                <div>
                    <Table columns={columns} dataSource={ethnicGroups} pagination={false} />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="bg-white border border-[#1e365d] text-[#1e365d] px-3 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md"
                        onClick={handleSubmitAll}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>

            <Modal
                className="rounded-lg"
                title="Add a Filipino Ethnic Group by Provinces"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
            >
                <AddEthnicGroup onClose={handleCancel} onSave={handleSaveEthnicity} />
            </Modal>
        </div>
    );
};

export default AddEthnicity;
