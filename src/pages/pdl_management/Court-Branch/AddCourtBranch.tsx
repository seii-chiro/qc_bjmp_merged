import { getCourt, getJail_Province, getJailRegion } from "@/lib/queries";
import { BRANCH } from "@/lib/urls";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQueries } from "@tanstack/react-query";
import { Input, message, Select } from "antd";
import { useState } from "react";

type AddCourtBranch = {
    province_id: number | null;
    region_id: number | null;
    court_id: number | null;
    branch: string;
    judge: string;
};

const AddCourtBranch = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
    const [branchForm, setBranchForm] = useState<AddCourtBranch>({
        province_id: null,
        region_id: null,
        court_id: null,
        branch: "",
        judge: "",
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ["region"],
                queryFn: () => getJailRegion(token ?? ""),
            },
            {
                queryKey: ["province"],
                queryFn: () => getJail_Province(token ?? ""),
            },
            {
                queryKey: ["court"],
                queryFn: () => getCourt(token ?? ""),
            },
        ],
    });

    const regionData = results[0].data;
    const provinceData = results[1].data;
    const courtData = results[2].data;

    async function addCourtBranch(branch: AddCourtBranch) {
        const res = await fetch(BRANCH.postBRANCH, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            },
            body: JSON.stringify(branch),
        });

        if (!res.ok) {
            let errorMessage = "Error Adding Court Branch";
            try {
                const errorData = await res.json();
                errorMessage = errorData?.message || errorData?.error || JSON.stringify(errorData);
            } catch {
                errorMessage = "Unexpected error occurred";
            }
            throw new Error(errorMessage);
        }
        return res.json();
    }

    const branchMutation = useMutation({
        mutationKey: ["branch"],
        mutationFn: addCourtBranch,
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

    const handleBranchSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Extra safety check
        const selectedProvince = provinceData?.find(p => p.id === branchForm.province_id);
        if (!selectedProvince) {
            messageApi.error("Selected province is invalid or does not exist.");
            return;
        }

        branchMutation.mutate(branchForm);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBranchForm(prevForm => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const onCourtChange = (value: number) => {
        setBranchForm(prevForm => ({
            ...prevForm,
            court_id: value,
        }));
    };

    const onRegionChange = (value: number) => {
        setBranchForm(prevForm => ({
            ...prevForm,
            region_id: value,
            province_id: null, // Reset province on region change
        }));
    };

    const onProvinceChange = (value: number) => {
        setBranchForm(prevForm => ({
            ...prevForm,
            province_id: value,
        }));
    };

    const filteredProvinces = provinceData?.filter(
        (province) => province.region === branchForm.region_id
      );
      

    console.log("Selected Region ID:", branchForm.region_id);
    console.log("Filtered Provinces:", filteredProvinces);

    return (
        <div>
            {contextHolder}
            <form onSubmit={handleBranchSubmit}>
                <div className="space-y-5">
                    <div className="flex w-full gap-2 mt-5">
                        <div className="w-full">
                            <p className="text-[#1E365D] font-bold text-lg">Judicial Court</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Judicial Court"
                                optionFilterProp="label"
                                onChange={onCourtChange}
                                options={courtData?.map(court => ({
                                    value: court.id,
                                    label: court?.court,
                                }))}
                            />
                        </div>
                        <div className="w-full">
                            <p className="text-[#1E365D] font-bold text-lg">Branch</p>
                            <Input
                                className="h-12 w-full"
                                id="branch"
                                name="branch"
                                placeholder="Branch"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="w-full">
                            <p className="text-[#1E365D] font-bold text-lg">Judge</p>
                            <Input
                                className="h-12 w-full"
                                id="judge"
                                name="judge"
                                placeholder="Judge"
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex w-full gap-2 mt-5">
                        <div className="w-full">
                            <p className="text-[#1E365D] font-bold text-lg">Region</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Region"
                                optionFilterProp="label"
                                onChange={onRegionChange}
                                options={regionData?.map(region => ({
                                    value: region.id,
                                    label: region?.desc,
                                }))}
                            />
                        </div>
                        <div className="w-full">
                            <p className="text-[#1E365D] font-bold text-lg">Province</p>
                            <Select
                                className="h-[3rem] w-full"
                                showSearch
                                placeholder="Province"
                                optionFilterProp="label"
                                value={branchForm.province_id ?? undefined}
                                onChange={onProvinceChange}
                                options={filteredProvinces?.map(province => ({
                                    value: province.id,
                                    label: province?.desc,
                                }))}
                                disabled={!branchForm.region_id}
                            />
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center mt-10">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white w-36 px-3 py-2 rounded font-semibold text-base"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCourtBranch;
