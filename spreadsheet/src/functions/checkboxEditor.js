import React, { Component } from "react";
import PropTypes from "prop-types";

export default class CheckboxEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: false
        };
        // the variable to store component reference
        this.input = null;

        this.getInputNode = this.getInputNode.bind(this);
        this.getValue = this.getValue.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(ev) {
        const value = ev.target.checked;
        this.setState({ value });
    }

    // returning updated object with the date value in the required format
    getValue() {
        const updated = {};
        const { value } = this.state;
        const { column } = this.props;
        updated[column.key] = value;
        return updated;
    }

    // returning the component with the reference, input
    getInputNode() {
        return this.input;
    }

    render() {
        const { value } = this.state;
        return (
            <div className="checkboxEdit-wrap">
                <input
                    type="checkbox"
                    ref={(ref) => {
                        this.input = ref;
                    }}
                    value={value}
                    onChange={this.onValueChanged}
                    className="custom-checkbox checkBoxEdit"
                />
            </div>
        );
    }
}

CheckboxEditor.propTypes = {
    column: PropTypes.string
};
