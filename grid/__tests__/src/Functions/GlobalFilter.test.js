import {render, screen,fireEvent} from '@testing-library/react'
import React from 'react';
import "@testing-library/jest-dom/extend-expect";
import GlobalFilter from "../../../src/Functions/GlobalFilter";
import regeneratorRuntime from "regenerator-runtime";

describe('render global search', () => {

it('should search the given value', () => {
 const setGlobalFilter = jest.fn();
 const globalFilter=  "XX2225";
 
 const { getByText,queryByTestId,container}  = render(
 <GlobalFilter globalFilter={globalFilter} setGlobalFilter={ setGlobalFilter }/>
 );

 const input = container.getElementsByClassName("txt").item(0);
 fireEvent.change(input, { target: { value: 'ABC1178' } })
 expect(input.value).toBe('ABC1178');

 fireEvent.change(input, { target: { value: 'XYZ5639' } })
 expect(input.value).toBe('XYZ5639');

});
});