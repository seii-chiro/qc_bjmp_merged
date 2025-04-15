import { getRank, deleteRank } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoDownload, GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddRank from "./AddRank";
import EditRank from "./EditRank";

type Rank = {
    id: number;
    organization: number;
    rank_code: string;
    rank_name: string;
    category: string | null;
    class_level: number;
};

const Rank = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [rank, setRank] = useState<Rank | null>(null);

    const { data } = useQuery({
        queryKey: ['ranks'],
        queryFn: () => getRank(token ?? ""),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteRank(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["rank"] });
            messageApi.success("Rank deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Rank");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const dataSource = data?.map((rank, index) => ({
        key: index + 1,
        id: rank?.id,
        organization: rank?.organization ?? 'N/A',
        rank_code: rank?.rank_code ?? 'N/A',
        rank_name: rank?.rank_name ?? 'N/A',
        category: rank?.category ?? 'N/A',
        class_level: rank?.class_level ?? 'N/A',
    })) || [];

    const filteredData = dataSource?.filter((rank) =>
        Object.values(rank).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
        )
    );

    const columns: ColumnsType<Rank> = [
        {
            title: 'No.',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Organization',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: 'Rank Code',
            dataIndex: 'rank_code',
            key: 'rank_code',
        },
        {
            title: 'Rank Name',
            dataIndex: 'rank_name',
            key: 'rank_name',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Class Level',
            dataIndex: 'class_level',
            key: 'class_level',
        },
        {
            title: "Actions",
            key: "actions",
            align: "center",
            render: (_: any, record: Rank) => (
                <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
                    <Button
                        type="primary"
                        onClick={() => {
                            setRank(record);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <AiOutlineEdit />
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={() => deleteMutation.mutate(record.id)}
                    >
                        <AiOutlineDelete/>
                    </Button>
                </div>
            ),
        },
    ];

    const handleExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(dataSource);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rank");
        XLSX.writeFile(wb, "Rank.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, { 
            head: [['No.', 'Organization', 'Rank Code', 'Rank Name', 'Category', 'Class Level']],
            body: dataSource.map(item => [item.key, item.organization, item.rank_code, item.rank_name, item.category, item.class_level]),
        });
        doc.save('Rank.pdf');
    };

    const handlePrintReport = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Rank Report</title>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>Rank Report</h1>');
            printWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
            printWindow.document.write('<tr><th>No.</th><th>Organization</th><th>Rank Code</th><th>Rank Name</th><th>Category</th><th>Class Level</th></tr>');
            filteredData.forEach(item => {
                printWindow.document.write(`<tr>
                    <td>${item.key}</td>
                    <td>${item.organization}</td>
                    <td>${item.rank_code}</td>
                    <td>${item.rank_name}</td>
                    <td>${item.category}</td>
                    <td>${item.class_level}</td>
                </tr>`);
            });
            printWindow.document.write('</table>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };

    const menu = (
        <Menu>
            <Menu.Item>
                <a onClick={handleExportExcel}>Export Excel</a>
            </Menu.Item>
            <Menu.Item>
                <CSVLink data={dataSource} filename="Rank.csv">
                    Export CSV
                </CSVLink>
            </Menu.Item>
            <Menu.Item>
                <a onClick={handleExportPDF}>Export PDF</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className="h-screen">
            {contextHolder}
            <div className="w-full bg-white">
                <div className="mb-4 flex justify-between gap-2">
                    <div className="flex gap-2">
                        <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
                        <a className="ant-dropdown-link gap-2 flex items-center " onClick={e => e.preventDefault()}>
                        <GoDownload /> Export
                        </a>
                    </Dropdown>
                    <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white">
                    <a onClick={handlePrintReport}>Print Report</a>
                    </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <div className="flex-1 relative flex items-center">
                        <input
                            placeholder="Search"
                            type="text"
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border border-gray-400 h-10 w-96 rounded-md px-2 active:outline-none focus:outline-none"
                        />
                        <LuSearch className="absolute right-[1%] text-gray-400" />
                    </div>
                    <button
                        className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center justify-center"
                        onClick={showModal}
                        >
                        <GoPlus />
                        Add Rank
                    </button>
                    </div>
                </div>
                <div className="overflow-x-auto overflow-y-auto h-full">
                    <Table
                        columns={columns}
                        dataSource={filteredData}
                        scroll={{ x: 800 }}
                    />
                </div>
            </div>
            <Modal
                className="overflow-y-auto rounded-lg scrollbar-hide"
                title="Add Rank"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="70%"
                style={{ maxHeight: "80vh", overflowY: "auto" }} 
            >
                <AddRank onClose={handleCancel} />
            </Modal>
            <Modal
                title="Edit Rank"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                footer={null}
            >
                <EditRank
                    rank={rank}
                    onClose={() => setIsEditModalOpen(false)}
                />
            </Modal>
        </div>
    )
}

export default Rank;