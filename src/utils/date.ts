import { Timestamp } from "../../pb/google/protobuf/timestamp";

export const convertTimestampToDate = (timestamp: Timestamp | undefined): string => {
    if (!timestamp) {
        return '';
    }

    const date = new Date(Number(timestamp.seconds) * 1000)

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
}

export const convertTimestampToDateTime = (timestamp: Timestamp | undefined): string => {
    if (!timestamp) {
        return '';
    }

    const date = new Date(Number(timestamp.seconds) * 1000)

    const formattedDate = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('id-ID', {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return `${formattedDate} ${formattedTime}`;
}