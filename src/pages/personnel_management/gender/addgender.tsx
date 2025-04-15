import { useTokenStore } from "@/store/useTokenStore"
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { message } from 'antd';
import { GENDER_CODE } from "@/lib/urls";

type GenderForm = {
    gender_option: string;
    description: string;
};


const AddGender = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [GenderForm, setGenderForm] = useState<GenderForm>({
        gender_option: '',
        description: '',
    });

    const token = useTokenStore().token

    async function registerGender(gender: GenderForm) {
        const res = await fetch(GENDER_CODE.postGENDER_CODE, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(gender)
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.email[0] || 'Error registering Gender');
        }

        return res.json()
    }

    const genderMutation = useMutation({
        mutationKey: ['gender'],
        mutationFn: registerGender,
        onSuccess: (data) => {
            console.log(data)
            messageApi.success("added successfully")
        },
        onError: (error) => {
            console.error(error)
            messageApi.error(error.message)
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGenderForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const handleGenderSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        genderMutation.mutate(GenderForm)
    }

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleGenderSubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                        <input type="text" name="gender_option" id="gender_option" onChange={handleInputChange} placeholder="Gender Option" className="h-12 border border-gray-300 rounded-lg px-2" />
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
    )
}

export default AddGender