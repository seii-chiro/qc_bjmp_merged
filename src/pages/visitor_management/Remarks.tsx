import { RemarksForm as RemarksFormType, VisitorForm } from "@/lib/visitorFormDefinition"
import { Modal, Table } from "antd"
import { ColumnsType } from "antd/es/table"
import { Plus } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import RemarksForm from "./RemarksForm"
import { UserAccounts } from "@/lib/definitions"

type Props = {
    deleteRemarksByIndex: (index: number) => void;
    setVisitorForm: Dispatch<SetStateAction<VisitorForm>>;
    visitorForm: VisitorForm;
    currentUser: UserAccounts | null;
}


const Remarks = ({ setVisitorForm, currentUser, deleteRemarksByIndex }: Props) => {

    const [idsModalOpen, setIdsModalOpen] = useState(false)
    const [remarksTableInfo, setRemarksTableInfo] = useState<RemarksFormType[]>([])

    const handleModalOpen = () => {
        setIdsModalOpen(true)
    }

    const handleModalClose = () => {
        setIdsModalOpen(false)
    }

    const deleteRemark = (index: number) => {
        const updatedRemarks = [...remarksTableInfo];
        updatedRemarks.splice(index, 1);
        setRemarksTableInfo(updatedRemarks);
    }

    const IdentifierDataSource = remarksTableInfo?.map((remarks, index) => {
        return ({
            key: index,
            timestamp: remarks?.timestamp,
            createdBy: remarks?.created_by,
            remarks: remarks?.remarks,
            actions: (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center items-center">
                    <button
                        type="button"
                        className="border border-blue-500 text-blue-500 hover:bg-blue-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineEdit />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            deleteRemarksByIndex(index)
                            deleteRemark(index)
                        }}
                        className="border border-red-500 text-red-500 hover:bg-red-600 hover:text-white py-1 rounded w-10 h-10 flex items-center justify-center"
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            )
        })
    })


    const identifierColumn: ColumnsType<{
        timestamp: string | undefined;
        createdBy: string | undefined;
        remarks: string | null;
        actions: JSX.Element;
    }> = [
            {
                title: 'Time Stamp',
                dataIndex: 'timestamp',
                key: 'timestamp',
            },
            {
                title: 'Created by',
                dataIndex: 'createdBy',
                key: 'createdBy',
            },
            {
                title: 'Notes/ Remarks',
                align: 'center',
                dataIndex: 'remarks',
                key: 'remarks',
                width: '50%'
            },
            {
                title: "Actions",
                key: "actions",
                dataIndex: "actions",
                align: 'center',
            },
        ];


    return (
        <div className="flex flex-col gap-5 mt-10">
            <Modal
                centered
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Remarks"
                open={idsModalOpen}
                onCancel={handleModalClose}
                footer={null}
                width="50%"
            >
                {currentUser && (
                    <RemarksForm
                        setRemarksTableInfo={setRemarksTableInfo}
                        setVisitorForm={setVisitorForm}
                        currentUser={currentUser}
                        handleModalCancel={handleModalClose}
                    />
                )}
            </Modal>

            <div className="flex justify-between items-center">
                <h1 className='font-bold text-xl'>Remarks</h1>
                <button
                    className="flex gap-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-400"
                    type="button"
                    onClick={handleModalOpen}
                >
                    <Plus />
                    Add Remarks
                </button>
            </div>
            <Table
                className="border text-gray-200 rounded-md"
                dataSource={IdentifierDataSource}
                columns={identifierColumn}
                scroll={{ x: 800 }}
            />
        </div>
    )
}
export default Remarks