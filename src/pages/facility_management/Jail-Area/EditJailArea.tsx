import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { getDetention_Building, getDetention_Floor, getJail, getRecord_Status, updateJailArea} from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type EditJailArea = {
  jail: number | null;
  building : string | null;
  record_status_id: number | null;
  floor: number | null;
  area_name: string;
}

const EditJailArea = ({ jailarea, onClose }: { jailarea: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [jailArea, setJailArea] = useState<EditJailArea>({
      jail: null,
      building : '',
      record_status_id: null,
      floor: null,
      area_name: '',
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateJailArea(token ?? "", jailarea.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Jail Area updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Jail Area");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['jail'],
                queryFn: () => getJail(token ?? "")
            },
            {
                queryKey: ['building'],
                queryFn: () => getDetention_Building(token ?? "")
            },
            {
            queryKey: ['floor'],
            queryFn: () => getDetention_Floor(token ?? "")
          },
        {
          queryKey: ['record-status'],
          queryFn: () => getRecord_Status(token ?? "")
      },
        ]
    });

    const JailData = results[0].data;
    const JailLoading = results[0].isLoading;

    const DetentionBuildingData = results[1].data;
    const DetentionBuildingLoading = results[1].isLoading;

    const DetentionFloorData = results[2].data;
    const DetentionFloorLoading = results[2].isLoading;

    const RecordStatusData = results[3].data;
    const RecordStatusLoading = results[3].isLoading;

        useEffect(() => {
            if (jailarea) {
                form.setFieldsValue({
                    jail: jailarea.jail,
                    building: jailarea.building,
                    security_level: jailarea.security_level,
                    record_status: jailarea.record_status,
                    floor: jailarea.floor,
                    area_name: jailarea.area_name,
                });
            }
        }, [jailarea, form]);

    const handleJailAreaSubmit = (values: {
      jail: number | null;
      building : string | null;
      security_level: number | null;
      record_status_id: number | null;
      floor: number | null;
      area_name: string;
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };
    
    const onJailChange = (value: number) => {
        setJailArea(prevForm => ({
            ...prevForm,
            jail: value
        }));
    };

    const onDetentionBuildingChange = (value: string) => {
        setJailArea(prevForm => ({
            ...prevForm,
            building: value
        }));
    };

  const onDetentionFloorChange = (value: number) => {
      setJailArea(prevForm => ({
          ...prevForm,
          floor: value
      }));
  };

  const onRecordStatusChange = (value: number) => {
    setJailArea(prevForm => ({
        ...prevForm,
        record_status_id: value
    }));
};

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handleJailAreaSubmit}
                initialValues={{
                    jail: jailarea?.jail ?? 'N/A',
                    building: jailarea?.building ?? 'N/A',
                    security_level: jailarea?.security_level ?? 'N/A',
                    record_status_id: jailarea?.record_status_id ?? 'N/A',
                    floor: jailarea?.floor ?? 'N/A',
                    area_name: jailarea?.area_name ?? 'N/A',
                }}
            >

                <Form.Item
                    label="Area Name"
                    name="area_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Jail"
                    name="jail"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Jail"
                        optionFilterProp="label"
                        onChange={onJailChange}
                        loading={JailLoading}
                        options={JailData?.map(jail => (
                            {
                                value: jail.id,
                                label: jail?.jail_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Building"
                    name="building"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Building"
                        optionFilterProp="label"
                        onChange={onDetentionBuildingChange}
                        loading={DetentionBuildingLoading}
                        options={DetentionBuildingData?.map(building => (
                            {
                                value: building.id,
                                label: building?.bldg_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Floor"
                    name="floor"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Floor"
                        optionFilterProp="label"
                        onChange={onDetentionFloorChange}
                        loading={DetentionFloorLoading}
                        options={DetentionFloorData?.map(floor => (
                            {
                                value: floor.id,
                                label: floor?.floor_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Record Status"
                    name="record_status_id"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Record Status"
                        optionFilterProp="label"
                        onChange={onRecordStatusChange}
                        loading={RecordStatusLoading}
                        options={RecordStatusData?.map(recordstatus => (
                            {
                                value: recordstatus.id,
                                label: recordstatus?.status
                            }
                        ))}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Jail Area"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditJailArea;
