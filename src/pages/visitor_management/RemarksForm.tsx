import { UserAccounts } from "@/lib/definitions";
import { RemarksForm as RemarksFormType, VisitorForm } from "@/lib/visitorFormDefinition";
import { Input } from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

function getCurrentTimestamp(): string {
    return new Date().toISOString();
}

type Props = {
    setRemarksTableInfo: Dispatch<SetStateAction<RemarksFormType[]>>;
    handleModalCancel: () => void;
    setVisitorForm: Dispatch<SetStateAction<VisitorForm>>;
    currentUser: UserAccounts;
}

const RemarksForm = ({ currentUser, setVisitorForm, setRemarksTableInfo, handleModalCancel }: Props) => {
    const [remarksForm, setRemarksForm] = useState<RemarksFormType>({
        timestamp: "",
        created_by: "",
        remarks: ""
    });

    useEffect(() => {
        // Only update 'created_by' and 'timestamp' if currentUser is available
        if (currentUser) {
            setRemarksForm(prev => ({
                ...prev,
                created_by: `${currentUser.first_name} ${currentUser.last_name}`, // Fix created_by
                timestamp: getCurrentTimestamp()
            }));
        }
    }, [currentUser]);

    const handleSubmit = () => {
        if (remarksForm?.remarks) {
            // Ensure we add the timestamp and created_by in the submitted remark
            const newRemark: RemarksFormType = {
                ...remarksForm,
                timestamp: getCurrentTimestamp(), // Ensure the timestamp is set on every submit
                created_by: `${currentUser.first_name} ${currentUser.last_name}` // Correctly set the full name
            };

            setVisitorForm(prev => ({
                ...prev,
                remarks_data: [
                    ...(prev.remarks_data || []),
                    { remarks: remarksForm?.remarks }
                ]
            }));

            setRemarksTableInfo(prev => ([...prev, newRemark])); // Add the new remark with correct timestamp

            // Reset form
            setRemarksForm({
                timestamp: "",
                created_by: "",
                remarks: ""
            });

            handleModalCancel();
        }
    }

    const handleCancel = () => {
        setRemarksForm({
            timestamp: "",
            created_by: "",
            remarks: ""
        });

        handleModalCancel();
    }

    return (
        <div className="w-full p-5">
            <form className="w-full">
                <div className="w-full flex flex-col gap-4">
                    <div>
                        <label htmlFor="visitor-remarks" className="flex flex-col gap-2">
                            <span className="font-semibold">Remarks</span>
                            <Input.TextArea
                                value={remarksForm?.remarks}
                                id="visitor-remarks"
                                className="!h-72"
                                onChange={e => setRemarksForm(prev => ({ ...prev, remarks: e.target.value }))}
                            />
                        </label>
                    </div>
                    <div className="w-full flex justify-end">
                        <div className="flex gap-4 w-[30%] h-full items-end">
                            <button
                                onClick={handleCancel}
                                type="button"
                                className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="bg-blue-500 text-white rounded-md py-2 px-6 flex-1"
                                onClick={handleSubmit}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default RemarksForm;
