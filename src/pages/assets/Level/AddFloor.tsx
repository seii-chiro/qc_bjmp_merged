import {
    getDetention_Building,
    getJail_Security_Level,
    getRecord_Status,
  } from "@/lib/queries";
  import { DETENTION_FLOOR } from "@/lib/urls";
  import { useTokenStore } from "@/store/useTokenStore";
  import { useMutation, useQueries } from "@tanstack/react-query";
  import {
    message,
    Select,
    Spin,
    Button,
    Input,
    Form,
    Typography,
  } from "antd";
  import { useState } from "react";
  
  type DetentionFloorProps = {
    building: number;
    floor_number: string;
    floor_name: string;
    security_level: number;
    floor_description: string;
    record_status_id: number;
  };
  
  type BuildingOption = {
    id: number;
    jail: string;
  };
  
  type SecurityLevelOption = {
    id: number;
    security_level: string;
  };
  
  type RecordStatusOption = {
    id: number;
    status_name: string;
  };
  
  const AddFloor = ({ onClose }: { onClose: () => void }) => {
    const token = useTokenStore().token;
    const [messageApi, contextHolder] = message.useMessage();
  
    const [formData, setFormData] = useState<DetentionFloorProps>({
      building: 0,
      floor_number: "",
      floor_name: "",
      security_level: 0,
      floor_description: "",
      record_status_id: 1,
    });
  
    const results = useQueries({
      queries: [
        {
          queryKey: ["building"],
          queryFn: () => getDetention_Building(token ?? ""),
        },
        {
          queryKey: ["security-level"],
          queryFn: () => getJail_Security_Level(token ?? ""),
        },
        {
          queryKey: ["record-status"],
          queryFn: () => getRecord_Status(token ?? ""),
        },
      ],
    });
  
    const isLoading = results.some((res) => res.isLoading);
    const buildingData = results[0].data as BuildingOption[] | undefined;
    const securityLevelData = results[1].data as SecurityLevelOption[] | undefined;
    const recordStatusData = results[2].data as RecordStatusOption[] | undefined;
  
    // === Submit Function ===
    async function addDetentionFloor(floor: DetentionFloorProps) {
      const res = await fetch(DETENTION_FLOOR.postDETENTION_FLOOR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(floor),
      });
  
      if (!res.ok) {
        let errorMessage = "Error Adding Detention Floor";
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
  
    const floorMutation = useMutation({
      mutationKey: ["floor"],
      mutationFn: addDetentionFloor,
      onSuccess: () => {
        messageApi.success("Detention floor added successfully!");
        setFormData({
          building: 0,
          floor_number: "",
          floor_name: "",
          security_level: 0,
          floor_description: "",
          record_status_id: 1,
        });
        onClose(); 
      },
      onError: (error: any) => {
        messageApi.error(error.message || "Submission failed.");
      },
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    };
  
    const handleSubmit = () => {
      const { building, floor_name, floor_number, security_level } = formData;
      if (
        building === 0 ||
        !floor_name.trim() ||
        !floor_number.trim() ||
        security_level === 0
      ) {
        messageApi.warning("Please complete all required fields.");
        return;
      }
  
      floorMutation.mutate(formData);
    };
  
    return (
      <div className="p-4">
        {contextHolder}
        <Typography.Title level={4}>Add Detention Floor</Typography.Title>
  
        {isLoading ? (
          <Spin tip="Loading data...">
            <div className="min-h-[200px]" />
          </Spin>
        ) : (
          <Form layout="vertical" onFinish={handleSubmit} className="flex flex-col gap-4">
            <Form.Item label="Detention Building" required>
              <Select
                showSearch
                placeholder="Select Detention Building"
                optionFilterProp="label"
                value={formData.building || undefined}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, building: value }))
                }
                options={buildingData?.map((building) => ({
                  value: building.id,
                  label: building.jail,
                }))}
              />
            </Form.Item>
  
            <Form.Item label="Floor Name" required>
              <Input
                name="floor_name"
                placeholder="Enter floor name"
                value={formData.floor_name}
                onChange={handleInputChange}
              />
            </Form.Item>
  
            <Form.Item label="Floor Number" required>
              <Input
                name="floor_number"
                placeholder="Enter floor number"
                value={formData.floor_number}
                onChange={handleInputChange}
              />
            </Form.Item>
  
            <Form.Item label="Security Level" required>
              <Select
                showSearch
                placeholder="Select Security Level"
                optionFilterProp="label"
                value={formData.security_level || undefined}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, security_level: value }))
                }
                options={securityLevelData?.map((level) => ({
                  value: level.id,
                  label: level.security_level,
                }))}
              />
            </Form.Item>
  
            <Form.Item label="Floor Description">
              <Input.TextArea
                name="floor_description"
                placeholder="Enter description (optional)"
                value={formData.floor_description}
                onChange={handleInputChange}
                autoSize={{ minRows: 2, maxRows: 6 }}
              />
            </Form.Item>
  
            <Form.Item label="Record Status">
              <Select
                showSearch
                placeholder="Select Record Status"
                optionFilterProp="label"
                value={formData.record_status_id}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, record_status_id: value }))
                }
                options={recordStatusData?.map((status) => ({
                  value: status.id,
                  label: status.status_name,
                }))}
              />
            </Form.Item>
  
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={floorMutation.isPending}
                block
              >
                Submit Floor
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    );
  };
  
  export default AddFloor;
  