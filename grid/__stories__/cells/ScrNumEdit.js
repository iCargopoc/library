import React, { useState } from "react";

const ScrNumEdit = ({ rowData, rowUpdateCallBack }) => {
    const [updatedRowData, setUpdatedRowData] = useState(rowData);
    let { scr } = updatedRowData;
    if (scr !== null && scr !== undefined) {
        const updateRowData = (updatedScrData) => {
            const updatedRow = {
                ...updatedRowData,
                scr: updatedScrData
            };
            setUpdatedRowData(updatedRow);
            rowUpdateCallBack(updatedRow);
        };

        const updateNumValue = (e) => {
            updateRowData({
                ...scr,
                num: e.target.value
            });
        };

        const { num } = scr;
        return (
            <div>
                <input type="text" value={num} onChange={updateNumValue} />
            </div>
        );
    }
    return null;
};

export default ScrNumEdit;
