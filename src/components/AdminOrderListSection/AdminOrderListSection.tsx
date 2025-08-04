import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useSortableHeader from '../../hooks/useSortableHeader';
import SortableHeader from '../SortableHeader/SortableHeader';
import Pagination from '../Pagination/Pagination';
import useGrpcApi from '../../hooks/useGrpcApi';
import { getOrderClient } from '../../api/grpc/client';
import { convertTimestampToDate } from '../../utils/date';
import { formatToIDR } from '../../utils/number';
import OrderStatusBadge from '../OrderStatusBadge/OrderStatusBadge';

interface OrderItem {
    id: string;
    number: string;
    date: string;
    customer: string;
    total: number;
    statusCode: string;
    products: {
        id: string;
        name: string;
        quantity: number;
    }[];
}

function AdminOrderListSection() {
    const listApi = useGrpcApi();
    const { handleSort, sortConfig } = useSortableHeader();
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState<OrderItem[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await listApi.callApi(getOrderClient().listOrderAdmin({
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
                customer: item.customer,
                date: convertTimestampToDate(item.createdAt),
                id: item.id,
                number: item.number,
                statusCode: item.statusCode,
                total: item.total,
                products: item.products.map(product => ({
                    id: product.id,
                    name: product.name,
                    quantity: Number(product.quantity),
                }))
            })));
            setTotalPages(res.response.pagination?.totalPageCount ?? 0)
        }

        fetchData();
    }, [currentPage, sortConfig.direction, sortConfig.key]);

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title">Order</h2>
            </div>
            <div className="table-responsive">
                <table className="table site-blocks-table">
                    <thead>
                        <tr>
                            <SortableHeader
                                label="Nomor Order"
                                sortKey="number"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <SortableHeader
                                label="Pelanggan"
                                sortKey="customer"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <SortableHeader
                                label="Total"
                                sortKey="total"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                            <th>Item</th>
                            <th>Status</th>
                            <SortableHeader
                                label="Tanggal"
                                sortKey="created_at"
                                currentSort={sortConfig}
                                onSort={handleSort}
                            />
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td><Link to={`/admin/orders/${item.id}/detail`}>{item.number}</Link></td>
                                <td>{item.customer}</td>
                                <td>{formatToIDR(item.total)}</td>
                                <td>
                                    {item.products.map(product => (
                                        <div key={product.id}>{product.name} x {product.quantity}</div>
                                    ))}
                                </td>
                                <td>
                                    <OrderStatusBadge code={item.statusCode} />
                                </td>
                                <td>{item.date}</td>
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
    );
}

export default AdminOrderListSection