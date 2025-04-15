import { getIssues } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useQuery } from "@tanstack/react-query";
import { Button, Table } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

export type Issues = {
        id: number | null;
        module: string;
        sub_module: string;
        reporting_category: string;
        issue_category: string;
        issue_severity_level: string;
        risk_level: string;
    };
    
const Issues = () => {
    const token = useTokenStore().token;
    const [issues, setIssues] = useState<Issues | null>(null);

    const { data } = useQuery({
        queryKey: ['issues'],
        queryFn: () => getIssues(token ?? ""),
    })

    const dataSource = data?.map((issues, index) => (
        {
            key: index + 1,
            id: issues?.id ?? 'N/A',
            module: issues?.module ?? 'N/A',
            sub_module: issues?.sub_module ?? 'N/A',
            reporting_category: issues?.reporting_category ?? 'N/A',
            issue_category: issues?.issue_category ?? 'N/A',
            issue_severity_level: issues?.issue_severity_level ?? 'N/A',
            risk_level: issues?.risk_level ?? 'N/A',
        }
    ));

    const columns: ColumnsType<Issues> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Module',
            dataIndex: 'module',
            key: 'module',
        },
        {
            title: 'Sub Module',
            dataIndex: 'sub_module',
            key: 'sub_module',
        },
        {
            title: 'Reporting Category',
            dataIndex: 'reporting_category',
            key: 'reporting_category',
        },
        {
            title: 'Issue Category',
            dataIndex: 'issue_category',
            key: 'issue_category',
        },
        {
            title: 'Risk Level',
            dataIndex: 'risk_level',
            key: 'risk_level',
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Issues) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="primary"
                    >
                        <AiOutlineEdit />
                    </Button>
                    <Button
                        type="primary"
                        danger
                    >
                        <AiOutlineDelete />
                    </Button>
                </div>
            ),
        },
    ]

    return (
        <div>
            <div>
                <Table className="border text-gray-200 rounded-md" dataSource={dataSource} columns={columns} scroll={{ x: 800 }} />
                </div>
        </div>
    )
}

export default Issues
