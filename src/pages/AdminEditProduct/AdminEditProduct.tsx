import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection'
import ProductForm from '../../components/ProductForm/ProductForm'
import { type ProductFormValues } from '../../types/product';
import useGrpcApi from '../../hooks/useGrpcApi';
import { getProductClient } from '../../api/grpc/client';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface uploadImageResponse {
    file_name: string;
    message: string;
    success: boolean;
}

function AdminEditProduct() {
    const { id } = useParams();
    const detailApi = useGrpcApi()
    const [uploadLoading, setUploadLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const editProductApi = useGrpcApi();
    const [defaultValues, setDefaultValues] = useState<ProductFormValues | undefined>(undefined)

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await detailApi.callApi(getProductClient().detailProduct({
                id: id ?? ""
            }));

            setDefaultValues({
                name: res.response.name,
                price: res.response.price,
                description: res.response.description,
                image: new DataTransfer().files,
                imageUrl: res.response.imageUrl,
            });
        }

        fetchDetail();
    }, [])

    const submitHandler = async (values: ProductFormValues) => {
        try {
            setUploadLoading(true);

            let newImageFileName = "";
            if (values.image.length > 0) {
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

                newImageFileName = uploadResponse.data.file_name;
            }

            await editProductApi.callApi(getProductClient().editProduct({
                id: id ?? "",
                description: values.description ?? "",
                imageFileName: newImageFileName || (values.imageUrl?.split("/").pop() ?? ""),
                name: values.name,
                price: values.price,
            }));

            Swal.fire({
                title: "Edit Produk Sukses",
                icon: "success"
            });

            navigate("/admin/products");
        } finally {
            setUploadLoading(false);
        }
    }
    return (
        <>
            <PlainHeroSection title='Edit Produk' />

            <div className="untree_co-section">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <ProductForm
                                onSubmit={submitHandler}
                                disabled={editProductApi.isLoading || uploadLoading || detailApi.isLoading}
                                defaultValues={defaultValues}
                                isEdit
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminEditProduct;
