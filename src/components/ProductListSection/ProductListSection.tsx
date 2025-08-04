import { useEffect, useState } from "react";
import Pagination from "../Pagination/Pagination"
import useGrpcApi from "../../hooks/useGrpcApi";
import { getCartClient, getProductClient } from "../../api/grpc/client";
import { formatToIDR } from "../../utils/number";
import Swal from "sweetalert2";
import { useAuthStore } from "../../store/auth";
import { useNavigate } from "react-router-dom";

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

function ProductListSection() {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const addToCartApi = useGrpcApi();
    const listApi = useGrpcApi();
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState<Product[]>([]);
    const [totalPages, setTotalPages] = useState<number>(0);
    const navigate = useNavigate();

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        const fetchData = async () => {
            const res = await listApi.callApi(getProductClient().listProduct({
                pagination: {
                    currentPage: currentPage,
                    itemPerPage: 8,
                }
            }));

            setItems(res.response.data.map(d => ({
                id: d.id,
                imageUrl: d.imageUrl,
                name: d.name,
                price: d.price,
            })));
            setTotalPages(res.response.pagination?.totalPageCount ?? 0);
        }

        fetchData();
    }, [currentPage]);

    const addToCartHandler = async (productId: string) => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }

        if (addToCartApi.isLoading) {
            return
        }

        await addToCartApi.callApi(getCartClient().addProductToCart({
            productId,
        }));

        Swal.fire({
            title: 'Berhasil Menambahkan ke Keranjang Belanja',
            icon: 'success',
        })
    }

    return (
        <div className="untree_co-section product-section before-footer-section">
            <div className="container">
                <div className="row">

                    {items.map(item => (
                        <div key={item.id} className="col-12 col-md-4 col-lg-3 mb-5">
                            <div className="product-item">
                                <img src={item.imageUrl} className="img-fluid product-thumbnail" />
                                <h3 className="product-title">{item.name}</h3>
                                <strong className="product-price">{formatToIDR(item.price)}</strong>

                                <span className="icon-cross" onClick={() => addToCartHandler(item.id)}>
                                    <img src="images/cross.svg" className="img-fluid" />
                                </span>
                            </div>
                        </div>
                    ))}

                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

export default ProductListSection