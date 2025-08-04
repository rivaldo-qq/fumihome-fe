import { Link, useParams } from 'react-router-dom';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection';
import { useEffect, useState } from 'react';
import useGrpcApi from '../../hooks/useGrpcApi';
import { getOrderClient } from '../../api/grpc/client';
import { convertTimestampToDateTime } from '../../utils/date';
import { formatToIDR } from '../../utils/number';
import { ORDER_STATUS_UNPAID } from '../../constants/order';

function CheckoutSuccess() {
    const { id } = useParams();
    const detailApi = useGrpcApi();
    const [number, setNumber] = useState<string>("");
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [expiredAt, setExpiredAt] = useState<string>("");
    const [invoiceUrl, setInvoiceUrl] = useState<string>("");
    const [statusCode, setStatusCode] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const res = await detailApi.callApi(getOrderClient().detailOrder({
                id: id ?? "",
            }));

            setNumber(res.response.number);
            setTotalPrice(res.response.total);
            setExpiredAt(convertTimestampToDateTime(res.response.expiredAt));
            setInvoiceUrl(res.response.xenditInvoiceUrl);
            setStatusCode(res.response.orderStatusCode);
        }

        fetchData();
    }, []);


    return (
        <>
            <PlainHeroSection title='Pesanan Dikonfirmasi' />

            <div className="untree_co-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="p-4 p-lg-5 border bg-white">
                                <div className="text-center mb-4">
                                    <span className="display-3 thankyou-icon mb-4">
                                        <i className="bi bi-check-circle-fill"></i>
                                    </span>
                                    <h2 className="text-black">Terima kasih atas pesanan Anda!</h2>
                                </div>

                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className="border-bottom pb-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-black">Nomor Pesanan:</span>
                                                <strong className="text-black">{number}</strong>
                                            </div>
                                        </div>
                                        <div className="border-bottom py-2">
                                            <div className="d-flex justify-content-between">
                                                <span className="text-black">Total yang harus dibayar:</span>
                                                <strong className="text-black">{formatToIDR(totalPrice)}</strong>
                                            </div>
                                        </div>
                                        {statusCode === ORDER_STATUS_UNPAID &&
                                            <div className="py-2 border-bottom">
                                                <div className="d-flex justify-content-between">
                                                    <span className="text-black">Batas waktu pembayaran:</span>
                                                    <strong className="text-black">{expiredAt}</strong>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className="text-center">
                                    {statusCode === ORDER_STATUS_UNPAID &&
                                        <a
                                            href={invoiceUrl}
                                            rel="noopener noreferrer"
                                            className="btn btn-primary mb-3"
                                        >
                                            Bayar Sekarang
                                        </a>
                                    }
                                    <div>
                                        <Link to="/shop" className="btn btn-secondary me-2">Lanjut Belanja</Link>
                                        <Link to="/profile/orders" className="btn btn-primary">Lihat Riwayat Pesanan</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutSuccess;
