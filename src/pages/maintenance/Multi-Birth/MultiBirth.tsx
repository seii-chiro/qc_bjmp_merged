import { deleteMultiBirthType, getMultipleBirthSibling } from "@/lib/queries";
import { useTokenStore } from "@/store/useTokenStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useState } from "react";

type MultiBirthType = {
    id: number;
    classification: string;
    group_size: number;
    term_for_sibling_group: string;
    description: string;
};

const MultiBirth = () => {
    const [searchText, setSearchText] = useState("");
    const token = useTokenStore().token;
    const queryClient = useQueryClient();
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectMultiBirth, setselectMultiBirth] = useState<MultiBirthType | null>(null);

    const { data } = useQuery({
        queryKey: ['sibling-group'],
        queryFn: () => getMultipleBirthSibling(token ?? ""),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteMultiBirthType(token ?? "", id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["multibirth"] });
            messageApi.success("Multi Birth deleted successfully");
        },
        onError: (error: any) => {
            messageApi.error(error.message || "Failed to delete Multi Birth");
        },
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    

    return (
        <div>
        
        </div>
    )
}

export default MultiBirth
