import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup, fireEvent ,screen, getByTestId} from "@testing-library/react";
import {create} from 'react-test-renderer';
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import CellDisplayAndEditContext  from "./../../../src/Utilities/TagsContext";
import DisplayTag from './../../../src/Functions/CellDisplayAndEditTag';
import TestRenderer from 'react-test-renderer';



test("with ReactDOM", () => {
    const componnet = render(<DisplayTag />);
    expect(componnet).toBeDefined()
   
});

  