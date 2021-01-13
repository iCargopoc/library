export const dateFormatter = (dateObject) => {
    const date = new Date(dateObject);
    const formattedDate = date
        .toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        .replace(/ /g, "-");
    return formattedDate;
};
