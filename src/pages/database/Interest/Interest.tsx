import { deleteINTEREST, getInterests } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddInterest from "./AddInterest";
import EditInterest from "./EditInterest";

type InterestProps = {
    id: number;
    name: string;
    description: string;
    record_status: string;
};

const Interest = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [interest, setInterest] = useState<InterestProps | null>(null);

    const { data } = useQuery({
        queryKey: ['interest'],
        queryFn: () => getInterests(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteINTEREST(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interest"] });
            messageApi.success("Interest deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Interest");
        },
    });

    const dataSource = data?.map((interest, index) => (
        {
            key: index + 1,
            id: interest?.id ?? 'N/A',
            name: interest?.name ?? 'N/A',
            description: interest?.description ?? 'N/A',
            record_status: interest?.record_status ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((interest) =>
        Object.values(interest).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<InterestProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Interests',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Record Status',
            dataIndex: 'record_status',
            key: 'record_status',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: InterestProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="primary" onClick={() => {
                    setInterest(record);
                    setIsEditModalOpen(true);
                }}>
                    <AiOutlineEdit />
                </Button>
                <Button type="primary" danger onClick={() => deleteMutation.mutate(record.id)}>
                    <AiOutlineDelete />
                </Button>
                </div>
            ),
        },
    ]

    return (
        <div>
            {contextHolder}
            <div className="flex justify-end items-center gap-2 mb-2">
                <div className="flex-1 relative flex items-center justify-end">
                    <input
                        placeholder="Search"
                        type="text"
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border border-gray-400 h-10 w-80 rounded-md px-2 active:outline-none focus:outline-none"
                    />
                    <LuSearch className="absolute right-[1%] text-gray-400" />
                </div>
                <button type="button" className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center" onClick={showModal}>
                    <GoPlus />
                    Add Interest
                </button>
            </div>
            <div>
                <Table columns={columns} dataSource={filteredData}/>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Interest"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddInterest onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Interest"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditInterest
                    interest={interest}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Interest
