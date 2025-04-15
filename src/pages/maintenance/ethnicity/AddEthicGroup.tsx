import { Input, Select } from "antd";
import { useEffect, useState } from "react";
import { getEthnicityProvince } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";

type EthnicGroupProps = {
    ethnicity_id: number | null;
    region_id: number | null;
    province_id: number | null;
    description: string;
};

const AddEthnicGroup = ({ onClose, onSave }: { onClose: () => void; onSave: (ethnicity: AddEthnicProps) => void }) => {
    const token = useTokenStore().token;
    const [ethnicGroup, setEthnicGroup] = useState<EthnicGroupProps>({
        ethnicity_id: null,
        region_id: null,
        province_id: null,
        description: "",
    });

    const [regions, setRegions] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [filteredProvinces, setFilteredProvinces] = useState<any[]>([]);

    const [ethnicGroupName, setEthnicGroupName] = useState<string>("");

    const [regionMap, setRegionMap] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getEthnicityProvince(token);

                const uniqueRegionsMap = new Map();

                data.forEach(item => {
                    if (!uniqueRegionsMap.has(item.region)) {
                        uniqueRegionsMap.set(item.region, { id: item.id, region: item.region });
                    }
                });

                const uniqueRegions = Array.from(uniqueRegionsMap.values());
                const regionIdToName = Object.fromEntries(uniqueRegions.map(r => [r.id, r.region]));

                const allProvinces = data.map(item => ({
                    id: item.id,
                    province: item.province,
                    region: item.region,
                }));

                setRegions(uniqueRegions);
                setRegionMap(regionIdToName);
                setProvinces(allProvinces);
            } catch (error) {
                console.error("Error fetching ethnicity province data:", error);
            }
        };

        fetchData();
    }, [token]);

    useEffect(() => {
        if (ethnicGroup.region_id && regionMap[ethnicGroup.region_id]) {
            const selectedRegion = regionMap[ethnicGroup.region_id];
            const filtered = provinces.filter(p => p.region === selectedRegion);
            setFilteredProvinces(filtered);
        } else {
            setFilteredProvinces(provinces);
        }
    }, [ethnicGroup.region_id, provinces, regionMap]);

    const handleSubmit = async () => {
        try {
            const newEthnicity: AddEthnicProps = {
                ethnicity: ethnicGroupName,
                region: regionMap[ethnicGroup.region_id ?? -1] || '',
                province: ethnicGroup.province_id || '',
                description: ethnicGroup.description,
            };

            onSave(newEthnicity);
            onClose();
        } catch (error) {
            console.error("Error submitting ethnic group:", error);
        }
    };

    return (
        <div>
            <form>
                <div className="flex w-full gap-2 mt-5">
                    <div className="w-full">
                        <p className="text-[#1E365D] font-bold text-lg">Ethnic Group Name <span className="text-red-600">*</span></p>
                        <Input
                            className="h-12 w-full"
                            placeholder="Ethnic Group Name"
                            value={ethnicGroupName}
                            onChange={(e) => setEthnicGroupName(e.target.value)}
                        />
                    </div>

                    <div className="w-full">
                        <p className="text-[#1E365D] font-bold text-lg">Region <span className="text-red-600">*</span></p>
                        <Select
                            className="h-12 w-full"
                            showSearch
                            placeholder="Select Region"
                            onChange={(value) => setEthnicGroup(prev => ({
                                ...prev,
                                region_id: value,
                                province_id: null,
                            }))}   
                        >
                            {regions.map(region => (
                                <Select.Option key={region.id} value={region.id}>
                                    {region.region}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>

                    <div className="w-full">
                        <p className="text-[#1E365D] font-bold text-lg">Province <span className="text-red-600">*</span></p>
                        <Input
                            className="h-12 w-full"
                            placeholder="Enter Province"
                            value={ethnicGroup.province_id ?? ''}
                            onChange={(e) => setEthnicGroup(prev => ({
                                ...prev,
                                province_id: e.target.value,
                            }))}
                        />
                    </div>
                </div>

                <div className="flex flex-col mt-5 w-full">
                    <p className="text-[#1E365D] font-bold text-lg">Description</p>
                    <Input.TextArea
                        className="!h-20"
                        placeholder="Description"
                        value={ethnicGroup.description}
                        onChange={e => setEthnicGroup(prev => ({
                            ...prev,
                            description: e.target.value,
                        }))}
                    />
                </div>

                <div className="flex justify-end mt-4 gap-2">
                    <button
                        type="button"
                        className="bg-white border border-[#1e365d] text-[#1e365d] px-3 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEthnicGroup;
