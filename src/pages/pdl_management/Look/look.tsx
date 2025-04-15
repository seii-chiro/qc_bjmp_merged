import { Look } from "@/lib/definitions"
import { deleteLook, getLook } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import { MdOutlineFileOpen } from "react-icons/md";
import AddLook from "./AddLook";
import EditLook from "./EditLook";

type LookProps = {
    id: number;
    updated_at: string;
    name: string;
    description: string;
    updated_by: number | null;
};

const Looks = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [look, setLook] = useState< LookProps | null>(null);
    
    const { data } = useQuery({
        queryKey: ['look'],
        queryFn: () => getLook(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLook(token ?? "", id),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["look"] });
        messageApi.success("Look deleted successfully");
    },
    onError: (error: any) => {
        messageApi.error(error.message || "Failed to delete Look");
    },
    });

    const dataSource = data?.map((look, index) => (
        {
            key: index + 1,
            id: look?.id ?? 'N/A',
            name: look?.name ?? 'N/A',
            description: look?.description ?? 'N/A',
            updated_by: look?.updated_by ?? 'N/A',
            updated_at: look?.updated_at ?? 'N/A'
        }
    )) || [];

    const filteredData = dataSource?.filter((look) =>
        Object.values(look).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );
    const columns: ColumnsType<LookProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Look',
            dataIndex: 'name',
            key: 'name',
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
        title: 'Last Updated by',
        dataIndex: 'updated_by',
        key: 'updated_by',
        },
        {
        title: "Actions",
        key: "actions",
        render: (_: any, record: LookProps) => (
            <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                <Button type="primary" onClick={() => {
                        setLook(record);
                        setIsEditModalOpen(true);
                        }}>
                    <AiOutlineEdit />
                </Button>
                <Button type="primary" danger onClick={() => deleteMutation.mutate(record.id)}>
                    <AiOutlineDelete />
                </Button>
                <Button type="primary" ghost>
                <MdOutlineFileOpen />
                </Button>
            </div>
        ),
    },
    ]
    return (
        <div>
        {contextHolder}
        <div className="flex gap-2 flex-col">
            <div className="flex justify-between items-center">
            <div>
                <button type="button" className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center text-sm md:text-[16px] justify-center" onClick={showModal}>
                <GoPlus />
                Add Look
                </button>
            </div>
            </div>
            <div>
            <Table columns={columns} dataSource={filteredData} />
            </div>
            <Modal
            className="rounded-lg scrollbar-hide"
            title="Add Look"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
                width="40%"
            >
                <AddLook onClose={handleCancel}/>
            </Modal>
            <Modal
                title="Edit Skill"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditLook
                    look={look}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
        </div>
    )
}

export default Looks
