import { deleteContact, getContact } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddContact from "./AddContact";
import EditContact from "./EditContact";

type ContactProps = {
    id: number;
    type: string;
    value: string;
    mobile_imei: string;
    is_primary: boolean;
    contact_status: boolean;
    remarks: string;
}

const ContactType = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [contact, setContact] = useState<ContactProps | null>(null);

    const { data } = useQuery({
        queryKey: ['contact'],
        queryFn: () => getContact(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteContact(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["contact"] });
            messageApi.success("Contact deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Contact");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((contact, index) => (
        {
            key: index + 1,
            id: contact?.id ?? 'N/A',
            type: contact?.type ?? 'N/A',
            value: contact?.value ?? 'N/A',
            remarks: contact?.remarks ?? 'N/A',
            mobile_imei: contact?.mobile_imei ?? 'N/A',
            is_primary: contact?.is_primary ?? 'N/A',
            contact_status: contact?.contact_status ?? 'N/A',
        }
    )) || [];

    const filteredData = dataSource?.filter((contact) =>
        Object.values(contact).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<ContactProps> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Contact Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
        },
        {
            title: 'Remarks',
            dataIndex: 'remarks',
            key: 'remarks',
        },
        {
            title: 'Mobile Imei',
            dataIndex: 'mobile_imei',
            key: 'mobile_imei',
        },
        {
            title: 'Primary (Y/N)',
            dataIndex: 'is_primary',
            key: 'is_primary',
            render: (value: boolean) => (value ? 'Yes' : 'No'),
            },
            {
                title: 'Active (Y/N)',
                dataIndex: 'contact_status',
                key: 'contact_status',
                render: (value: boolean) => (value ? 'Yes' : 'No'),
            },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: ContactProps) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="link"
                        onClick={() => {
                            setContact(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <AiOutlineEdit />
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => deleteMutation.mutate(record.id)}
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ];
    return (
        <div>
            {contextHolder}
                <div className="mb-4 flex justify-between items-center gap-2">
                    <h1 className="text-[#1E365D] text-3xl font-bold">Contact Type</h1>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative flex items-center">
                        <input
                            placeholder="Search"
                            type="text"
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border border-gray-400 h-10 w-96 rounded-md px-2 active:outline-none focus:outline-none"
                        />
                        <LuSearch className="absolute right-[1%] text-gray-400" />
                    </div>
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                        >
                        <GoPlus />
                        Add Contact Type
                    </button>
                    </div>
                </div>
            <div>
                <Table columns={columns} dataSource={filteredData} />
            </div>
            <Modal
            className="overflow-y-auto rounded-lg scrollbar-hide"
            title="Add Occupation"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width="40%"
            style={{ maxHeight: "80vh", overflowY: "auto" }} 
            >
            <AddContact onClose={handleCancel} />
        </Modal>
        <Modal
            title="EditOrganization"
            open={isEditModalOpen}
            onCancel={() => setIsEditModalOpen(false)}
            footer={null}
            >
            <EditContact
                contact={contact}
                onClose={() => setIsEditModalOpen(false)}
            />
        </Modal>
        </div>
    )
}

export default ContactType
