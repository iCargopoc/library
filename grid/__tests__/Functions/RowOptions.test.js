/* eslint-disable no-undef */
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import RowOptions from "../../src/Functions/RowOptions";
import "@testing-library/jest-dom/extend-expect";

describe("render row options", () => {
    const rowdata = {
        original: {
            travelId: 0,
            flight: {
                flightno: "XX2225",
                date: "31-Aug-2016"
            },
            segment: {
                from: "BCC",
                to: "ZZY"
            },
            details: {
                flightModel: 6518,
                bodyType: "Big Body",
                type: "Van",
                startTime: "01:23 (S)",
                endTime: "11:29 (E)",
                status: "To Be Cancelled",
                additionalStatus:
                    "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
                timeStatus: "10:02 hrs to depart"
            },
            weight: {
                percentage: "16%",
                value: "35490/20000 kg"
            },
            volume: {
                percentage: "54%",
                value: "31/60 cbm"
            },
            uldPositions: [
                {
                    position: "L1",
                    value: "7/9"
                },
                {
                    position: "Q1",
                    value: "9/3"
                },
                {
                    position: "L6",
                    value: "8/4"
                },
                {
                    position: "Q7",
                    value: "4/9"
                }
            ],
            revenue: {
                revenue: "$63,474.27",
                yeild: "$7.90"
            },
            sr: "74/ AWBs",
            queuedBooking: {
                sr: "88/ AWBs",
                volume: "7437 kg / 31 cbm"
            },
            remarks:
                "Enim aute magna ipsum magna commodo qui aute et elit aliqua nostrud ea nulla duis. Proident dolore aliqua sint nostrud aliquip exercitation anim nulla quis cupidatat dolor nostrud aliqua incididunt. Mollit ut cillum Lorem laborum dolore proident."
        }
    };

    const rowActions = [
        { label: "edit" },
        { label: "delete" },
        { label: "Send SCR", value: "SCR" },
        { label: "Segment Summary", value: "SegmentSummary" },
        { label: "Open Summary", value: "OpenSummary" },
        { label: "Close Summary", value: "CloseSummary" }
    ];

    const rowActionCallback = jest.fn();

    afterEach(cleanup);
    const bindRowEditOverlayMock = jest.fn();
    const bindRowDeleteOverlayMock = jest.fn();

    it("Should render component, open the overlay and then close it", () => {
        const { getByText, container } = render(
            <RowOptions
                row={rowdata}
                rowActions={rowActions}
                rowActionCallback={rowActionCallback}
                bindRowEditOverlay={bindRowEditOverlayMock}
                bindRowDeleteOverlay={bindRowDeleteOverlayMock}
            />
        );
        const editButton = document.querySelector("[class=icon-row-options]")
            .firstChild;
        act(() => {
            editButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(getByText("Send SCR")).toBeInTheDocument();
        const closeButton = document.querySelector("[class=close]").firstChild;
        act(() => {
            closeButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const overlayContainer = container
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(overlayContainer).toBe(null);
    });

    it("Open Edit, Delete and Custom option link", () => {
        const { getByText, container } = render(
            <RowOptions
                row={rowdata}
                rowActions={rowActions}
                rowActionCallback={rowActionCallback}
                bindRowEditOverlay={bindRowEditOverlayMock}
                bindRowDeleteOverlay={bindRowDeleteOverlayMock}
            />
        );
        const editButton = document.querySelector("[class=icon-row-options]")
            .firstChild;
        // Edit row link
        act(() => {
            editButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(getByText("Send SCR")).toBeInTheDocument();
        const EditLink = getByText("Edit");
        act(() => {
            EditLink.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        let overlayContainer = container
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(overlayContainer).toBe(null);
        // Delete row link
        act(() => {
            editButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(getByText("Send SCR")).toBeInTheDocument();
        const DeleteLink = getByText("Delete");
        act(() => {
            DeleteLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        overlayContainer = container
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(overlayContainer).toBe(null);
        // Custom row option link
        act(() => {
            editButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(getByText("Send SCR")).toBeInTheDocument();
        const CustomLink = getByText("Send SCR");
        act(() => {
            CustomLink.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        overlayContainer = container
            .getElementsByClassName("row-options-overlay")
            .item(0);
        expect(overlayContainer).toBe(null);
    });
});
