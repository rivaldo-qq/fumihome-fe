export const formatToIDR = (num: number): string => {
    return Intl.NumberFormat(
        'ID-id',
        { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }
    ).format(num);
}