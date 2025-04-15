import { getJail_Province, getJailRegion } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQueries } from "@tanstack/react-query";
import { Input, message, Select } from "antd";
import { useState } from "react";

type BranchProps = {
  court: string;
  region: string;
  province: string;
  branch: string;
  judge: string;
};

type AddBranchProps = {
  courtName: string;
  onAddBranch: (branch: BranchProps) => void;
  onCancel: () => void;
};

const AddBranch = ({ courtName, onAddBranch, onCancel }: AddBranchProps) => {
  const token = useTokenStore().token;
  const [messageApi, contextHolder] = message.useMessage();
  const [form, setForm] = useState<BranchProps>({
    court: courtName,
    region: "",
    province: "",
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
    ],
  });

  const RegionData = results[0].data || [];
  const ProvinceData = results[1].data || [];

  const handleChange = (field: keyof BranchProps, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onRegionChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      region: value,
      province: "",
    }));
  };

  const onProvinceChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      province: value,
    }));
  };

  const handleSubmit = () => {
    const { region, province, branch, judge } = form;
    if (!region || !province || !branch || !judge) {
      messageApi.error("Please fill in all required fields.");
      return;
    }
    onAddBranch(form); // Send to AddCourt
    messageApi.success("Branch added successfully.");
    setForm({
      court: courtName,
      region: "",
      province: "",
      branch: "",
      judge: "",
    });
  };

  return (
    <div>
      {contextHolder}
      <form>
        <div className="flex w-full gap-2 mt-5">
          <div className="w-full">
            <p className="text-[#1E365D] font-bold text-lg">Judicial Court</p>
            <Input
              className="h-12 w-full"
              value={courtName}
              disabled
            />
          </div>
          <div className="w-full">
            <p className="flex gap-[1px] text-[#1E365D] text-lg font-bold">
              Region <span className="text-red-600">*</span>
            </p>
            <Select
              className="h-[3rem] w-full"
              showSearch
              placeholder="Region"
              optionFilterProp="label"
              onChange={onRegionChange}
              value={form.region || undefined}
              options={RegionData.map((region: any) => ({
                value: region.id,
                label: region.desc,
              }))}
            />
          </div>
          <div className="w-full">
            <p className="flex gap-[1px] text-[#1E365D] font-bold text-lg">
              Province<span className="text-red-600">*</span>
            </p>
            <Select
              className="h-[3rem] w-full"
              showSearch
              placeholder="Province"
              onChange={onProvinceChange}
              value={form.province || undefined}
              options={ProvinceData.filter(
                (province: any) => province.region === form.region
              ).map((province: any) => ({
                value: province.id,
                label: province.desc,
              }))}
            />
          </div>
        </div>

        <div className="w-full flex gap-2 mt-5">
          <div className="flex flex-col mt-5 w-full">
            <p className="text-[#1E365D] font-bold text-lg">Branch Name</p>
            <Input
              className="h-12 w-full"
              placeholder="Branch Name"
              value={form.branch}
              onChange={(e) => handleChange("branch", e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-5 w-full">
            <p className="text-[#1E365D] font-bold text-lg">Judge's Name</p>
            <Input
              className="h-12 w-full"
              placeholder="Judge's Name"
              value={form.judge}
              onChange={(e) => handleChange("judge", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-white border border-[#1e365d] text-[#1e365d] px-3 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-[#1E365D] text-white px-3 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBranch;
