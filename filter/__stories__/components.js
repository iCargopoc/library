import React from "react";
import { ITextField } from "@neo-ui/textfield";
import { IDatePicker } from "@neo-ui/date";

const components = {
    custom1: (object) => {
        const { name } = object;
        return (
            <div>
                <ITextField name={`${name}.text`} label="Text" />
                <br />
                <IDatePicker name={`${name}.date`} label="Date" />
            </div>
        );
    },
    custom2: (object) => {
        const { name } = object;
        return (
            <div>
                <ITextField name={`${name}.text`} label="Text" />
                <br />
                <IDatePicker name={`${name}.date`} label="Date" />
            </div>
        );
    },
    custom1Port: (object) => {
        const { name } = object;
        return (
            <div>
                <ITextField name={`${name}.text`} label="Text" />
                <br />
                <IDatePicker name={`${name}.date`} label="Date" />
            </div>
        );
    },
    custom2Port: (object) => {
        const { name } = object;
        return (
            <div>
                <ITextField name={`${name}.text`} label="Text" />
                <br />
                <IDatePicker name={`${name}.date`} label="Date" />
            </div>
        );
    }
};

export default components;
