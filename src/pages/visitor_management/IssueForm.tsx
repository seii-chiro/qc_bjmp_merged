import React, { useEffect } from "react";
import { Form, Button, Select, Row, Col, Typography, Space } from "antd";
import { IssueFormData } from "./Issue";
import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { Impact, ImpactLevel, Issue, IssueStatus, RecommendedAction, Risk, RiskLevel } from "@/lib/definitions";

const { Option } = Select;

interface IssueFormProps {
    setIssueTable: React.Dispatch<React.SetStateAction<IssueFormData[]>>;
    onCancel: () => void;
    initialData: IssueFormData | null;
    updateIssue: (index: number, updatedData: IssueFormData) => void;
    editIndex: number | null;
    issues: Issue[];
    issuesLoading: boolean;
    issueStatuses: IssueStatus[];
    issueStatusesLoading: boolean;
    risks: Risk[];
    risksLoading: boolean;
    riskLevels: RiskLevel[];
    riskLevelsLoading: boolean;
    impact: Impact[];
    impactLoading: boolean;
    impactLevels: ImpactLevel[];
    impactLevelsLoading: boolean;
    recommendedActions: RecommendedAction[];
    recommendedActionsLoading: boolean;
}

const IssueForm: React.FC<IssueFormProps> = ({
    setIssueTable,
    onCancel,
    initialData,
    updateIssue,
    editIndex,
    impact,
    impactLevels,
    impactLevelsLoading,
    impactLoading,
    issueStatuses,
    issueStatusesLoading,
    issues,
    issuesLoading,
    recommendedActions,
    recommendedActionsLoading,
    riskLevels,
    riskLevelsLoading,
    risks,
    risksLoading
}) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialData) {
            form.setFieldsValue(initialData);
        } else {
            form.resetFields();
        }
    }, [initialData, form]);

    const onFinish = (values: IssueFormData) => {
        // Mapping IDs to names before saving
        const updatedValues = {
            ...values,
            issue: issues.find(issue => issue.id === +values.issue)?.description || '',
            riskLevel: riskLevels.find(level => level.id === +values.riskLevel)?.risk_severity || '',
            impactLevel: impactLevels.find(level => level.id === +values.impactLevel)?.impact_level || '',
            impact: impact.find(impactItem => impactItem.id === +values.impact)?.name || '',
            recommendedAction: recommendedActions.find(action => action.id === +values.recommendedAction)?.name || '',
            status: issueStatuses.find(status => status.id === +values.status)?.description || ''
        };

        if (editIndex !== null) {
            updateIssue(editIndex, updatedValues);
        } else {
            setIssueTable(prevTable => [...prevTable, updatedValues]);
        }

        form.resetFields();
        onCancel();
    };

    return (
        <div className="issue-form-container" style={{ padding: "16px 8px" }}>
            <Typography.Title level={4} style={{ marginBottom: "20px" }}>
                {editIndex !== null ? "Edit Issue" : "Add New Issue"}
            </Typography.Title>

            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={initialData || {}}
                requiredMark="optional"
            >
                <Form.Item
                    name="issue"
                    label="Issue"
                    rules={[{ required: false, message: "Please select an issue" }]}
                >
                    <Select placeholder="Select level" loading={issuesLoading} className="h-12">
                        {issues.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.description}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="risk"
                    label="Risks"
                    rules={[{ required: true, message: "Please select a risk" }]}
                >
                    <Select placeholder="Select level" loading={risksLoading} className="h-12">
                        {risks.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item
                            name="riskLevel"
                            label="Risk Level"
                            rules={[{ required: true, message: "Please select risk level" }]}
                        >
                            <Select placeholder="Select level" loading={riskLevelsLoading} className="h-12">
                                {riskLevels.map(option => (
                                    <Option key={option?.id} value={option?.id}>{option?.risk_severity}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="impactLevel"
                            label="Impact Level"
                            rules={[{ required: true, message: "Please select impact level" }]}
                        >
                            <Select placeholder="Select level" loading={impactLevelsLoading} className="h-12">
                                {impactLevels.map(option => (
                                    <Option key={option?.id} value={option?.id}>{option?.impact_level}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="impact"
                    label="Impact"
                    rules={[{ required: true, message: "Please select an Impact" }]}
                >
                    <Select placeholder="Select impact" loading={impactLoading} className="h-12">
                        {impact.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="recommendedAction"
                    label="Recommended Action"
                    rules={[{ required: true, message: "Please select a Recommended Action" }]}
                >
                    <Select placeholder="Recommend an action" loading={recommendedActionsLoading} className="h-12">
                        {recommendedActions.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: "Please select status" }]}
                >
                    <Select placeholder="Select current status" loading={issueStatusesLoading} className="h-12">
                        {issueStatuses.map(option => (
                            <Option key={option?.id} value={option?.id}>{option?.description}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
                    <Space size="middle" style={{ float: "right" }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                        >
                            {editIndex !== null ? "Update Issue" : "Save Issue"}
                        </Button>
                        <Button
                            onClick={onCancel}
                            icon={<CloseOutlined />}
                        >
                            Cancel
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default IssueForm;
