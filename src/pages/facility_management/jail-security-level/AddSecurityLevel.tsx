import { useTokenStore } from "@/store/useTokenStore";
import {  useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from "antd";
import { JAIL_SECURITY_LEVEL } from "@/lib/urls";

type AddSecurityLevel = {
    description: string;
    category_name: string;
};

const AddSecurityLevel = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [jailSecurityLevelForm, setJailSecurityLevelForm] = useState<AddSecurityLevel>({
        description: '',
        category_name: '',
    });

    async function addSecurityLevel(jail_security_level: AddSecurityLevel) {
        const res = await fetch(JAIL_SECURITY_LEVEL.getJAIL_SECURITY_LEVEL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(jail_security_level),
        });
    
        if (!res.ok) {
            let errorMessage = "Error registering Jail Security Level";
    
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

    const jailSecurityLevelMutation = useMutation({
        mutationKey: ['jail-type'],
        mutationFn: addSecurityLevel,
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

    const handlejailSecurityLevelSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        jailSecurityLevelMutation.mutate(jailSecurityLevelForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setJailSecurityLevelForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handlejailSecurityLevelSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <input type="text" name="category_name" id="category_name" onChange={handleInputChange} placeholder="Jail Security Level" className="h-12 border border-gray-300 rounded-lg px-2" />
                        <input type="text" name="description" id="description" onChange={handleInputChange} placeholder="Description" className="h-12 border border-gray-300 rounded-lg px-2" />
                    </div>
                </div>

                <div className="w-full flex justify-center mt-10">
                    <button type="submit" className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSecurityLevel;