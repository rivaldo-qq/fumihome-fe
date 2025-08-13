#!/bin/sh

# Jalanin gRPC server di background
./grpc &

# Jalanin grpcwebproxy
grpcwebproxy \
  --backend_addr=localhost:50052 \
  --server_bind_address=0.0.0.0 \
  --server_http_debug_port=8080 \
  --run_tls_server=false \
  --backend_max_call_recv_msg_size=577659248 \
  --allow_all_origins
