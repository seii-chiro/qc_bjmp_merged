import { getJail_Security_Level, getJail, getRecord_Status, getJail_Type, getJail_Category, getJail_Province, getJail_Municipality, getJailRegion, getJail_Barangay } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries, useMutation } from "@tanstack/react-query";
import { useState } from "react"
import { Select, message } from "antd";
import { JAIL } from "@/lib/urls";

type AddJailFacility = {
    name: string;
    jail_type_id: number | null;
    jail_category_id: number | null;
    email_address: string;
    contact: string;
    province: number| null;
    citymunicipality: number | null;
    region: number| null;
    barangay: number| null;
    street: number| null;
    postal_code: number| null;
    security_level: number | null;
    record_status: number | null;
};

const AddJailFacility = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token
    const [messageApi, contextHolder] = message.useMessage();
    const [jailForm, setJailForm] = useState<AddJailFacility>({
        name: "", 
        jail_type_id: null,
        jail_category_id: null,
        email_address: "",
        contact: "",
        province: null,
        citymunicipality: null,
        region: null,
        barangay: null,
        street: null,
        postal_code: null,
        security_level: null,
        record_status: null,
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['jail'],
                queryFn: () => getJail(token ?? "")
            },
            {
                queryKey: ['jail-security-level'],
                queryFn: () => getJail_Security_Level(token ?? "")
            },
            {
                queryKey: ['record-status'],
                queryFn: () => getRecord_Status(token ?? "")
            },
            {
                queryKey: ['jail-types'],
                queryFn: () => getJail_Type(token ?? "")
            },
            {
                queryKey: ['jail-category'],
                queryFn: () => getJail_Category(token ?? "")
            },
            {
                queryKey: ['jail-province'],
                queryFn: () => getJail_Province(token ?? "")
            },
            {
                queryKey: ['jail-municipality'],
                queryFn: () => getJail_Municipality(token ?? "")
            },
            {
                queryKey: ['jail-region'],
                queryFn: () => getJailRegion(token ?? "")
            },
            {
                queryKey: ['jail-barangay'],
                queryFn: () => getJail_Barangay(token ?? "")
            },
        ]
    });

    const jailSecurityLevelData = results[1].data;
    const jailSecurityLevelLoading = results[1].isLoading;

    const recordStatusData = results[2].data;
    const recordStatusLoading = results[2].isLoading;

    const jailTypeData = results[3].data;
    const jailTypeLoading = results[3].isLoading;

    const jailCategoryData = results[4].data;
    const jailCategoryLoading = results[4].isLoading;

    const jailProvinceData = results[5].data;

    const jailMunicipalityData = results[6].data;

    const jailRegionData = results[7].data;

    const jailBarangayData = results[8].data;

    async function registerJailFacility(jailFacility: AddJailFacility) {
        const res = await fetch(JAIL.getJAIL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(jailFacility),
        });

        if (!res.ok) {
            let errorMessage = "Error registering Jail Facility";

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


    const jailFacilityMutation = useMutation({
        mutationKey: ['jail'],
        mutationFn: registerJailFacility,
        onSuccess: (data) => {
            console.log(data)
            messageApi.success("added successfully")
            onClose();
        },
        onError: (error) => {
            console.error(error)
            messageApi.error(error.message)
        }
    })

    const handlejailFacilitysubmit = (e: React.FormEvent) => {
        e.preventDefault()
        jailFacilityMutation.mutate(jailForm)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setJailForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };

    const onJailSecurityLevelChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            security_level: value
        }));
    };
    const onRecordStatusChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            jail: value
        }));
    };

    const onJailTypeChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            jail_type_id: value
        }));
    };

    const onJailCategoryChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            jail_category_id: value
        }));
    };

    const onRegionChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            region: value,
            province: null,
            citymunicipality: null,
            barangay: null,
        }));
    };

    const onJailProvinceChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            province: value,
            citymunicipality: null,
            barangay: null,
        }));
    };

    const onMunicipalityChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            citymunicipality: value,
            barangay: null,
        }));
    };

    const onJailBarangayChange = (value: number) => {
        setJailForm(prevForm => ({
            ...prevForm,
            barangay: value,
        }));
    };

    return (
        <div className="mt-10">
            {contextHolder}
            <form onSubmit={handlejailFacilitysubmit}>
                <div className="flex gap-5 w-full">
                    <div className="flex flex-col gap-2 flex-1">
                    <input type="text" name="jail_name" id="jail_name" onChange={handleInputChange} placeholder="Jail Name" className="h-12 border border-gray-300 rounded-lg px-2" required />
                    <input type="email" name="email_address" id="email_address" onChange={handleInputChange} placeholder="Email Address" className="h-12 border border-gray-300 rounded-lg px-2" required/>
                    <input type="number" name="contact" id="contact" onChange={handleInputChange} placeholder="Contact" className="h-12 border border-gray-300 rounded-lg px-2" required/>
                    

                            <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Type"
                            optionFilterProp="label"
                            onChange={onJailTypeChange}
                            loading={jailTypeLoading}
                            options={jailTypeData?.map(jail_type => (
                                {
                                    value: jail_type.id,
                                    label: jail_type?.type_name,
                                }
                            ))}
                        />
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Category"
                            optionFilterProp="label"
                            onChange={onJailCategoryChange}
                            loading={jailCategoryLoading}
                            options={jailCategoryData?.map(jailcategory => (
                                {
                                    value: jailcategory.id,
                                    label: jailcategory?.description
                                }
                            ))}
                        />
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Region"
                            onChange={onRegionChange}
                            options={jailRegionData?.map(region => ({
                                value: region.id,
                                label: region?.desc,
                            }))}
                        />
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Province"
                            onChange={onJailProvinceChange}
                            options={jailProvinceData?.filter(province => province.region === jailForm.region).map(province => ({
                                value: province.id,
                                label: province?.desc,
                            }))}
                        />
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Municipality"
                            onChange={onMunicipalityChange}
                            options={jailMunicipalityData?.filter(municipality => municipality.province === jailForm.province).map(municipality => ({
                                value: municipality.id,
                                label: municipality?.desc,
                            }))}
                        />
                        
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Jail Barangay"
                            onChange={onJailBarangayChange}
                            options={jailBarangayData?.filter(barangay => barangay.municipality === jailForm.citymunicipality).map(barangay => ({
                                value: barangay.id,
                                label: barangay?.desc,
                            }))}
                        />
                        <input type="text" name="" id="street" onChange={handleInputChange} placeholder="Jail Street" className="h-12 border border-gray-300 rounded-lg px-2" required />
                        <input type="number" name="postal_code" id="postal_code" onChange={handleInputChange} placeholder="Postal Code" className="h-12 border border-gray-300 rounded-lg px-2" required />
                        <Select
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Security Level"
                        optionFilterProp="label"
                        onChange={onJailSecurityLevelChange}
                        loading={jailSecurityLevelLoading}
                        options={jailSecurityLevelData?.map(security_level => (
                            {
                                value: security_level.id,
                                label: security_level?.category_name
                            }
                        ))}
                    />
                        
                        <Select
                            className="h-[3rem] w-full"
                            showSearch
                            placeholder="Record Status"
                            optionFilterProp="label"
                            onChange={onRecordStatusChange}
                            loading={recordStatusLoading}
                            options={recordStatusData?.map(record => (
                                {
                                    value: record.id,
                                    label: record?.status,
                                }
                            ))}
                        />
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

export default AddJailFacility