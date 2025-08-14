import { RpcInterceptor } from "@protobuf-ts/runtime-rpc";

export const authInterceptor: RpcInterceptor = {
    interceptUnary(next, method, input, options) {
        const accessToken = localStorage.getItem('access_token');
        options.meta = {
            ...options.meta,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
            'X-Requested-With': 'XMLHttpRequest',
            'Origin': 'https://fumihome-fe-brown.vercel.app', 
            'Content-Type': 'application/grpc-web+proto',
            'X-Grpc-Web': '1',
            'X-Bypass-Auth': 'true'
        }
        return next(method, input, options);
    },
}
