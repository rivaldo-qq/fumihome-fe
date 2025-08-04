import { ORDER_STATUS_CANCELED, ORDER_STATUS_DONE, ORDER_STATUS_EXPIRED, ORDER_STATUS_PAID, ORDER_STATUS_SHIPPED, ORDER_STATUS_UNPAID } from '../../constants/order';

interface OrderBadge {
    name: string;
    backgroundColor: string;
    textColor: string;
}

const getOrderBadge = (code: string): OrderBadge => {
    switch (code) {
        case ORDER_STATUS_UNPAID:
            return {
                name: "Belum Dibayar",
                backgroundColor: "#FDE68A",
                textColor: "#92400E",
            };
        case ORDER_STATUS_PAID:
            return {
                name: "Sudah Dibayar",
                backgroundColor: "#BBF7D0",
                textColor: "#166534",
            };
        case ORDER_STATUS_CANCELED:
            return {
                name: "Dibatalkan",
                backgroundColor: "#FECACA",
                textColor: "#991B1B",
            };
        case ORDER_STATUS_SHIPPED:
            return {
                name: "Sedang Dikirim",
                backgroundColor: "#BFDBFE",
                textColor: "#1E3A8A",
            };
        case ORDER_STATUS_DONE:
            return {
                name: "Selesai",
                backgroundColor: "#DDD6FE",
                textColor: "#5B21B6",
            };
        case ORDER_STATUS_EXPIRED:
            return {
                name: "Kedaluwarsa",
                backgroundColor: "#E5E7EB",
                textColor: "#374151",
            };
        default:
            return {
                name: "Status Tidak Diketahui",
                backgroundColor: "#F3F4F6",
                textColor: "#6B7280",
            };
    }
}

interface OrderStatusBadgeProps {
    code: string;
}

function OrderStatusBadge(props: OrderStatusBadgeProps) {
    const orderBadge: OrderBadge = getOrderBadge(props.code);
    return (
        <span
            style={{
                backgroundColor: orderBadge.backgroundColor,
                color: orderBadge.textColor,
                padding: "4px 8px",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 500,
                whiteSpace: "nowrap",
            }}
        >
            {orderBadge.name}
        </span>
    )
}

export default OrderStatusBadge