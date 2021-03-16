export const getValueOfDate = (dateValue, type) => {
    if (dateValue) {
        const date = new Date(dateValue);
        if (type === "calendar") {
            const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
            const [
                { value: month },
                ,
                { value: day },
                ,
                { value: year }
            ] = dateTimeFormat.formatToParts(date);
            return `${year}-${month}-${day}`;
        }
        const dateTimeFormat = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        });
        const [
            { value: month },
            ,
            { value: day },
            ,
            { value: year }
        ] = dateTimeFormat.formatToParts(date);
        return `${day}-${month}-${year}`;
    }
};
