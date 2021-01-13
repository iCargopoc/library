import React from "react";
import { withFormik } from "formik";

const appliedFilters = (appliedFilter) => {
    alert(`AppliedFilters:${JSON.stringify(appliedFilter)}`);
};

// eslint-disable-next-line react/prop-types
const Form = ({ children }) => {
    return <>{children}</>;
};
export default withFormik({
    mapPropsToValues: () => ({
        appliedFilters: { appliedFilters }
    }),
    displayName: "BasicForm"
})(Form);
