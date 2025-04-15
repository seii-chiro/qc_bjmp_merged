import { getRecord_Status } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Button, Form, Input, Select, Radio, message } from "antd";
import { useState } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type ContactProps = {
    type: string;
    value: string;
    is_primary: boolean;
    mobile_imei: string;
    remarks: string;
    contact_status: boolean;
    record_status_id?: number;
};

const AddContact = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false);

    const [contactForm, setContactForm] = useState<ContactProps>({
        type: "",
        value: "",
        remarks: "",
        is_primary: false,
        mobile_imei: "",
        contact_status: false,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            }
        ]
    });

    const recordStatusData = results[0].data;

    async function addContact(contact: ContactProps) {
        const res = await fetch(`${BASE_URL}/api/standards/contacts/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(contact),
        });

        if (!res.ok) {
            let errorMessage = "Error Adding Contact";

            try {
                const errorData = await res.json();
                errorMessage =
                    errorData?.message ||
                    errorData?.error ||
                    JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }

            throw new Error(errorMessage);
        }

        return res.json();
    }

    const contactMutation = useMutation({
        mutationKey: ['contact'],
        mutationFn: addContact,
        onSuccess: (data) => {
            console.log(data);
            messageApi.success("Added successfully");
            onClose();
        },
        onError: (error) => {
            console.error(error);
            messageApi.error(error.message);
        },
    });

    const handleSubmit = () => {
        setIsLoading(true);
        contactMutation.mutate(contactForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setContactForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onRecordStatusChange = (value: number) => {
        setContactForm(prevForm => ({
            ...prevForm,
            record_status_id: value
        }));
    };

    const onIsPrimaryChange = (e: any) => {
        setContactForm(prevForm => ({
            ...prevForm,
            is_primary: e.target.value === "yes",
        }));
    };

    const onContactStatusChange = (value: boolean) => {
        setContactForm(prevForm => ({
            ...prevForm,
            contact_status: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <input 
                        type="text" 
                        name="type" 
                        id="type" 
                        onChange={handleInputChange} 
                        placeholder="Contact Type" 
                        className="h-12 border border-gray-300 rounded-lg px-2" 
                    />
                    <input 
                        type="text" 
                        name="value" 
                        id="value" 
                        onChange={handleInputChange} 
                        placeholder="Details" 
                        className="h-12 border border-gray-300 rounded-lg px-2" 
                    />
                    <input 
                        type="number" 
                        name="mobile_imei" 
                        id="mobile_imei" 
                        onChange={handleInputChange} 
                        placeholder="Mobile IMEI" 
                        className="h-12 border border-gray-300 rounded-lg px-2" 
                    />
                    <input 
                        type="text" 
                        name="remarks" 
                        id="remarks" 
                        onChange={handleInputChange} 
                        placeholder="Remarks" 
                        className="h-12 border border-gray-300 rounded-lg px-2" 
                    />
                    <div>
                        <label>Is Primary:</label>
                        <Radio.Group onChange={onIsPrimaryChange} value={contactForm.is_primary ? "yes" : "no"}>
                            <Radio value="yes">Yes</Radio>
                            <Radio value="no">No</Radio>
                        </Radio.Group>
                    </div>
                    <div>
                        <label>Contact Status:</label>
                        <Select
                            onChange={onContactStatusChange}
                            value={contactForm.contact_status}
                            placeholder="Select status"
                            className="w-full"
                        >
                            <Select.Option value={true}>Active</Select.Option>
                            <Select.Option value={false}>Inactive</Select.Option>
                        </Select>
                    </div>
                    <div>
                        <label>Record Status:</label>
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Record Status"
                        optionFilterProp="label"
                        onChange={onRecordStatusChange}
                        options={recordStatusData?.map(status => (
                            {
                                value: status.id,
                                label: status?.status,
                            }
                        ))}
                    />
                    </div>
                </div>
                <Button 
                    type="primary" 
                    onClick={handleSubmit} 
                    loading={isLoading}
                    className="mt-4"
                >
                    Submit
                </Button>
            </form>
        </div>
    );
};

export default AddContact;
