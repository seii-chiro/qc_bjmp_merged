import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "@/store/useTokenStore";
import { getJail_Security_Level, getJail, getRecord_Status, getJail_Type, getJail_Category, getJail_Province, getJail_Municipality, getJailRegion, getJail_Barangay } from "@/lib/queries";
import { Button, Input, Select, message, Form, Modal } from "antd";
import { useState, useEffect } from "react";

type EditJailFacilityProps = {
    jailId: number;
    onClose: () => void;
};

const EditJailFacility = ({ jailId, onClose }: EditJailFacilityProps) => {
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [initialData, setInitialData] = useState<any>(null);

    const { data: jailData } = useQuery({
        queryKey: ["jail", jailId],
        queryFn: () => getJail(token ?? "", jailId),
        enabled: !!jailId,
    });

    const { data: securityLevels } = useQuery({
        queryKey: ["security_levels"],
        queryFn: getJail_Security_Level,
    });

    const { data: recordStatuses } = useQuery({
        queryKey: ["record_statuses"],
        queryFn: getRecord_Status,
    });

    const { data: jailTypes } = useQuery({
        queryKey: ["jail_types"],
        queryFn: getJail_Type,
    });

    const { data: jailCategories } = useQuery({
        queryKey: ["jail_categories"],
        queryFn: getJail_Category,
    });

    const { data: provinces } = useQuery({
        queryKey: ["provinces"],
        queryFn: getJail_Province,
    });

    const { data: municipalities } = useQuery({
        queryKey: ["municipalities"],
        queryFn: getJail_Municipality,
    });

    const { data: regions } = useQuery({
        queryKey: ["regions"],
        queryFn: getJailRegion,
    });

    const { data: barangays } = useQuery({
        queryKey: ["barangays"],
        queryFn: getJail_Barangay,
    });

    useEffect(() => {
        if (jailData) {
            setInitialData(jailData);
            form.setFieldsValue(jailData);
        }
    }, [jailData]);

    const handleSave = (values: any) => {
        // Perform the mutation to update the jail facility
        // Pass the updated values here
        // Example: updateJailFacility(token, jailId, values);
        messageApi.success("Jail facility updated successfully");
        queryClient.invalidateQueries(["jail"]);
        onClose();
    };

    return (
        <>
            {contextHolder}
            <Modal
                title="Edit Jail Facility"
                visible={true}
                onCancel={onClose}
                footer={null}
                width="70%"
                style={{ maxHeight: "80vh", overflowY: "auto" }}
            >
                <Form form={form} onFinish={handleSave} initialValues={initialData} layout="vertical">
                    <Form.Item label="Jail Name" name="jail_name" rules={[{ required: true, message: "Please enter jail name!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Jail Type" name="jail_type" rules={[{ required: true }]}>
                        <Select>
                            {jailTypes?.map((type: any) => (
                                <Select.Option key={type.id} value={type.id}>
                                    {type.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Jail Category" name="jail_category" rules={[{ required: true }]}>
                        <Select>
                            {jailCategories?.map((category: any) => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Email Address" name="email_address" rules={[{ required: true, type: "email", message: "Please enter valid email!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Contact Number" name="contact_number" rules={[{ required: true, message: "Please enter contact number!" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Province" name="province">
                        <Select>
                            {provinces?.map((province: any) => (
                                <Select.Option key={province.id} value={province.id}>
                                    {province.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="City/Municipality" name="citymunicipality">
                        <Select>
                            {municipalities?.map((municipality: any) => (
                                <Select.Option key={municipality.id} value={municipality.id}>
                                    {municipality.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Region" name="region">
                        <Select>
                            {regions?.map((region: any) => (
                                <Select.Option key={region.id} value={region.id}>
                                    {region.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Barangay" name="barangay">
                        <Select>
                            {barangays?.map((barangay: any) => (
                                <Select.Option key={barangay.id} value={barangay.id}>
                                    {barangay.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Street" name="street">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Postal Code" name="postal_code">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Security Level" name="security_level">
                        <Select>
                            {securityLevels?.map((level: any) => (
                                <Select.Option key={level.id} value={level.id}>
                                    {level.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Record Status" name="record_status">
                        <Select>
                            {recordStatuses?.map((status: any) => (
                                <Select.Option key={status.id} value={status.id}>
                                    {status.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EditJailFacility;
