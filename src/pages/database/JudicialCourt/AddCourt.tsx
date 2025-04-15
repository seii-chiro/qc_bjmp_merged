import { Button, message, Modal, Table } from "antd";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import AddBranch from "./AddBranch";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation } from "@tanstack/react-query";
import { BRANCH, COURT } from "@/lib/urls";

type CourtProps = {
    court: string;
    description: string;
};

type BranchProps = {
    court_id: number; 
    region_id: number;
    province_id: number;
    record_status_id: number;
    branch: string;
    judge: string;
};

const AddCourt = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [branches, setBranches] = useState<BranchProps[]>([]);
    const [courtForm, setCourtForm] = useState<CourtProps>({
        court: '',
        description: '',
    });

    const addCourt = async (court: CourtProps) => {
        const res = await fetch(COURT.postCOURT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(court),
        });
    
        if (!res.ok) throw new Error("Error adding court");
        const responseData = await res.json();
        console.log("Court creation response:", responseData); // Log the response to check the court_id
        return responseData; // Ensure this returns the court object with the id
    };
    
    // Add Branch Mutation
    const addBranch = async (branch: BranchProps) => {
        try {
            console.log('Sending branch:', branch);
        
            const response = await fetch(BRANCH.postBRANCH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(branch),
            });
        
            const text = await response.text();
            console.log('Branch response text:', text);
        
            if (!response.ok) {
                console.error('Response not OK:', response.status, text);
                throw new Error(`Error adding branch: ${text}`);
            }
        
            return JSON.parse(text);
        } catch (error) {
            console.error('Error adding branch:', error);
            throw error;
        }
    };

    const courtMutation = useMutation({
        mutationKey: ['court'],
        mutationFn: addCourt,
        onSuccess: (data) => {
            console.log("Court added successfully, now adding branches:", branches);
            const court_id = data?.id; // Ensure that court_id exists in the response
            
            if (!court_id) {
                messageApi.error("Court ID is missing in the response");
                return;
            }
    
            // Only proceed to add branches if the court_id is valid
            branches.forEach((branch) => {
                // Add court_id to the branch and mutate to add the branch
                branchMutation.mutate({ ...branch, court_id });
            });
    
            messageApi.success("Court and branches submitted!");
            onClose(); // Close the modal or reset state as needed
        },
        onError: (err: any) => {
            console.error('Error adding court:', err);
            messageApi.error(err.message);
        },
    });
    

    // Branch Mutation
    const branchMutation = useMutation({
        mutationKey: ['branch'],
        mutationFn: addBranch,
        onError: (err: any) => {
            console.error('Error adding branch:', err);
            messageApi.error(err.message);
        },
    });

    // Show Modal to add Branch
    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    // Handle Court Form Submission
    const handleCourtSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!courtForm.court || !courtForm.description || branches.length === 0) {
            messageApi.error("Please fill all fields and add at least one branch.");
            return;
        }
        courtMutation.mutate(courtForm);
    };

    // Handle Court Form Input Change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCourtForm((prev) => ({ ...prev, [name]: value }));
    };

    // Handle Branch Removal
    const handleRemoveBranch = (index: number) => {
        setBranches((prev) => prev.filter((_, i) => i !== index));
    };

    // Table Columns for Branches
    const columns = [
        { title: 'Court', dataIndex: 'court', key: 'court' },
        { title: 'Region', dataIndex: 'region', key: 'region' },
        { title: 'Province', dataIndex: 'province', key: 'province' },
        { title: 'Branch', dataIndex: 'branch', key: 'branch' },
        { title: "Judge's Name", dataIndex: 'judge', key: 'judge' },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, __: any, index: number) => (
                <Button danger onClick={() => handleRemoveBranch(index)}>
                    <AiOutlineDelete />
                </Button>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleCourtSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                    <div className="space-y-2 w-full mt-5">
                        <h1 className="text-[#1E365D] font-bold text-lg">Judicial Court Name</h1>
                        <input
                            type="text"
                            name="court"
                            value={courtForm.court}
                            onChange={handleInputChange}
                            placeholder="Court"
                            className="h-12 border w-full border-gray-300 rounded-lg px-2"
                        />
                    </div>
                    <div className="space-y-2 w-full mt-5">
                        <h1 className="text-[#1E365D] font-bold text-lg">Description</h1>
                        <input
                            type="text"
                            name="description"
                            value={courtForm.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            className="h-12 border w-full border-gray-300 rounded-lg px-2"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center pt-4 pb-2 justify-between">
                        <h1 className="text-[#1E365D] font-bold md:text-lg">Add a Branch Court</h1>
                        <button
                            type="button"
                            onClick={showModal}
                            className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center"
                        >
                            <GoPlus />
                            Add Branch
                        </button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={branches}
                        rowKey={(_, index) => (index !== undefined ? index.toString() : Math.random().toString())}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border border-[#1e365d] text-[#1e365d] px-3 py-2 rounded-md"
                        >
                            Cancel
                        </button>
                        <button type="submit" className="bg-[#1E365D] text-white px-3 py-2 rounded-md">
                            Save
                        </button>
                    </div>
                </div>
            </form>

            <Modal
                className="rounded-lg scrollbar-hide"
                title="Add A Branch of Philippines Judicial Court"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
            >
                <AddBranch
                    courtName={courtForm.court}
                    onAddBranch={(branch) => {
                        setBranches((prev) => [...prev, { ...branch, court: courtForm.court }]);
                        setIsModalOpen(false);
                    }}
                    onCancel={handleCancel}
                />
            </Modal>
        </div>
    );
};

export default AddCourt;
