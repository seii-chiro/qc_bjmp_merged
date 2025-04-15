import { getPersonnel } from "@/lib/queries"
import { useTokenStore } from "@/store/useTokenStore"
import { useQuery } from "@tanstack/react-query"
import { Table } from "antd"

const Personnel = () => {
    const token = useTokenStore().token

    const { data } = useQuery({
        queryKey: ['personnel'],
        queryFn: () => getPersonnel(token ?? ""),
    })

    const dataSource = data?.map((personnel, index) => (
        {
            key: index + 1,
            organization: personnel?.organization ?? 'N/A',
            jail: personnel?.jail ?? 'N/A',
            person: personnel?.person ?? 'N/A',
            shortname: personnel?.shortname ?? 'N/A',
            personnel_type: personnel?.personnel_type ?? 'N/A',
            rank: personnel?.rank ?? 'N/A',
            position: personnel?.position ?? 'N/A',
            date_joined: personnel?.date_joined ?? 'N/A',
            record_status: personnel?.record_status ?? 'N/A',

        }
    ))

    const columns = [
        {
            title: 'Cell ID',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Organization ID',
            dataIndex: 'organization',
            key: 'organization',
        },
        {
            title: 'Jail ID',
            dataIndex: 'jail',
            key: 'jail',
        },
        {
            title: 'Person ID',
            dataIndex: 'person',
            key: 'person',
        },
        {
            title: 'Short Name',
            dataIndex: 'shortname',
            key: 'shortname',
        },
        {
            title: 'Personnel Type',
            dataIndex: 'personnel_type',
            key: 'personnel_type',
        },
        {
            title: 'Rank ID',
            dataIndex: 'rank',
            key: 'rank',
        },
        {
            title: 'Position ID',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Date Joined',
            dataIndex: 'date_joined',
            key: 'date_joined',
        },
        {
            title: 'Status',
            dataIndex: 'record_status',
            key: 'record_status',
        },
    ];


    return (
        <div>
            <div className="w-full bg-white drop-shadow-lg rounded-lg p-5 md:p-10 mt-10">
                        <h3 className="text-lg font-semibold mb-5">Personnel</h3>
                        <div className="overflow-x-auto">
                            <Table
                                columns={columns}
                                dataSource={dataSource}
                                scroll={{ x: 1000 }}
                            />
                        </div>
                    </div>
        </div>
    )
}

export default Personnel
