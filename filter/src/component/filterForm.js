import React, { useEffect, useState, Suspense } from "react";
import { ISelect } from "@neo-ui/select";
import { IToggle } from "@neo-ui/toggle";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import sprite from "@neo-ui/images";
import components from "../dynamicImport/dynamicImportProcessor";

const FilterForm = (props) => {
    const { values, setFieldValue } = useFormikContext();
    const [filterArray, setFilterArray] = useState([]);
    const { filters, customComponents, autoLoad } = props;
    useEffect(() => {
        if (filters) {
            setFilterArray(filters);
        }
    }, [filters]);
    const componentDiv = filterArray.map((filter, index) => {
        if (filter.dataType === "Custom") {
            const Component = customComponents[filter.name];
            return (
                <div
                    className="form-group nf-form-group"
                    key={`${filter.name}`}
                >
                    <div className="nf-form__content-title">
                        {filter.type && (
                            <label className="fs14 font-weight-500">{`${filter.label} > ${filter.type}`}</label>
                        )}
                        {!filter.type && (
                            <label className="fs14 font-weight-500">
                                {filter.label}
                            </label>
                        )}
                        <div className="nf-form__content-controls">
                            <div
                                style={{
                                    display:
                                        filter.isRequired || autoLoad === "none"
                                            ? "none"
                                            : ""
                                }}
                                role="presentation"
                                data-testId="closeField"
                                className="nf-form__close pointer"
                                onClick={() => {
                                    props.closeField(
                                        filter,
                                        setFieldValue,
                                        filter.name,
                                        values
                                    );
                                }}
                            >
                                <svg className="icon-close">
                                    <use href={`${sprite}#cross-sm`} />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="form-inputs nf-form-inputs">
                        <Component name={filter.name} />
                    </div>
                </div>
            );
        }
        if (filter.isGroupFilter) {
            return (
                <div
                    className="form-group nf-form-group"
                    key={`${filter.label}`}
                >
                    <div className="nf-form__content-title">
                        <label className="fs14 font-weight-500">
                            {filter.label}
                        </label>
                        <div className="nf-form__content-controls">
                            <div
                                style={{
                                    display:
                                        filter.isRequired || autoLoad === "none"
                                            ? "none"
                                            : ""
                                }}
                                role="presentation"
                                data-testId="closeField"
                                className="nf-form__close pointer"
                                onClick={() => {
                                    props.groupFilterCloseField(
                                        filter,
                                        setFieldValue
                                    );
                                }}
                            >
                                <svg className="icon-close">
                                    <use href={`${sprite}#cross-sm`} />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="form-inputs nf-form-inputs">
                        {filter.groupFilter.map((quanta, indice) => {
                            const Component = components[quanta.dataType];
                            return (
                                <div>
                                    <Suspense
                                        key={indice}
                                        fallback={<div> Loading...</div>}
                                    >
                                        <div className="nf-form__sub-title">
                                            <label className="neo-form-control-label">
                                                {quanta.label}
                                            </label>
                                            {quanta.condition &&
                                                quanta.condition.length > 0 && (
                                                    <div className="nf-form__controls-block">
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
                                                        <div className="nf-form__controls-condition">
                                                            <svg className="icon-conditional">
                                                                <use
                                                                    href={`${sprite}#conditional`}
                                                                />
                                                            </svg>
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
                                                className="nf-form__input-wrap"
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
                                            isRequired={quanta.isRequired}
                                            name={quanta.name}
                                            id={quanta.componentId}
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
        if (filter.dataType === "IToggle") {
            return (
                <div
                    className="form-group nf-form-group"
                    key={`${filter.name}`}
                >
                    <div className="nf-form__content-title">
                        <Suspense key={index} fallback={<div> Loading...</div>}>
                            <Component
                                name={filter.name}
                                {...(filter.props ? filter.props : {})}
                            />
                        </Suspense>
                        <div className="nf-form__label-wrap">
                            <label className="fs14 font-weight-500">
                                {filter.label}
                            </label>
                        </div>
                        <div className="nf-form__content-controls">
                            <div
                                style={{
                                    display:
                                        filter.isRequired || autoLoad === "none"
                                            ? "none"
                                            : ""
                                }}
                                role="presentation"
                                data-testId="closeField"
                                className="nf-form__close pointer"
                                onClick={() => {
                                    props.closeField(
                                        filter,
                                        setFieldValue,
                                        filter.name,
                                        values
                                    );
                                }}
                            >
                                <svg className="icon-close">
                                    <use href={`${sprite}#cross-sm`} />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="form-group nf-form-group" key={`${filter.name}`}>
                <div className="nf-form__content-title">
                    {filter.type && (
                        <label className="fs14 font-weight-500">{`${filter.label} > ${filter.type}`}</label>
                    )}
                    {!filter.type && (
                        <label className="fs14 font-weight-500">
                            {filter.label}
                        </label>
                    )}
                    <div className="nf-form__content-controls">
                        {filter.condition && filter.condition.length > 0 && (
                            <div className="nf-form__controls-block">
                                <IToggle
                                    dataTestId={`${filter.labelName},check`}
                                    name={`${filter.labelName},check`}
                                    onChange={() => {
                                        props.conditionHandler(
                                            filter,
                                            values,
                                            setFieldValue
                                        );
                                    }}
                                />
                                <div className="nf-form__controls-condition">
                                    <svg className="icon-conditional">
                                        <use href={`${sprite}#conditional`} />
                                    </svg>
                                </div>
                            </div>
                        )}
                        <div
                            style={{
                                display:
                                    filter.isRequired || autoLoad === "none"
                                        ? "none"
                                        : ""
                            }}
                            role="presentation"
                            data-testId="closeField"
                            className="nf-form__close pointer"
                            onClick={() => {
                                props.closeField(
                                    filter,
                                    setFieldValue,
                                    filter.name,
                                    values
                                );
                            }}
                        >
                            <svg className="icon-close">
                                <use href={`${sprite}#cross-sm`} />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="form-inputs nf-form-inputs">
                    {filter.conditionFieldName && (
                        <div className="nf-form__input-wrap">
                            <label className="neo-form-control-label">
                                Condition
                            </label>
                            <ISelect
                                dataTestId={filter.conditionFieldName}
                                name={filter.conditionFieldName}
                                options={filter.condition}
                            />
                        </div>
                    )}
                    <Suspense key={index} fallback={<div> Loading...</div>}>
                        <Component
                            isRequired={filter.isRequired}
                            dataTestId={filter.name}
                            name={filter.name}
                            id={filter.componentId}
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
    customComponents: PropTypes.any,
    autoLoad: PropTypes.any
};

export default FilterForm;
