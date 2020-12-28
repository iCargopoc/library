import React from "react";
import EditIcon from "../images/EditIcon.png";
import DeleteIcon from "../images/DeleteIcon.png";

const RowAction = ({
    rowData,
    isSubComponentRow,
    fixedRowHeight,
    closeOverlay,
    bindRowEditOverlay,
    bindRowDeleteOverlay
}) => {
    const openEditOverlay = () => {
        bindRowEditOverlay(rowData, isSubComponentRow);
        closeOverlay();
    };
    const openDeleteOverlay = () => {
        bindRowDeleteOverlay(rowData, isSubComponentRow);
        closeOverlay();
    };
    let isDeleteOptionNeeded = true;
    if (isSubComponentRow) {
        const { hawbId } = rowData;
        isDeleteOptionNeeded = hawbId % 2 === 0;
    } else {
        const { travelId } = rowData;
        isDeleteOptionNeeded = travelId % 2 === 0;
    }
    return (
        <ul>
            {fixedRowHeight !== true ? (
                <li role="presentation" onClick={openEditOverlay}>
                    <span>
                        <i>
                            <img src={EditIcon} alt="edit-row" />
                        </i>
                        <span>Edit</span>
                    </span>
                </li>
            ) : null}
            {isDeleteOptionNeeded % 2 === 0 ? (
                <li role="presentation" onClick={openDeleteOverlay}>
                    <span>
                        <i>
                            <img src={DeleteIcon} alt="delete-row" />
                        </i>
                        <span>Delete</span>
                    </span>
                </li>
            ) : null}
            <li
                role="presentation"
                onClick={() => {
                    alert("SCR");
                }}
            >
                <span>
                    <i />
                    <span>Send SCR</span>
                </span>
            </li>
            <li
                role="presentation"
                onClick={() => {
                    alert("SegmentSummary");
                }}
            >
                <span>
                    <i />
                    <span>Segment Summary</span>
                </span>
            </li>
            <li
                role="presentation"
                onClick={() => {
                    alert("OpenSummary");
                }}
            >
                <span>
                    <i />
                    <span>Open Summary</span>
                </span>
            </li>
            <li
                role="presentation"
                onClick={() => {
                    alert("CloseSummary");
                }}
            >
                <span>
                    <i />
                    <span>Close Summary</span>
                </span>
            </li>
        </ul>
    );
};

export default RowAction;
