import { deleteNationality, getNationalities } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Modal } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import { useState } from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { GoPlus } from "react-icons/go";
import { LuSearch } from "react-icons/lu";
import AddNationality from "./AddNationality";
import EditNationality from "./EditNationality";

type NationalityProps = {
  id: number;
  code: string;
  nationality: string;
};

const Nationality = () => {
  const [searchText, setSearchText] = useState("");
  const token = useTokenStore().token;
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nationality, setNationality] = useState<NationalityProps | null>(null);

  const { data } = useQuery({
    queryKey: ["nationality"],
    queryFn: () => getNationalities(token ?? ""),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteNationality(token ?? "", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nationality"] });
      messageApi.success("Nationality deleted successfully");
    },
    onError: (error: any) => {
      messageApi.error(error.message || "Failed to delete Nationality");
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setNationality(null);
  };

  const dataSource =
    data?.map((nationality, index) => ({
      key: index + 1,
      id: nationality?.id ?? "N/A",
      code: nationality?.code ?? "N/A",
      nationality: nationality?.nationality ?? "N/A",
    })) || [];

  const filteredData = dataSource.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns: ColumnsType<NationalityProps> = [
    {
      title: "No.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nationality",
      dataIndex: "nationality",
      key: "nationality",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: NationalityProps) => (
        <div className="flex gap-1.5 font-semibold transition-all ease-in-out duration-200 justify-center">
          <Button
            type="link"
            onClick={() => {
              setNationality(record);
              setIsEditModalOpen(true);
            }}
          >
            <AiOutlineEdit />
          </Button>
          <Button
            type="link"
            danger
            onClick={() => deleteMutation.mutate(record.id)}
          >
            <AiOutlineDelete />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen">
      {contextHolder}
      <div className="w-full bg-white">
        <div className="mb-4 flex justify-between items-center gap-2">
          <h1 className="text-[#1E365D] text-3xl font-bold">Nationality</h1>
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
              Add Nationality
            </button>
          </div>
        </div>
        <Table columns={columns} dataSource={filteredData} />
      </div>

      <Modal
        className="overflow-y-auto rounded-lg scrollbar-hide"
        title="Add Nationality"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width="40%"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <AddNationality onClose={handleCancel} />
      </Modal>

      {nationality && (
        <Modal
          title="Edit Nationality"
          open={isEditModalOpen}
          onCancel={handleEditClose}
          footer={null}
          width="40%"
        >
          <EditNationality nationality={nationality} onClose={handleEditClose} />
        </Modal>
      )}
    </div>
  );
};

export default Nationality;
