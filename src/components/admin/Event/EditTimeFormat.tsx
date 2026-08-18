import React from 'react';

type TimeComponentProps = {
    timeValue: string;
    className?: string;
}

const TimeComponent: React.FC<TimeComponentProps> = ({ timeValue, className }) => {
    const convertTo12HourFormat = (timeStr: string): string => {
        if (!timeStr) return '';
        const [hour, minute] = timeStr.split(':').map(Number);
        let period = 'AM';

        if (isNaN(hour) || isNaN(minute)) return timeStr;

        if (hour === 0) {
            return `12:${minute.toString().padStart(2, '0')} AM`;
        } else if (hour === 12) {
            return `12:${minute.toString().padStart(2, '0')} PM`;
        } else if (hour > 12) {
            period = 'PM';
            return `${(hour - 12).toString()}:${minute.toString().padStart(2, '0')} ${period}`;
        } else {
            return `${hour.toString()}:${minute.toString().padStart(2, '0')} ${period}`;
        }
    };

    const formattedTime = timeValue ? convertTo12HourFormat(timeValue) : '';

    return (
        <span className={className || "inline-block text-left"}>
            {formattedTime}
        </span>
    );
}

export default TimeComponent;
