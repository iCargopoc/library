import React, { useEffect, useState, Suspense } from "react";
import { ISelect } from "@neo-ui/select";
import { IToggle } from "@neo-ui/toggle";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { IconTimes, IconCondition } from "../utilities/svgUtilities";
import components from "../dynamicImport/dynamicImportProcessor";

const FilterForm = (props) => {
    const { values, setFieldValue } = useFormikContext();
    const [filterArray, setFilterArray] = useState([]);
    const { filters, customComponents } = props;
    useEffect(() => {
        if (filters) {
            setFilterArray(filters);
        }
    }, [filters]);
    const componentDiv = filterArray.map((filter, index) => {
        if (filter.dataType === "Custom") {
            const Component = customComponents[filter.name];
            return (
                <div className="form-group" key={`${filter.name}`}>
                    <div className="title">
                        {filter.type && (
                            <label className="fs14 font-weight-bold">{`${filter.label} > ${filter.type}`}</label>
                        )}
                        {!filter.type && (
                            <label className="fs14 font-weight-bold">
                                {filter.label}
                            </label>
                        )}
                        <div className="controls">
                            <div
                                role="presentation"
                                data-testId="closeField"
                                className="close pointer"
                                onClick={() => {
                                    props.closeField(
                                        filter,
                                        setFieldValue,
                                        filter.name,
                                        values
                                    );
                                }}
                            >
                                <IconTimes />
                            </div>
                        </div>
                    </div>
                    <div className="form-inputs">
                        <Component name={filter.name} />
                    </div>
                </div>
            );
        }
        if (filter.isGroupFilter) {
            return (
                <div className="form-group" key={`${filter.label}`}>
                    <div className="title">
                        <label className="fs14 font-weight-bold">
                            {filter.label}
                        </label>
                        <div className="controls">
                            <div
                                role="presentation"
                                data-testId="closeField"
                                className="close pointer"
                                onClick={() => {
                                    props.groupFilterCloseField(
                                        filter,
                                        setFieldValue
                                    );
                                }}
                            >
                                <IconTimes />
                            </div>
                        </div>
                    </div>
                    <div className="form-inputs">
                        {filter.groupFilter.map((quanta, indice) => {
                            const Component = components[quanta.dataType];
                            return (
                                <div>
                                    <Suspense
                                        key={indice}
                                        fallback={<div> Loading...</div>}
                                    >
                                        <div className="sub-title">
                                            <label className="neo-form-control-label">
                                                {quanta.label}
                                            </label>
                                            {quanta.condition &&
                                                quanta.condition.length > 0 && (
                                                    <div className="control__condition__wrap">
                                                        <IToggle
                                                            name={`${quanta.label},check`}
                                                            onChange={() => {
                                                                props.groupFilterConditionHandler(
                                                                    quanta,
                                                                    values,
                                                                    setFieldValue
                                                                );
                                                            }}
                                                        />
                                                        <div className="control__condition">
                                                            <IconCondition />
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        {quanta.conditionFieldName && (
                                            <div
                                                disabled={quanta.disabled}
                                                style={{
                                                    display: quanta.display
                                                }}
                                                className="input-wrap"
                                            >
                                                <ISelect
                                                    label="Condition"
                                                    name={
                                                        quanta.conditionFieldName
                                                    }
                                                    options={quanta.condition}
                                                />
                                            </div>
                                        )}
                                        <Component
                                            name={quanta.name}
                                            {...(quanta.props
                                                ? quanta.props
                                                : {})}
                                        />
                                    </Suspense>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        const Component = components[filter.dataType];
        return (
            <div className="form-group" key={`${filter.name}`}>
                <div className="title">
                    {filter.type && (
                        <label className="fs14 font-weight-bold">{`${filter.label} > ${filter.type}`}</label>
                    )}
                    {!filter.type && (
                        <label className="fs14 font-weight-bold">
                            {filter.label}
                        </label>
                    )}
                    <div className="controls">
                        {filter.condition && filter.condition.length > 0 && (
                            <div className="control__condition__wrap">
                                <IToggle
                                    name={`${filter.labelName},check`}
                                    onChange={() => {
                                        props.conditionHandler(
                                            filter,
                                            values,
                                            setFieldValue
                                        );
                                    }}
                                />
                                <div className="control__condition">
                                    <IconCondition />
                                </div>
                            </div>
                        )}
                        <div
                            role="presentation"
                            data-testId="closeField"
                            className="close pointer"
                            onClick={() => {
                                props.closeField(
                                    filter,
                                    setFieldValue,
                                    filter.name,
                                    values
                                );
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                <div className="form-inputs">
                    {filter.conditionFieldName && (
                        <div className="input-wrap">
                            <label className="neo-form-control-label">
                                Condition
                            </label>
                            <ISelect
                                name={filter.conditionFieldName}
                                options={filter.condition}
                            />
                        </div>
                    )}
                    <Suspense key={index} fallback={<div> Loading...</div>}>
                        <Component
                            name={filter.name}
                            {...(filter.props ? filter.props : {})}
                        />
                    </Suspense>
                </div>
            </div>
        );
    });
    return <div>{componentDiv}</div>;
};

FilterForm.propTypes = {
    conditionHandler: PropTypes.any,
    closeField: PropTypes.any,
    filters: PropTypes.any,
    groupFilterCloseField: PropTypes.any,
    groupFilterConditionHandler: PropTypes.any,
    customComponents: PropTypes.any
};

export default FilterForm;
