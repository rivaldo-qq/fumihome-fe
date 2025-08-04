import { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FinishedUnaryCall, RpcError, type UnaryCall } from '@protobuf-ts/runtime-rpc';
import { useAuthStore } from '../store/auth';
import { BaseResponse } from '../../pb/common/base_response';

interface callApiArgs<T extends object, U extends GrpcBaseResponse> {
    useDefaultError?: boolean;
    defaultError?: (e: FinishedUnaryCall<T, U>) => void;
    useDefaultAuthError?: boolean;
    defaultAuthError?: (e: RpcError) => void;
}

interface GrpcBaseResponse {
    base?: BaseResponse;
}

function useGrpcApi() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const logoutUser = useAuthStore(state => state.logout);

    const callApi = async <T extends object, U extends GrpcBaseResponse>(
        api: UnaryCall<T, U>,
        args?: callApiArgs<T, U>
    ) => {
        try {
            setIsLoading(true);

            const res = await api;
            if (res.response.base?.isError ?? true) {
                throw res;
            }

            return res;
        } catch (e) {
            if (e instanceof RpcError) {
                if (e.code === 'UNAUTHENTICATED') {
                    if (args?.useDefaultAuthError ?? true) {
                        logoutUser();
                        localStorage.removeItem('access_token');
                        Swal.fire({
                            title: 'Sesi Telah Berakhir',
                            text: 'Silakan login ulang kembali.',
                            icon: 'warning',
                        })
                        navigate('/');
                    }

                    if (args?.useDefaultAuthError === false && args.defaultAuthError) {
                        args.defaultAuthError(e);
                    }

                    throw e;
                }
            }

            if (typeof e === "object" && e !== null && "response" in e && args?.useDefaultError === false) {
                if (args?.defaultError) {
                    args.defaultError(e as FinishedUnaryCall<T, U>)
                }
            }

            if (args?.useDefaultError ?? true) {
                Swal.fire({
                    title: 'Terjadi Kesalahan',
                    text: 'Silakan coba beberapa saat lagi.',
                    icon: 'error',
                })
            }

            throw e;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        isLoading,
        callApi,
    }
}

export default useGrpcApi;
