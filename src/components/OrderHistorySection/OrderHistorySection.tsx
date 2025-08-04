import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination";
import useGrpcApi from "../../hooks/useGrpcApi";
import { getOrderClient } from "../../api/grpc/client";
import { convertTimestampToDate } from "../../utils/date";
import { formatToIDR } from "../../utils/number";
import SortableHeader from "../SortableHeader/SortableHeader";
import useSortableHeader from "../../hooks/useSortableHeader";
import OrderStatusBadge from "../OrderStatusBadge/OrderStatusBadge";
import { Link } from "react-router-dom";
import { ORDER_STATUS_UNPAID } from "../../constants/order";

interface OrderItem {
    id: string;
    number: string;
    date: string;
    total: number;
    statusCode: string;
    products: {
        id: string;
        name: string;
        quantity: number;
    }[];
    invoiceUrl: string;
}

function OrderHistorySection() {
    const listApi = useGrpcApi();
    const { handleSort, sortConfig } = useSortableHeader();
    const [items, setItems] = useState<OrderItem[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number>(0);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await listApi.callApi(getOrderClient().listOrder({
                pagination: {
                    currentPage: currentPage,
                    itemPerPage: 5,
                    sort: sortConfig.direction ? {
                        direction: sortConfig.direction,
                        field: sortConfig.key
                    } : undefined,
                }
            }));

            setItems(res.response.items.map(item => ({
                id: item.id,
                date: convertTimestampToDate(item.createdAt),
                number: item.number,
                statusCode: item.statusCode,
                total: item.total,
                products: item.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    quantity: Number(product.quantity),
                })),
                invoiceUrl: item.xenditInvoiceUrl,
            })));
            setTotalPages(res.response.pagination?.totalPageCount ?? 0);
        }

        fetchData();
    }, [currentPage, sortConfig.direction, sortConfig.key]);

    return (
        <div className="p-4 p-lg-5 border bg-white admin-dashboard">
            <h2 className="h3 mb-3 text-black">Riwayat Pesanan</h2>
            <div className="table-responsive">
                <table className="table site-blocks-table site-block-order-table mb-5">
                    <thead>
                        <tr>
                            <SortableHeader
                                currentSort={sortConfig}
                                label="Nomor Pesanan"
                                onSort={handleSort}
                                sortKey="number"
                            />
                            <SortableHeader
                                currentSort={sortConfig}
                                label="Tanggal"
                                onSort={handleSort}
                                sortKey="created_at"
                            />
                            <th>Barang</th>
                            <SortableHeader
                                currentSort={sortConfig}
                                label="Total"
                                onSort={handleSort}
                                sortKey="total"
                            />
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td><Link to={`/profile/orders/${item.id}/detail`}>{item.number}</Link></td>
                                <td>{item.date}</td>
                                <td>
                                    {item.products.map(product => (
                                        <div key={product.id}>{product.name} x {product.quantity}</div>
                                    ))}
                                </td>
                                <td>{formatToIDR(item.total)} {item.statusCode === ORDER_STATUS_UNPAID && <a href={item.invoiceUrl}>(Bayar)</a>}</td>
                                <td><OrderStatusBadge code={item.statusCode} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default OrderHistorySection;
