import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection'
import ProductForm from '../../components/ProductForm/ProductForm'
import { type ProductFormValues } from '../../types/product';
import useGrpcApi from '../../hooks/useGrpcApi';
import { getProductClient } from '../../api/grpc/client';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

interface uploadImageResponse {
    file_name: string;
    message: string;
    success: boolean;
}

function AdminCreateProduct() {
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const createProductApi = useGrpcApi();

    const submitHandler = async (values: ProductFormValues) => {
        try {
            setUploadLoading(true);
            const formData = new FormData();
            formData.append("image", values.image[0]);

            const uploadResponse = await axios.post<uploadImageResponse>("http://localhost:3000/product/upload", formData);
            if (uploadResponse.status !== 200) {
                Swal.fire({
                    title: "Upload Gambar Gagal",
                    text: "Silakan coba beberapa saat lagi.",
                    icon: "error",
                })
                return
            }

            await createProductApi.callApi(getProductClient().createProduct({
                description: values.description ?? "",
                imageFileName: uploadResponse.data.file_name,
                name: values.name,
                price: values.price,
            }));

            Swal.fire({
                title: "Tambah Produk Sukses",
                icon: "success"
            });

            navigate("/admin/products");
        } finally {
            setUploadLoading(false);
        }
    }
    return (
        <>
            <PlainHeroSection title='Tambah Produk' />

            <div className="untree_co-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <ProductForm
                                onSubmit={submitHandler}
                                disabled={createProductApi.isLoading || uploadLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminCreateProduct;
