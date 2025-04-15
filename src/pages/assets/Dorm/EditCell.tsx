import { useMutation, useQueries } from "@tanstack/react-query";
import { Form, Input, Button, message, Select } from "antd";
import { updateDetentionCell, getDetention_Floor } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useEffect, useState } from "react";

type EditCell = {
    floor_id: number | null,
    cell_no: string,
    cell_name: string,
    cell_description: string,
}

const EditCell = ({ cell, onClose }: { cell: any; onClose: () => void }) => {
    const token = useTokenStore().token;
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(false); 
    const [cellForm, setCellForm] = useState<EditCell>({
        floor_id: null,
        cell_name: '',
        cell_no: '',
        cell_description: '',
    });

    const updateMutation = useMutation({
        mutationFn: (updatedData: any) =>
            updateDetentionCell(token ?? "", cell.id, updatedData),
        onSuccess: () => {
            setIsLoading(true); 
            messageApi.success("Detention Cell updated successfully");
            onClose();
        },
        onError: (error: any) => {
            setIsLoading(false); 
            messageApi.error(error.message || "Failed to update Detention Cell");
        },
    });

    const results = useQueries({
        queries: [
            {
                queryKey: ['floor'],
                queryFn: () => getDetention_Floor(token ?? "")
            },
        ]
    });

    const detentionFloorData = results[0].data;
    const detentionFloorLoading = results[0].isLoading;

        useEffect(() => {
            if (cell) {
                form.setFieldsValue({
                    floor_id: cell.floor,
                    cell_no: cell.cell_no,
                    cell_name: cell.cell_name,
                    cell_description: cell.cell_description,
                });
            }
        }, [cell, form]);

    const handledetentionCellSubmit = (values: {
        floor_id: number | null;
        cell_no: string;
        cell_name: string;
        cell_description: string;
    }) => {
        setIsLoading(true);
        updateMutation.mutate(values);
    };
    
    const onDetentionFloorChange = (value: number) => {
        setCellForm(prevForm => ({
            ...prevForm,
            floor_id: value
        }));
    };

    return (
        <div>
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                onFinish={handledetentionCellSubmit}
                initialValues={{
                    floor_id: cell?.floor_id ?? 'N/A',
                    cell_no: cell?.cell_no ?? 'N/A',
                    cell_name: cell?.cell_name ?? 'N/A',
                    cell_description: cell?.cell_description ?? 'N/A',
                }}
            >
                <Form.Item
                    label="Floor"
                    name="floor_id"
                >
                    <Select 
                        className="h-[3rem] w-full"
                        showSearch
                        placeholder="Floor"
                        optionFilterProp="label"
                        onChange={onDetentionFloorChange}
                        loading={detentionFloorLoading}
                        options={detentionFloorData?.map(floor => (
                            {
                                value: floor.id,
                                label: floor?.floor_name
                            }
                        ))}/>
                </Form.Item>
                <Form.Item
                    label="Cell No"
                    name="cell_no"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Cell Name"
                    name="cell_name"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Cell Description"
                    name="cell_description"
                >
                    <Input />
                </Form.Item>
                
                <Form.Item>
                    <Button type="primary" htmlType="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Cell"}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default EditCell;
