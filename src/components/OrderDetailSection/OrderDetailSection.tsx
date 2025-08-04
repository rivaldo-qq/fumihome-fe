import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useGrpcApi from "../../hooks/useGrpcApi";
import { getOrderClient } from "../../api/grpc/client";
import { DetailOrderResponse } from "../../../pb/order/order";
import OrderStatusBadge from "../OrderStatusBadge/OrderStatusBadge";
import { convertTimestampToDate } from "../../utils/date";
import { formatToIDR } from "../../utils/number";
import { ORDER_STATUS_CANCELED, ORDER_STATUS_DONE, ORDER_STATUS_SHIPPED, ORDER_STATUS_UNPAID } from "../../constants/order";
import Swal from "sweetalert2";

function OrderDetailSection() {
    const { id } = useParams();
    const detailApi = useGrpcApi();
    const updateStatusApi = useGrpcApi();
    const [apiResponse, setApiResponse] = useState<DetailOrderResponse | null>(null);
    const [newStatusCode, setNewStatusCode] = useState<string>("");
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
            newStatusCode: newStatusCode,
            orderId: id ?? "",
        }));

        await Swal.fire({
            icon: 'success',
            title: "Status Order Berhasil Diperbarui"
        });

        fetchData();
    }

    return (
        <div className="p-4 p-lg-5 border bg-white">
            <Link to="/profile/orders" className="d-inline-block mb-4">
                <button className="btn btn-sm btn-primary">
                    Kembali ke Riwayat
                </button>
            </Link>
            <h2 className="section-title mb-4">Pesanan {apiResponse?.number ?? ""}</h2>

            <div className="row">
                <div className="col-md-6 mb-4">
                    <h3 className="h5 mb-3">Informasi Pengiriman</h3>
                    <div className="p-3 border rounded">
                        <p className="mb-2"><strong>Nama:</strong> {apiResponse?.userFullName ?? ""}</p>
                        <p className="mb-2"><strong>Telepon:</strong> {apiResponse?.phoneNumber ?? ""}</p>
                        <p className="mb-2"><strong>Alamat:</strong> {apiResponse?.address ?? ""}</p>
                        <p className="mb-0"><strong>Catatan:</strong> {apiResponse?.notes ?? ""}</p>
                    </div>
                </div>

                <div className="col-md-6 mb-4">
                    <h3 className="h5 mb-3">Status Pesanan</h3>
                    <div className="p-3 border rounded">
                        <p className="mb-2"><strong>Status Saat Ini:</strong>
                            <OrderStatusBadge code={orderStatusCode} />
                            {orderStatusCode === ORDER_STATUS_UNPAID &&
                                <a href={apiResponse?.xenditInvoiceUrl ?? ""}>(Bayar)</a>
                            }
                        </p>
                        <p className="mb-2"><strong>Tanggal Pesanan:</strong> {convertTimestampToDate(apiResponse?.createdAt)}</p>
                        {[ORDER_STATUS_UNPAID, ORDER_STATUS_SHIPPED].includes(orderStatusCode) &&
                            <div className="mt-3">
                                <select
                                    className="form-select mb-2"
                                    value={newStatusCode}
                                    onChange={(e) => setNewStatusCode(e.target.value)}
                                >
                                    <option value="">-</option>
                                    {orderStatusCode === ORDER_STATUS_UNPAID && <option value={ORDER_STATUS_CANCELED}>Dibatalkan</option>}
                                    {orderStatusCode === ORDER_STATUS_SHIPPED && <option value={ORDER_STATUS_DONE}>Selesai</option>}
                                </select>
                                <button
                                    className="btn btn-primary w-100"
                                    onClick={updateStatusHandler}
                                    disabled={!newStatusCode || updateStatusApi.isLoading}
                                >
                                    Perbarui Status
                                </button>
                            </div>
                        }
                    </div>
                </div>

                <div className="col-12">
                    <h3 className="h5 mb-3">Item Pesanan</h3>
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
                                    <tr key={item.id}>
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
    )
}

export default OrderDetailSection;
