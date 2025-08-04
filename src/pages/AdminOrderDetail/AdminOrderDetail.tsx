import { Link, useParams } from "react-router-dom"
import useGrpcApi from "../../hooks/useGrpcApi"
import { useEffect, useState } from "react";
import { getOrderClient } from "../../api/grpc/client";
import { DetailOrderResponse } from "../../../pb/order/order";
import OrderStatusBadge from "../../components/OrderStatusBadge/OrderStatusBadge";
import { convertTimestampToDate } from "../../utils/date";
import { formatToIDR } from "../../utils/number";
import { ORDER_STATUS_CANCELED, ORDER_STATUS_DONE, ORDER_STATUS_PAID, ORDER_STATUS_SHIPPED, ORDER_STATUS_UNPAID } from "../../constants/order";
import Swal from "sweetalert2";

function AdminOrderDetail() {
    const { id } = useParams();
    const detailApi = useGrpcApi();
    const updateStatusApi = useGrpcApi();
    const [apiResponse, setApiResponse] = useState<DetailOrderResponse | null>(null);
    const [newOrderStatus, setNewOrderStatus] = useState<string>('');
    const items = apiResponse?.items ?? [];
    const totalPrice = apiResponse?.total ?? 0;
    const orderStatusCode = apiResponse?.orderStatusCode ?? "";

    const fetchData = async () => {
        const res = await detailApi.callApi(getOrderClient().detailOrder({ id: id ?? "" }));

        setApiResponse(res.response);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const updateStatusHandler = async () => {
        await updateStatusApi.callApi(getOrderClient().updateOrderStatus({
            orderId: id ?? "",
            newStatusCode: newOrderStatus,
        }));

        await Swal.fire({
            icon: 'success',
            title: 'Status Order Berhasil Diperbarui'
        })

        await fetchData();
    }

    return (
        <div className="admin-dashboard py-5">
            <div className="container">
                <div className="bg-white p-4 rounded-3">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title">Pesanan {apiResponse?.number ?? ""}</h2>
                        <Link to="/admin/orders">
                            <button className="btn btn-primary">
                                Kembali ke Pesanan
                            </button>
                        </Link>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-4">
                            <h3 className="h4 mb-3">Informasi Pelanggan</h3>
                            <div className="p-3 border rounded">
                                <p className="mb-2"><strong>Nama:</strong> {apiResponse?.userFullName ?? ""}</p>
                                <p className="mb-2"><strong>Telepon:</strong> {apiResponse?.phoneNumber ?? ""}</p>
                                <p className="mb-2"><strong>Alamat:</strong> {apiResponse?.address ?? ""}</p>
                                <p className="mb-0"><strong>Catatan:</strong> {apiResponse?.notes ?? ""}</p>
                            </div>
                        </div>

                        <div className="col-md-6 mb-4">
                            <h3 className="h4 mb-3">Status Pesanan</h3>
                            <div className="p-3 border rounded">
                                <p className="mb-2">
                                    <strong>Status Saat Ini:</strong>
                                    <OrderStatusBadge code={orderStatusCode} />
                                </p>
                                <p className="mb-2"><strong>Tanggal Pesanan:</strong> {convertTimestampToDate(apiResponse?.createdAt)}</p>
                                {[ORDER_STATUS_UNPAID, ORDER_STATUS_PAID, ORDER_STATUS_SHIPPED].includes(orderStatusCode) &&
                                    <div className="mt-3">
                                        <select
                                            className="form-select mb-2"
                                            onChange={(e) => setNewOrderStatus(e.target.value)}
                                            value={newOrderStatus}
                                        >
                                            <option value="">-</option>
                                            {orderStatusCode === ORDER_STATUS_UNPAID && <option value={ORDER_STATUS_PAID}>Sudah Dibayar</option>}
                                            {orderStatusCode === ORDER_STATUS_UNPAID && <option value={ORDER_STATUS_CANCELED}>Dibatalkan</option>}
                                            {orderStatusCode === ORDER_STATUS_PAID && <option value={ORDER_STATUS_SHIPPED}>Sedang Dikirim</option>}
                                            {orderStatusCode === ORDER_STATUS_SHIPPED && <option value={ORDER_STATUS_DONE}>Selesai</option>}
                                        </select>
                                        <button
                                            className="btn btn-primary w-100"
                                            onClick={updateStatusHandler}
                                            disabled={!newOrderStatus || updateStatusApi.isLoading}
                                        >
                                            Perbarui Status
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="col-12">
                            <h3 className="h4 mb-3">Item Pesanan</h3>
                            <div className="table-responsive">
                                <table className="table site-blocks-table">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th>Harga</th>
                                            <th>Kuantitas</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <tr>
                                                <td>{item.name}</td>
                                                <td>{formatToIDR(item.price)}</td>
                                                <td>{Number(item.quantity)}</td>
                                                <td>{formatToIDR(item.price * Number(item.quantity))}</td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={3} className="text-end"><strong>Subtotal</strong></td>
                                            <td>{formatToIDR(totalPrice)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={3} className="text-end"><strong>Total</strong></td>
                                            <td><strong>{formatToIDR(totalPrice)}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminOrderDetail
