import { Button, message, Modal, Table } from "antd"
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import { MdOutlineFileOpen } from "react-icons/md"
import AddCourt from "./AddCourt";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteCourt, getCourt } from "@/lib/queries";

type CourtProps = {
    id: number;
    court: string;
    description: string;
    updated_by: string;
    updated_at: string;
}

const Court = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectcourt, setSelectedCourt] = useState<CourtProps | null>(null);

    const { data } = useQuery({
        queryKey: ['court'],
        queryFn: () => getCourt(token ?? ""),
    })

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCourt(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["court"] });
            messageApi.success("Court deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Court");
        },
    });

    const dataSource = data?.map((court, index) => (
        {
            key: index + 1,
            id: court?.id ?? 'N/A',
            court: court?.court ?? 'N/A',
            description: court?.description ?? 'N/A',
            updated_by: court?.updated_by ?? 'N/A',
            updated_at: court?.updated_at ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((court) =>
        Object.values(court).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Court',
            dataIndex: 'court',
            key: 'court',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Last Updated',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: 'Updated By',
            dataIndex: 'updated_by',
            key: 'updated_by',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: CourtProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="primary">
                    <AiOutlineEdit />
                </Button>
                <Button type="primary" danger onClick={() => deleteMutation.mutate(record.id)}>
                    <AiOutlineDelete />
                </Button>
                <Button type="primary" ghost >
                    <MdOutlineFileOpen />
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
                    Add Judicial Court
                </button>
            </div>
            <div>
                <Table columns={columns} dataSource={filteredData}/>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Judicial Court"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                >
                <AddCourt onClose={handleCancel}/>
            </Modal>
            <Modal
                title="Edit Judicial Court"
                footer={null}
            >
            </Modal>
        </div>
    )
}

export default Court
