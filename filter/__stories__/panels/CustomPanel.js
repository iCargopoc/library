import React from "react";
const customPanel = () => {
    const CS = () => {
        alert("Close Segment");
    };
    const OS = () => {
        alert("Open Segment");
    };
    const Segment = () => {
        alert("Segment");
    };

    const Summary = () => {
        alert("Summary");
    };
    const OSEG = () => {
        alert("Open Seg");
    };
    const CSEG = () => {
        alert("Close Seg");
    };

    const buttonPanelData = [
        {
            label: "Close Segment",
            value: "CS",
            handleEvent: CS,
            children: []
        },
        {
            label: "Open Segment",
            value: "OS",
            handleEvent: OS,
            children: []
        },
        {
            label: "...",
            value: "SegmentSummary",
            children: [
                {
                    label: "Segment",
                    value: "segment",
                    handleEvent: Segment
                },
                {
                    label: "Summary",
                    value: "summary",
                    handleEvent: Summary
                },
                {
                    label: "Open Segment",
                    value: "OSEG",
                    handleEvent: OSEG
                },
                {
                    label: "Close Segment",
                    value: "CSEG",
                    handleEvent: CSEG
                }
            ]
        }
    ];

    const isbuttonPanelDataPresent =
        buttonPanelData && buttonPanelData.length > 0;

    return (
        <div className="row-options-overlay">
            {isbuttonPanelDataPresent
                ? buttonPanelData.map((action) => {
                      const { label, children, handleEvent } = action;
                      const isChildrenPresent = children && children.length > 0;
                      const popOverClassName = isChildrenPresent
                          ? "dropdown-content dropdown__popover"
                          : "dropdown-content";
                      return (
                          <div className="dropdown" key={label}>
                              <button
                                  type="button"
                                  className="dropbtn"
                                  onClick={handleEvent}
                              >
                                  {label}
                              </button>

                              <div className={popOverClassName}>
                                  {isChildrenPresent
                                      ? children.map((childAction) => {
                                            const {
                                                label,
                                                handleEvent
                                            } = childAction;
                                            return (
                                                <div
                                                    className="dropdown"
                                                    key={label}
                                                >
                                                    <button
                                                        type="button"
                                                        className="dropbtn"
                                                        onClick={handleEvent}
                                                    >
                                                        {label}
                                                    </button>
                                                </div>
                                            );
                                        })
                                      : null}
                              </div>
                          </div>
                      );
                  })
                : null}
        </div>
    );
};

export default customPanel;
