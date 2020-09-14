import React from "react";
const CustomPanel = () => {
    const CloseSegment = () => {
        alert("Close Segment");
    };
    const OpenSegment = () => {
        alert("Open Segment");
    };
    const OpenSummary = () => {
        alert("Open Summary");
    };
    const CloseSummary = () => {
        alert("Close Summary");
    };

    const buttonPanelData = [
        {
            label: "Close Segment",
            value: "Close Segment",
            handleEvent: CloseSegment,
            children: []
        },
        {
            label: "Open Segment",
            value: "Open Segment",
            handleEvent: OpenSegment,
            children: []
        },
        {
            label: "...",
            value: "...",
            children: [
                {
                    label: "Open Summary",
                    value: "OpenSummary",
                    handleEvent: OpenSummary
                },
                {
                    label: "Close Summary",
                    value: "handleEvent",
                    handleEvent: CloseSummary
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
                      return (
                          <div className="dropdown">
                              <button className="dropbtn" onClick={handleEvent}>
                                  {label}
                              </button>

                              <div className="dropdown-content">
                                  {isChildrenPresent
                                      ? children.map((action) => {
                                            const {
                                                label,
                                                handleEvent
                                            } = action;
                                            return (
                                                <div className="dropdown">
                                                    <button
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

export default CustomPanel;
