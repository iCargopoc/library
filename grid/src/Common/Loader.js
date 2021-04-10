// @flow
import React from "react";

const Loader = ({ classNameValue }: Object): React$Element<*> => {
    return (
        <div className={`ng-loader ${classNameValue}`}>
            <div className="ng-loader__block">
                <div className="ng-loader__item" />
                <div className="ng-loader__item" />
                <div className="ng-loader__item" />
                <div className="ng-loader__item" />
            </div>
        </div>
    );
};

export default Loader;
