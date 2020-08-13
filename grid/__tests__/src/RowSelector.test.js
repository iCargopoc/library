import React from 'react'
import RowSelector from '../../src/Functions/RowSelector'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom';
import { act } from "react-dom/test-utils";

const rowData = {
    "indeterminate": true,
    "id": "0",
    "flight": "XX2225",
    "segment": "BCC-ZZY",
    "details": "To Be Cancelled",
    "weight": "35490/20000 kg",
    "volume": "31/60 cbm"
}

describe('render row selected', () => {

    test('should select the row', () => {

        const { container } = render(<RowSelector {...rowData} />)
        const childComponent = container.querySelector('div')
        expect(childComponent).toBeInTheDocument()
        const checkBox = childComponent.firstChild
        act(() => {
            checkBox.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(checkBox.indeterminate).toBe(true)
    });
});
