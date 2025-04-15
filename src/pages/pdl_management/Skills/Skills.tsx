import { Skill } from "@/lib/definitions"
import { deleteSKILLS, getSkills } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import EditSkill from "./EditSkill";
import AddSkills from "./AddSkills";
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";

type SkillProps = Skill;

const Skills = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [skills, setSkills] = useState<SkillProps | null>(null);

    const { data } = useQuery({
        queryKey: ['skills'],
        queryFn: () => getSkills(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteSKILLS(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skill"] });
            messageApi.success("Skill deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Skill");
        },
    });

    const dataSource = data?.map((skills, index) => (
        {
            key: index + 1,
            id: skills?.id ?? 'N/A',
            name: skills?.name ?? 'N/A',
            description: skills?.description ?? 'N/A',
            record_status: skills?.record_status ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((skills) =>
        Object.values(skills).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<SkillProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Skills',
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
            render: (_: any, record: SkillProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button type="primary" onClick={() => {
                    setSkills(record);
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
                    Add Skills
                </button>
            </div>
            <div>
                <Table columns={columns} dataSource={filteredData}/>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Skill"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="30%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
                >
                <AddSkills onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Skill"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditSkill
                    skill={skills}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Skills
