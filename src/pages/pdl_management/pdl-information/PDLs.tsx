import Spinner from "@/components/loaders/Spinner"
import { getPDLs } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useQuery } from "@tanstack/react-query"
import { Modal, Table } from "antd"
import { useState } from "react"
import { GoPlus } from "react-icons/go"
import PDLRegistration from "./PDLRegistration"


const PDLs = () => {
    const token = useTokenStore().token;
        const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['pdls'],
        queryFn: () => getPDLs(token ?? ""),
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((pdl, index) => (
        {
            key: index + 1,
            firstName: pdl?.first_name ?? 'N/A',
            lastName: pdl?.last_name ?? 'N/A',
            middleName: pdl?.middle_name ?? 'N/A',
            email: pdl?.email ?? 'N/A',
            address: pdl?.address ?? 'N/A',
            phoneNo: pdl?.phone_no ?? 'N/A',
            telephoneNo: pdl?.telephone ?? 'N/A',
        }
    ))

    const columns = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Middle Name',
            dataIndex: 'middleName',
            key: 'middleName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Phone No.',
            dataIndex: 'phoneNo',
            key: 'phoneNo',
        },
        {
            title: 'Telephone No.',
            dataIndex: 'telephone',
            key: 'telephones',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    if (isLoading) return <Spinner />
    if (error) return <div>{error.message}</div>

    return (
        <div>
            <div className="w-full flex gap-5">
                <button
                    onClick={showModal}
                    className="bg-blue-500 text-white px-8 py-2 rounded-md flex gap-1 items-center justify-center">
                    <GoPlus />
                    Add PDL Visitor
                </button>
            </div>
            <Table dataSource={dataSource} columns={columns} />;
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Jail Facility"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '70%',
                    xl: '70%',
                    xxl: '55%',
                }}
                height={"80%"}
            >
                <PDLRegistration onClose={handleCancel}/>
            </Modal>

        </div>
    )
}

export default PDLs