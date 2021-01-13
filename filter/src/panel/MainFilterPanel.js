import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { IButton } from "@neo/button";
import OutsideClickHandler from "react-outside-click-handler";
import sprite from "@neo-ui/images";
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
        listViewName,
        savedFilterName,
        resetFilter,
        theme
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
                        className="nf-header__tags-list"
                        data-testId={key}
                        key={key}
                        onClick={() => {
                            props.showDrawer();
                        }}
                    >
                        <span key={key}>{key}:</span>
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
                                        {String(item)}
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
                                        {item}
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
                            className="nf-header__tags-list"
                            data-testId={key}
                            key={key}
                            onClick={() => {
                                props.showDrawer();
                            }}
                        >
                            <span className="nf-header__tags-text" key={key}>
                                {key}:
                            </span>
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
                                            {values.value[item]}
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
        <>
            <OutsideClickHandler onOutsideClick={closeLeftPopUp}>
                <LeftPopUpPanel
                    leftPopUpShow={leftPopUpShow}
                    listView={listView}
                    handlelistViewClick={handlelistViewClick}
                    savedFilters={savedFilters}
                    listViewName={listViewName}
                    savedFilterName={savedFilterName}
                    theme={theme}
                />
            </OutsideClickHandler>
            <div className="nf-header__wrap">
                <div className="nf-header__block">
                    <div
                        style={{
                            cursor: "pointer"
                        }}
                        role="presentation"
                        className="nf-header__hamburger"
                        data-testId="handleListFilterCheck"
                        onClick={openLeftPopUp}
                    >
                        <svg className="icon-list">
                            <use href={`${sprite}#list`} />
                        </svg>
                    </div>
                    <div className="nf-header__text">
                        {listViewName &&
                        listViewName.length > 0 &&
                        !(savedFilterName && savedFilterName.length > 0)
                            ? listViewName
                            : savedFilterName}
                    </div>
                    <div
                        role="presentation"
                        className="nf-header__refresh pointer"
                        onClick={() => {
                            resetFilter();
                        }}
                        data-testId="resetFilters"
                    >
                        <svg className="icon-refresh" role="button">
                            <use href={`${sprite}#refresh`} />
                        </svg>
                    </div>

                    {CustomPanel && (
                        <div className="nf-header__custompanel">
                            <CustomPanel />
                        </div>
                    )}
                </div>
                <div className="nf-header__tags">
                    {chips}
                    <IButton
                        role="presentation"
                        dataTestId="addFilter"
                        onClick={() => {
                            showDrawer();
                        }}
                        className="neo-btn-link pointer"
                    >
                        <svg className="icon-plus">
                            <use href={`${sprite}#plus`} />
                        </svg>
                        Add Filter
                    </IButton>
                </div>
            </div>
        </>
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
    listViewName: PropTypes.any,
    savedFilterName: PropTypes.any,
    resetFilter: PropTypes.any,
    theme: PropTypes.any
};

export default MainFilterPanel;
