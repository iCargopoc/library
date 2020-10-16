import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IButton } from "@neo/button";
import OutsideClickHandler from "react-outside-click-handler";
import { IconLeftAlign } from "../utilities/svgUtilities";
import LeftPopUpPanel from "./leftpopUpPanel";

let chips;
const MainFilterPanel = (props) => {
    const [chipArray, setChipArray] = useState({});
    const {
        applyFilterChip,
        showDrawer,
        CustomPanel,
        listView,
        handlelistViewClick,
        leftPopUpShow,
        openLeftPopUp,
        closeLeftPopUp,
        savedFilters,
        handleSavedFilterClick,
        listViewName,
        savedFilterName
    } = props;

    useEffect(() => {
        setChipArray(applyFilterChip);
    }, [applyFilterChip]);

    if (chipArray) {
        chips = Object.entries(chipArray).map(([key, values]) => {
            if (
                !values.condition &&
                (((typeof values === "string" || Array.isArray(values)) &&
                    values.length > 0) ||
                    (values &&
                        values.constructor === Object &&
                        Object.keys(values).length > 0) ||
                    (typeof values === "boolean" && !key.includes(",check")))
            ) {
                return (
                    <div
                        role="presentation"
                        className="listContent"
                        data-testId={key}
                        key={key}
                        onClick={() => {
                            props.showDrawer();
                        }}
                    >
                        <span key={key}>{key}</span>
                        {(typeof values === "string" ||
                            typeof values === "boolean") && (
                            <div key={values}>
                                &nbsp;&nbsp;
                                {values.toString()}
                                &nbsp;&nbsp;
                            </div>
                        )}
                        {Array.isArray(values) &&
                            values.map((item) => {
                                return (
                                    <div key={item}>
                                        &nbsp;&nbsp;
                                        {item}
                                        &nbsp;&nbsp;
                                    </div>
                                );
                            })}
                        {values &&
                            values.constructor === Object &&
                            Object.entries(values).map(([keys, item]) => {
                                return (
                                    <div key={keys}>
                                        &nbsp;&nbsp;
                                        {keys}:{item}
                                        &nbsp;&nbsp;
                                    </div>
                                );
                            })}
                    </div>
                );
            }
            if (
                (values.condition &&
                    values.condition.length > 0 &&
                    (typeof values.value === "string" ||
                        Array.isArray(values.value)) &&
                    values.value.length > 0) ||
                (typeof values.value === "object" &&
                    !Array.isArray(values.value) &&
                    Object.keys(values.value).length > 0) ||
                (typeof values.value === "boolean" && !key.includes(",check"))
            ) {
                if (
                    values.condition &&
                    values.condition.length &&
                    (((typeof values.value === "string" ||
                        Array.isArray(values.value)) &&
                        values.value.length > 0) ||
                        (typeof values.value === "object" &&
                            !Array.isArray(values.value) &&
                            Object.keys(values.value).length > 0) ||
                        (typeof values.value === "boolean" &&
                            !key.includes(",check")))
                )
                    return (
                        <div
                            role="presentation"
                            className="listContent"
                            data-testId={key}
                            key={key}
                            onClick={() => {
                                props.showDrawer();
                            }}
                        >
                            <span key={key}>{key}</span>
                            {values.condition && (
                                <div key={values.condition}>
                                    {values.condition}
                                    &nbsp;&nbsp;
                                </div>
                            )}
                            {(typeof values.value === "string" ||
                                typeof values.value === "boolean") && (
                                <div key={values.value}>
                                    {values.value.toString()}
                                </div>
                            )}
                            {Array.isArray(values.value) &&
                                values.value.map((item) => {
                                    return (
                                        <div key={item}>
                                            &nbsp;&nbsp;
                                            {item}
                                            &nbsp;&nbsp;
                                        </div>
                                    );
                                })}
                            {typeof values.value === "object" &&
                                !Array.isArray(values.value) &&
                                Object.keys(values.value).map((item) => {
                                    return (
                                        <div key={item}>
                                            &nbsp;&nbsp;
                                            {item}:{values.value[item]}
                                            &nbsp;&nbsp;
                                        </div>
                                    );
                                })}
                        </div>
                    );
            }
            return <div />;
        });
    }
    return (
        <div className="neo-header">
            <div className="header__filter">
                <div className="displayFlex">
                    <div className="alignLeft">
                        <div
                            style={{
                                cursor: "pointer"
                            }}
                            role="presentation"
                            className="iconLeft"
                            data-testId="handleListFilterCheck"
                            onClick={openLeftPopUp}
                        >
                            <IconLeftAlign />
                            <OutsideClickHandler
                                onOutsideClick={closeLeftPopUp}
                            >
                                <LeftPopUpPanel
                                    leftPopUpShow={leftPopUpShow}
                                    listView={listView}
                                    handlelistViewClick={handlelistViewClick}
                                    savedFilters={savedFilters}
                                    handleSavedFilterClick={
                                        handleSavedFilterClick
                                    }
                                    listViewName={listViewName}
                                    savedFilterName={savedFilterName}
                                />
                            </OutsideClickHandler>
                        </div>
                        <div className="leftSpace">
                            {listViewName && listViewName.length > 0
                                ? listViewName
                                : savedFilterName}
                        </div>
                    </div>
                    {CustomPanel && (
                        <div className="header__custompanel">
                            <CustomPanel />
                        </div>
                    )}
                </div>
                <div className="secondList">
                    <div className="displayFlex">
                        <div className="filter__tags pointer">
                            {chips}
                            <IButton
                                role="presentation"
                                data-testId="addFilter"
                                onClick={() => {
                                    showDrawer();
                                }}
                                className="neo-btn-link pointer"
                            >
                                + Add Filter
                            </IButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

MainFilterPanel.propTypes = {
    applyFilterChip: PropTypes.any,
    showDrawer: PropTypes.any,
    CustomPanel: PropTypes.any,
    listView: PropTypes.any,
    savedFilters: PropTypes.any,
    handlelistViewClick: PropTypes.any,
    leftPopUpShow: PropTypes.any,
    openLeftPopUp: PropTypes.any,
    closeLeftPopUp: PropTypes.any,
    handleSavedFilterClick: PropTypes.any,
    listViewName: PropTypes.any,
    savedFilterName: PropTypes.any
};

export default MainFilterPanel;
