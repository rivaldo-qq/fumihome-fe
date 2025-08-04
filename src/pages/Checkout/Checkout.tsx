import { useLocation, useNavigate } from 'react-router-dom';
import PlainHeroSection from '../../components/PlainHeroSection/PlainHeroSection'
import { CartCheckoutState } from '../../types/cart';
import { formatToIDR } from '../../utils/number';
import { useForm } from 'react-hook-form';
import FormInput from '../../components/FormInput/FormInput';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthStore } from '../../store/auth';
import useGrpcApi from '../../hooks/useGrpcApi';
import { getCartClient, getOrderClient } from '../../api/grpc/client';
import { useEffect } from 'react';


const checkoutSchema = yup.object().shape({
    fullName: yup.string().required('Nama lengkap wajib diisi'),
    address: yup.string().required('Alamat wajib diisi'),
    phoneNumber: yup.string().required('Nomor telepon wajib diisi'),
})

interface CheckoutFormValues {
    fullName: string;
    address: string;
    phoneNumber: string;
    notes?: string;
}

function Checkout() {
    const navigate = useNavigate();
    const submitApi = useGrpcApi();
    const deleteCartApi = useGrpcApi();
    const authFullName = useAuthStore(state => state.jwtPayload?.full_name ?? "");
    const form = useForm<CheckoutFormValues>({
        resolver: yupResolver(checkoutSchema),
        defaultValues: {
            fullName: authFullName,
        }
    })
    const location = useLocation();
    const checkoutState = location.state as CartCheckoutState | null;
    const products = checkoutState?.products ?? [];
    const totalPrice = checkoutState?.total ?? 0;
    const cartIds = checkoutState?.cartIds ?? [];
    const submitLoading = submitApi.isLoading || deleteCartApi.isLoading;

    useEffect(() => {
        if (!checkoutState) {
            navigate('/cart', { state: null });
        }
    }, [checkoutState]);

    const submitHandler = () => {
        form.handleSubmit(async (values: CheckoutFormValues) => {
            const res = await submitApi.callApi(getOrderClient().createOrder({
                address: values.address,
                fullName: values.fullName,
                notes: values.notes ?? "",
                phoneNumber: values.phoneNumber,
                products: products.map(product => ({
                    id: product.id,
                    quantity: BigInt(product.quantity),
                }))
            }));

            await Promise.all(cartIds.map(id => deleteCartApi.callApi(getCartClient().deleteCart({ cartId: id, }))));

            navigate(`/checkout/${res.response.id}/success`, { state: null });
        })();
    }

    return (
        <>
            <PlainHeroSection title='Checkout' />

            <div className="untree_co-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 mb-5 mb-md-0">
                            <h2 className="h3 mb-3 text-black">Detail Penagihan</h2>
                            <div className="p-3 p-lg-5 border bg-white">
                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <FormInput
                                            errors={form.formState.errors}
                                            name='fullName'
                                            register={form.register}
                                            type='text'
                                            labelRequired
                                            label='Nama Lengkap'
                                            placeholder='Nama Lengkap'
                                            disabled={submitLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <FormInput
                                            errors={form.formState.errors}
                                            name='address'
                                            register={form.register}
                                            type='text'
                                            labelRequired
                                            label='Alamat'
                                            placeholder='Alamat'
                                            disabled={submitLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="col-md-12">
                                        <FormInput
                                            errors={form.formState.errors}
                                            name='phoneNumber'
                                            register={form.register}
                                            type='text'
                                            labelRequired
                                            label='Nomor Telepon'
                                            placeholder='Nomor Telepon'
                                            disabled={submitLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <FormInput
                                        errors={form.formState.errors}
                                        name='notes'
                                        register={form.register}
                                        type='textarea'
                                        label='Catatan Pesanan'
                                        placeholder='Tulis catatan Anda di sini...'
                                        disabled={submitLoading}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className="col-md-6">

                            <div className="row mb-5">
                                <div className="col-md-12">
                                    <h2 className="h3 mb-3 text-black">Pesanan Anda</h2>
                                    <div className="p-3 p-lg-5 border bg-white">
                                        <table className="table site-block-order-table mb-5">
                                            <thead>
                                                <th>Produk</th>
                                                <th>Total</th>
                                            </thead>
                                            <tbody>
                                                {products.map(product => (
                                                    <tr key={product.id}>
                                                        <td>{product.name} <strong className="mx-2">x</strong> {product.quantity}</td>
                                                        <td>{formatToIDR(product.price)}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td className="text-black font-weight-bold"><strong>Subtotal Keranjang</strong></td>
                                                    <td className="text-black">{formatToIDR(totalPrice)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-black font-weight-bold"><strong>Total Pesanan</strong></td>
                                                    <td className="text-black font-weight-bold"><strong>{formatToIDR(totalPrice)}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div className="form-group">
                                            <button
                                                className="btn btn-black btn-lg py-3 btn-block"
                                                onClick={submitHandler}
                                                disabled={submitLoading}
                                            >
                                                Buat Pesanan
                                            </button>
                                        </div>

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

export default Checkout;
