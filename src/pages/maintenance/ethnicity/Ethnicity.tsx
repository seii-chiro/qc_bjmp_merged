import { Button, Dropdown, Menu, message, Modal, Table } from "antd"
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"
import { GoDownload, GoPlus } from "react-icons/go"
import AddEthnicity from "./AddEthnicity";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteEthnicity, getEthnicity } from "@/lib/queries";
import { ColumnsType } from "antd/es/table";
import { MdOutlineFileOpen } from "react-icons/md";
import { LuSearch } from "react-icons/lu";

type EthnicityProps = {
  id: number;
  updated_at: string;
  name: string;
  description: string;
  updated_by: number | null;
};

const Ethnicity = () => {
  const [searchText, setSearchText] = useState("");
  const token = useTokenStore().token;
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectEthnicity, setSelectedEthnicity] = useState<EthnicityProps | null>(null);

  const { data } = useQuery({
    queryKey: ['ethinicity'],
    queryFn: () => getEthnicity(token ?? ""),
  });

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteEthnicity(token ?? "", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ethnicity"] });
      messageApi.success("Ethnicity deleted successfully");
    },
    onError: (error: any) => {
      messageApi.error(error.message || "Failed to delete Ethnicity");
    },
  });

  const dataSource = data?.map((ethnicity, index) => ({
    key: index + 1,
    id: ethnicity?.id ?? 'N/A',
    name: ethnicity?.name ?? 'N/A',
    description: ethnicity?.description ?? 'N/A',
    updated_by: ethnicity?.updated_by ?? 'N/A',
    updated_at: ethnicity?.updated_at ?? 'N/A'
  })) || [];

  const filteredData = dataSource.filter((ethnicity) =>
    Object.values(ethnicity).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: ColumnsType<EthnicityProps> = [
    { title: 'No.', dataIndex: 'key', key: 'key' },
    { title: 'Ethnicity', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at' },
    { title: 'Updated By', dataIndex: 'updated_by', key: 'updated_by' },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: EthnicityProps) => (
        <div className="flex gap-1.5 justify-center">
          <Button type="primary" onClick={() => {
            setSelectedEthnicity(record);
            setIsEditModalOpen(true);
          }}><AiOutlineEdit /></Button>
          <Button type="primary" danger onClick={() => deleteMutation.mutate(record.id)}>
            <AiOutlineDelete />
          </Button>
          <Button type="primary" ghost>
            <MdOutlineFileOpen />
          </Button>
        </div>
      )
    },
  ];

  const handleExportExcel = () => {
    const itemsPerPage = 50;
    const totalPages = Math.ceil(dataSource.length / itemsPerPage);
    const wb = XLSX.utils.book_new();

    for (let i = 0; i < totalPages; i++) {
      const pageData = dataSource.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
      const sheetData = [
        ['Ethnicity Report'],
        ['Page ' + (i + 1) + ' of ' + totalPages],
        [],
        ['No.', 'Ethnicity', 'Description', 'Updated At', 'Updated By'],
        ...pageData.map(item => [item.key, item.name, item.description, item.updated_at, item.updated_by]),
        [],
        ['Generated at', new Date().toLocaleString()]
      ];
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, `Page ${i + 1}`);
    }

    XLSX.writeFile(wb, "Ethnicity_Report.xlsx");
  };

  const csvData = [
    ['Ethnicity Report'],
    ['Generated at:', new Date().toLocaleString()],
    [],
    ['No.', 'Ethnicity', 'Description', 'Updated At', 'Updated By'],
    ...dataSource.map(item => [item.key, item.name, item.description, item.updated_at, item.updated_by]),
    [],
    ['End of Report']
  ];

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let page = 1;

    autoTable(doc, {
      head: [['No.', 'Ethnicity', 'Description', 'Updated At', 'Updated By']],
      body: dataSource.map(item => [item.key, item.name, item.description, item.updated_at, item.updated_by]),
      margin: { top: 30 },
      didDrawPage: (data) => {
        doc.setFontSize(14);
        doc.text("Ethnicity Report", data.settings.margin.left, 15);
        doc.setFontSize(10);
        doc.text(`Page ${page}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        page++;
      }
    });

    doc.save('Ethnicity_Report.pdf');
  };

  const handlePrintReport = () => {
    const itemsPerPage = 40;
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Ethnicity Report</title></head><body>');
      for (let i = 0; i < totalPages; i++) {
        const pageData = filteredData.slice(i * itemsPerPage, (i + 1) * itemsPerPage);
        printWindow.document.write(`
          <div style="page-break-after: always; font-family: sans-serif">
            <h2 style="text-align:center">Ethnicity Report</h2>
            <p>Generated on: ${new Date().toLocaleString()}</p>
            <table border="1" cellspacing="0" cellpadding="5" style="width:100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Ethnicity</th>
                  <th>Description</th>
                  <th>Updated At</th>
                  <th>Updated By</th>
                </tr>
              </thead>
              <tbody>
        `);
        pageData.forEach(item => {
          printWindow?.document.write(`
            <tr>
              <td>${item.key}</td>
              <td>${item.name}</td>
              <td>${item.description}</td>
              <td>${item.updated_at}</td>
              <td>${item.updated_by}</td>
            </tr>
          `);
        });

        printWindow.document.write(`
              </tbody>
            </table>
            <div style="margin-top: 10px;">Page ${i + 1} of ${totalPages}</div>
          </div>
        `);
      }
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const menu = (
    <Menu>
      <Menu.Item><a onClick={handleExportExcel}>Export Excel</a></Menu.Item>
      <Menu.Item><CSVLink data={csvData} filename="Ethnicity_Report.csv">Export CSV</CSVLink></Menu.Item>
      <Menu.Item><a onClick={handleExportPDF}>Export PDF</a></Menu.Item>
    </Menu>
  );

  return (
    <div>
      {contextHolder}
      <div className="flex gap-2 flex-col">
        <div className="flex justify-between items-center">
          <div className="md:text-2xl font-bold text-[#1E365D]">Filipino Ethnic Groups</div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex gap-2">
            <Dropdown className="bg-[#1E365D] py-2 px-5 rounded-md text-white" overlay={menu}>
              <a className="ant-dropdown-link gap-2 flex items-center" onClick={e => e.preventDefault()}><GoDownload /> Export</a>
            </Dropdown>
            <button className="bg-[#1E365D] py-2 px-5 rounded-md text-white" onClick={handlePrintReport}>
              Print Report
            </button>
          </div>
          <div className="flex gap-5">
            <div className="flex place-items-center">
              <input placeholder="Search" type="text" onChange={(e) => setSearchText(e.target.value)} className="border border-gray-400 h-10 w-96 rounded-md px-2"/>
              <LuSearch className="text-gray-400 -ml-7" />
            </div>
            <button type="button" className="bg-[#1E365D] text-white px-3 py-2 rounded-md flex gap-1 items-center" onClick={showModal}>
              <GoPlus /> Add Ethnic Group
            </button>
          </div>
          
        </div>
        <Table columns={columns} dataSource={filteredData} />
        <Modal
          title="Add a Filipino Ethnic Group"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width="40%"
        >
          <AddEthnicity onClose={handleCancel} />
        </Modal>
      </div>
    </div>
  );
};

export default Ethnicity;
