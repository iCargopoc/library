import React, { memo, useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import getValueOfDate from "../utils/DateUtility";

const divStyle = {
    backgroundColor: "#ccc",
    height: "100px",
    width: "1365px",
    marginLeft: "-1370px",
    marginTop: "-5px",
    paddingLeft: "20px",
    zIndex: "99"
};

const segmetEditStyle = {
    marginLeft: "240px",
    marginTop: "-60px"
};

const weightPercentageStyle = {
    width: "25%",
    marginLeft: "410px",
    marginTop: "-20px"
};

const weightValueStyle = {
    width: "25%",
    marginLeft: "410px",
    marginTop: "6px"
};
const srStyle = {
    marginLeft: "410px",
    marginTop: "4px"
};

const editRemarksStyle = {
    marginTop: "-75px",
    marginLeft: "700px"
};

const buttonDivStyle = {
    width: "15%",
    marginTop: "-80px",
    marginLeft: "1244px"
};
const RowEditOverLay = memo((props) => {
    const { row, rowEditData, updateRow, closeRowEditOverlay } = props;
    const { flight, segment, weight, sr, remarks } = row;
    const { airportCodeList } = rowEditData;

    const [value, setValue] = useState(row);
    const [oldValue] = useState(row);

    const onFlightNoChange = (e) => {
        const newFlightCellValue = {
            flightno: e.target.value,
            date: value.flight.date
        };
        setValue({
            ...value,
            flight: newFlightCellValue
        });
    };

    const onFlightDateChange = (e) => {
        const newFlightCellValue = {
            flightno: value.flight.flightno,
            date: e.target.value
        };
        setValue({
            ...value,
            flight: newFlightCellValue
        });
    };

    const onSegmentFromChange = (e) => {
        const newSegmentCellValue = {
            from: e.target.value,
            to: value.segment.to
        };
        setValue({
            ...value,
            segment: newSegmentCellValue
        });
    };

    const onSegmentToChange = (e) => {
        const newSegmentCellValue = {
            from: value.segment.from,
            to: e.target.value
        };
        setValue({
            ...value,
            segment: newSegmentCellValue
        });
    };

    const onWeightPercentageChange = (e) => {
        const newWeightCellValue = {
            percentage: e.target.value,
            value: value.weight.value
        };
        setValue({
            ...value,
            weight: newWeightCellValue
        });
    };

    const onWeightValueChange = (e) => {
        const newWeightCellValue = {
            percentage: value.weight.percentage,
            value: e.target.value
        };
        setValue({
            ...value,
            weight: newWeightCellValue
        });
    };

    const onSrChange = (e) => {
        setValue({
            ...value,
            sr: e.target.value
        });
    };

    const onRemarksChange = (e) => {
        setValue({
            ...value,
            remarks: e.target.value
        });
    };

    const saveRowEdit = () => {
        updateRow(value);
    };

    const cancelRowEdit = () => {
        setValue(oldValue);
        closeRowEditOverlay();
    };

    return (
        <ClickAwayListener onClickAway={closeRowEditOverlay}>
            <div className="main-div" style={divStyle}>
                <div className="row-edit-overlay">
                    <br />
                    <div className="edit-flight-no">
                        &nbsp;&nbsp;
                        <span>Flight No</span> &nbsp;
                        <input type="text" onChange={(e) => onFlightNoChange(e)} defaultValue={flight.flightno} />
                    </div>
                    <br />
                    <div className="edit-flight-date">
                        &nbsp;&nbsp;
                        <span>Date</span> &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input
                            type="date"
                            onChange={(e) => onFlightDateChange(e)}
                            defaultValue={getValueOfDate(flight.date, "calendar")}
                        />
                    </div>
                    <div className="edit-flight-segment" style={segmetEditStyle}>
                        <span>From</span>
                        &nbsp;
                        <select defaultValue={segment.from} onChange={(e) => onSegmentFromChange(e)}>
                            {airportCodeList.map((item, index) => {
                                return (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                        &nbsp;&nbsp;&nbsp;
                        <span>To</span>
                        &nbsp;
                        <select defaultValue={segment.to} onChange={(e) => onSegmentToChange(e)}>
                            {airportCodeList.map((item, index) => {
                                return (
                                    <option key={index} value={item}>
                                        {item}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className="edit-weight-value">
                        <div className="edit-weight-percentage-value" style={weightPercentageStyle}>
                            <span>Weight Percentage</span>
                            &nbsp;
                            <input type="text" defaultValue={weight.percentage} onChange={(e) => onWeightPercentageChange(e)} />
                        </div>
                        <div className="edit-weight-value-value" style={weightValueStyle}>
                            <span>Weight Value</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <input type="text" onChange={(e) => onWeightValueChange(e)} defaultValue={weight.value} />
                        </div>
                    </div>

                    <div className="edit-sr-value" style={srStyle}>
                        <span>SR</span>
                        &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="text" onChange={(e) => onSrChange(e)} defaultValue={sr} />
                    </div>
                    <div className="edit-remarks-value" style={editRemarksStyle}>
                        <span>Remarks</span>
                        <br />
                        <textarea onChange={(e) => onRemarksChange(e)} defaultValue={remarks} rows="3" cols="80"></textarea>
                    </div>
                </div>
                <div className="cancel-save-buttons" style={buttonDivStyle}>
                    <button className="save-Button" onClick={() => saveRowEdit(row)}>
                        Save
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button className="cancel-Button" onClick={cancelRowEdit}>
                        Cancel
                    </button>
                </div>
            </div>
        </ClickAwayListener>
    );
});

export default RowEditOverLay;
