import { Link, useNavigate } from 'react-router-dom';
import useGrpcApi from '../../hooks/useGrpcApi';
import { useEffect, useState } from 'react';
import { getCartClient, getProductClient } from '../../api/grpc/client';
import { formatToIDR } from '../../utils/number';
import { useAuthStore } from '../../store/auth';
import Swal from 'sweetalert2';

interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
}

interface ProductHighlightSectionProps {
    beforeFooter?: boolean;
}

function ProductHighlightSection(props: ProductHighlightSectionProps) {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const addToCartApi = useGrpcApi();
    const [items, setItems] = useState<Product[]>([]);
    const productApi = useGrpcApi();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const res = await productApi.callApi(getProductClient().highlightProducts({}));

            setItems(res.response.data.map(d => ({
                id: d.id,
                imageUrl: d.imageUrl,
                name: d.name,
                price: d.price,
            })))
        }

        fetchData();
    }, []);

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
        <div className={`product-section ${props.beforeFooter ? 'before-footer-section' : ''}`}>
            <div className="container">
                <div className="row">
                    <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
                        <h2 className="mb-4 section-title">Dibuat dengan material terbaik.</h2>
                        <p className="mb-4">Rasakan perpaduan sempurna antara keahlian dan daya tahan. Furnitur kami dibuat dengan material premium untuk meningkatkan estetika dan kenyamanan ruang Anda.</p>
                        <p><Link to="/shop" className="btn">Jelajahi</Link></p>
                    </div>

                    {items.map(item => (
                        <div key={item.id} className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
                            <div className="product-item">
                                <img src={item.imageUrl} className="img-fluid product-thumbnail" alt="product_image" />
                                <h3 className="product-title">{item.name}</h3>
                                <strong className="product-price">{formatToIDR(item.price)}</strong>
                                <span className="icon-cross" onClick={() => addToCartHandler(item.id)}>
                                    <img src="/images/cross.svg" className="img-fluid" alt="Cross" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductHighlightSection;
