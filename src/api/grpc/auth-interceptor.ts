import { RpcInterceptor } from "@protobuf-ts/runtime-rpc";

export const authInterceptor: RpcInterceptor = {
    interceptUnary(next, method, input, options) {
        const accessToken = localStorage.getItem('access_token');
        options.meta = {
            ...options.meta,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
            'x-requested-with': 'XMLHttpRequest',
            'content-type': 'application/grpc-web+proto',
            'x-grpc-web': '1',
            'x-bypass-auth': 'true',
            'access-control-allow-origin':'https://pi-fumihome.cisha.id',
        }
        return next(method, input, options);
    },
}
