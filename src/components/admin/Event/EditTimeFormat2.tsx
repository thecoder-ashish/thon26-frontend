import React from 'react';

type TimeComponentProps = {
    timeValue: string;
}

const TimeComponent: React.FC<TimeComponentProps> = ({ timeValue }) => {
    const convertTo12HourFormat = (timeStr: string): string => {
        const [hour, minute] = timeStr.split(':').map(Number);
        let period = 'AM';

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
        <div className="flex items-center text-xs sm:text-sm font-raleway justify-center ">
            {formattedTime}
        </div>
    );
}

export default TimeComponent;
