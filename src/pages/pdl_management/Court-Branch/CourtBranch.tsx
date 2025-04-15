import { deleteBranch, getBranch } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import moment from "moment";
import AddCourtBranch from "./AddCourtBranch";

type BranchProps = {
    id: number;
    updated_by: string;
    province: string;
    region: string;
    court: string;
    updated_at: string;
    branch: string;
    judge: string;
};

const CourtBranch = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [branch, setBranch] = useState<BranchProps | null>(null);

    const { data } = useQuery({
        queryKey: ['branch'],
        queryFn: () => getBranch(token ?? ""),
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteBranch(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["branch"] });
            messageApi.success("Court Branch deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Court Branch");
        },
    });

    const dataSource = data?.map((court_branch, index) => (
        {
            key: index + 1,
            id: court_branch?.id ?? 'N/A',
            court: court_branch?.court ?? 'N/A',
            region: court_branch?.region ?? 'N/A',
            province: court_branch?.province ?? 'N/A',
            branch: court_branch?.branch ?? 'N/A',
            judge: court_branch?.judge ?? 'N/A',
            updated_by: court_branch?.updated_by ?? 'N/A',
            updated_at: moment(court_branch?.updated_at).format('YYYY-MM-DD h:mm A') ?? 'N/A', 
        }
    )) || [];

    const filteredData = dataSource?.filter((court_branch) =>
        Object.values(court_branch).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<BranchProps> = [
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
            title: 'Branch',
            dataIndex: 'branch',
            key: 'branch',
        },
        {
            title: 'Judge',
            dataIndex: 'judge',
            key: 'judge',
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
            title: 'Updated By',
            dataIndex: 'updated_by',
            key: 'updated_by',
        },
        {
            title: 'Updated At',
            dataIndex: 'updated_at',
            key: 'updated_at',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: BranchProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="primary" onClick={() => {
                        setBranch(record);
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
    ];

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
                    Add Court Branch
                </button>
            </div>
            <div>
                <Table columns={columns} dataSource={filteredData} />
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Interest"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="40%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddCourtBranch onClose={handleCancel} />
            </Modal>
        </div>
    );
};

export default CourtBranch;
