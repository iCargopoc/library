/* eslint-disable flowtype/no-weak-types */
// @flow
import React from "react";

export const IconClose = (p: Object): React$Element<*> => (
    <svg id="close-x" viewBox="0 0 12 12" {...p}>
        <g transform="matrix(1.05127 0 0 1.05127 -17.948 .619)">
            <rect
                transform="rotate(44.198)"
                rx="1.193"
                ry="1.193"
                y="-19.021"
                x="18.573"
                height="13.763"
                width="2.508"
                opacity=".98"
            />
            <rect
                transform="rotate(-45.802)"
                rx="1.193"
                ry="1.193"
                y="13.042"
                x="10.932"
                height="13.763"
                width="2.508"
                opacity=".98"
            />
        </g>
    </svg>
);

export const IconJustify = (p: Object): React$Element<*> => (
    <svg id="drag-hor" viewBox="0 0 512 512" {...p}>
        <g id="drag-hor">
            <circle className="cls-1" cx="436.44" cy="165.89" r="45.44" />
            <circle className="cls-1" cx="436.44" cy="346.11" r="45.44" />
            <circle className="cls-1" cx="255.49" cy="346.11" r="45.44" />
            <circle className="cls-1" cx="255.49" cy="166.93" r="45.44" />
            <circle className="cls-1" cx="75.56" cy="166.54" r="45.44" />
            <circle className="cls-1" cx="75.72" cy="345.58" r="45.44" />
        </g>
    </svg>
);

export const IconCsv = (p: Object): React$Element<*> => (
    <svg id="csv" viewBox="0 0 512 512" {...p}>
        <path d="M441.28 187.83h-11.5v-55.51a7.64 7.64 0 00-.11-1 9.2 9.2 0 00-2.22-6.08L335.08 19.69a.46.46 0 01-.07-.07 9 9 0 00-1.87-1.57 5.54 5.54 0 00-.62-.36 9.68 9.68 0 00-1.85-.78c-.18-.05-.33-.12-.5-.17a9.75 9.75 0 00-2.16-.27H101a18.8 18.8 0 00-18.77 18.79v152.56h-11.5a26.86 26.86 0 00-26.86 26.85V354.3a26.87 26.87 0 0026.86 26.86h11.5v95.58A18.8 18.8 0 00101 495.53h310a18.82 18.82 0 0018.79-18.79v-95.58h11.5a26.86 26.86 0 0026.85-26.85V214.68a26.85 26.85 0 00-26.86-26.85zM101 35.26h217.62v96.11a9.4 9.4 0 009.39 9.4h83v47.06H101zm141.43 254.85c-23.31-8.12-38.49-21-38.49-41.41 0-23.94 20-42.26 53.06-42.26 15.82 0 27.47 3.33 35.79 7.08l-7.06 25.6a66.63 66.63 0 00-29.35-6.66c-13.74 0-20.38 6.24-20.38 13.54 0 9 7.9 12.91 26 19.78 24.77 9.15 36.42 22.05 36.42 41.83 0 23.51-18.1 43.5-56.61 43.5-16 0-31.84-4.18-39.75-8.54l6.45-26.23c8.54 4.39 21.64 8.75 35.18 8.75 14.56 0 22.27-6 22.27-15.2.04-8.77-6.67-13.76-23.53-19.78zm-165.25-9.17c0-47.86 34.14-74.5 76.58-74.5 16.45 0 28.93 3.33 34.56 6.25l-6.46 25.17a68.84 68.84 0 00-26.64-5.19c-25.19 0-44.74 15.19-44.74 46.4 0 28.1 16.64 45.78 45 45.78 9.57 0 20.18-2.08 26.43-4.58l4.74 24.73c-5.83 2.92-18.94 6-36 6-48.5.09-73.47-30.1-73.47-70.06zM411 471.65H101v-90.49h310zM390 349h-37l-45-140.27h34.76l17.06 59.32c4.79 16.64 9.16 32.67 12.49 50.15h.62c3.54-16.86 7.91-33.51 12.7-49.53l17.9-59.94h33.72z" />
    </svg>
);

export const IconExcel = (p: Object): React$Element<*> => (
    <svg id="excel" viewBox="0 0 512 512" {...p}>
        <path d="M444 186.82h-11.66V130.5a9.72 9.72 0 00-.1-1.06 9.37 9.37 0 00-2.26-6.17L336.25 16.21s-.06 0-.08-.07a9.61 9.61 0 00-1.9-1.59c-.2-.14-.41-.25-.62-.37a10 10 0 00-1.88-.8c-.18 0-.34-.11-.51-.16a9.45 9.45 0 00-2.19-.27H98.73A19.07 19.07 0 0079.67 32v154.82H68a27.25 27.25 0 00-27.25 27.25v141.68A27.26 27.26 0 0068 383h11.67v97a19.07 19.07 0 0019.06 19.06h314.54A19.08 19.08 0 00432.33 480v-97H444a27.25 27.25 0 0027.25-27.25V214.07A27.24 27.24 0 00444 186.82zM98.73 32h220.81v97.53a9.53 9.53 0 009.53 9.53h84.2v47.75H98.73zm278.18 237.54v16.64h-34.28v22h37.21v16.64h-59V237.6h59v16.64h-37.21v15.3zm-116.48 25.51a24.81 24.81 0 005.68 8.94 20.53 20.53 0 007.59 4.74 25 25 0 008.35 1.47 23.8 23.8 0 008.26-1.44 32.45 32.45 0 006.62-3.19 44.68 44.68 0 005.16-3.69q2.22-1.87 3.86-3.34h2v20.51l-5.57 2.55a53.42 53.42 0 01-6.5 2.43 70.83 70.83 0 01-7.68 1.87 58.22 58.22 0 01-9.84.65q-19.64 0-31.18-11.87t-11.54-33.37q0-20.74 11.57-33.07t31.21-12.34a67.71 67.71 0 019.37.59 63.11 63.11 0 018 1.64 56.62 56.62 0 016.5 2.4c2.35 1 4.24 1.9 5.69 2.64V264h-2.23q-1.58-1.41-4-3.37a50.91 50.91 0 00-5.45-3.84 36.45 36.45 0 00-6.71-3.19 22.38 22.38 0 00-7.65-1.32 24.6 24.6 0 00-8.7 1.49 20.86 20.86 0 00-7.53 5.19 24.83 24.83 0 00-5.36 9 39 39 0 00-2.08 13.42 37.59 37.59 0 002.16 13.67zM150 237.6h25.37l15.7 26.31 16.12-26.31h24.31L204.12 280l28.3 44.83H207L190.23 297l-17.11 27.83h-24.26l28.31-44zm-65.24 87.25V237.6h59v16.64h-37.2v15.3h34.28v16.64h-34.28v22h37.21v16.64zm14 150V383h314.51v91.83zm354.18-150h-58.27V237.6h21.91v70.61h36.33z" />
    </svg>
);

export const IconPdf = (p: Object): React$Element<*> => (
    <svg id="pdf" viewBox="0 0 512 512" {...p}>
        <g id="pdf">
            <path
                className="cls-1"
                d="M436.72 116.11L334.66 14a10.24 10.24 0 00-7.22-3H113.11a40.87 40.87 0 00-40.82 40.88v408.24A40.87 40.87 0 00113.12 501h285.77a40.87 40.87 0 0040.82-40.83V123.32a10.2 10.2 0 00-2.99-7.21zM337.65 45.9l67.21 67.22h-46.8a20.44 20.44 0 01-20.41-20.42zm81.65 414.22a20.44 20.44 0 01-20.41 20.41H113.12a20.44 20.44 0 01-20.42-20.41V51.88a20.44 20.44 0 0120.42-20.41h204.12V92.7a40.87 40.87 0 0040.82 40.83h61.24z"
            />
            <path
                className="cls-1"
                d="M308 310.67a296.49 296.49 0 01-24.41-21.06c-7.78-7.78-14.7-15.31-20.72-22.49 9.39-29 13.5-44 13.5-51.94 0-33.88-12.24-40.83-30.62-40.83-14 0-30.61 7.26-30.61 41.8 0 15.23 8.34 33.72 24.87 55.21-4 12.35-8.8 26.59-14.14 42.65-2.57 7.7-5.36 14.84-8.31 21.44-2.4 1.06-4.74 2.15-7 3.27-8.11 4.06-15.82 7.71-23 11.1-32.59 15.43-54.12 25.63-54.12 45.79 0 14.63 15.89 23.69 30.62 23.69 19 0 47.63-25.35 68.56-68.05 21.72-8.57 48.74-14.92 70-18.89 17.09 13.13 36 25.7 45.09 25.7 25.31 0 30.62-14.63 30.62-26.9C378.47 307 350.9 307 337.65 307c-4.12 0-15.16 1.25-29.65 3.67zm-143.85 88.21c-5.84 0-9.78-2.75-10.21-3.27 0-7.24 21.58-17.47 42.45-27.35l4-1.91c-15.29 22.23-30.45 32.53-36.24 32.53zm71.44-182.73c0-21.39 6.64-21.39 10.2-21.39 7.22 0 10.21 0 10.21 20.42 0 4.3-2.87 15.07-8.12 31.87-8.02-12.34-12.29-22.91-12.29-30.9zm7.82 109.7q1-2.67 1.86-5.38c3.78-11.37 7.19-21.57 10.23-30.76q6.36 7 13.7 14.33c1.91 1.91 6.65 6.22 13 11.61-12.61 2.74-25.99 6.14-38.79 10.2zm114.65 5.31c0 4.59 0 6.49-9.47 6.55-2.78-.6-9.21-4.39-17.14-9.79 2.88-.32 5-.48 6.2-.48 15.08 0 19.35 1.48 20.41 3.72z"
            />
        </g>
    </svg>
);

export const IconNav = (p: Object): React$Element<*> => (
    <svg id="drag-ver" viewBox="0 0 512 512" {...p}>
        <g id="drag-ver">
            <circle className="cls-1" cx="165.89" cy="75.56" r="45.44" />
            <circle className="cls-1" cx="346.11" cy="75.56" r="45.44" />
            <circle className="cls-1" cx="346.11" cy="256.51" r="45.44" />
            <circle className="cls-1" cx="166.93" cy="256.51" r="45.44" />
            <circle className="cls-1" cx="166.54" cy="436.44" r="45.44" />
            <circle className="cls-1" cx="345.58" cy="436.28" r="45.44" />
        </g>
    </svg>
);

export const SortCopy = (p: Object): React$Element<*> => (
    <svg id="copy" viewBox="0 0 512 512" {...p}>
        <path d="M360.4 17.4H181.5c-31.6 0-59.6 28.9-59.6 59.6l-17.2.4c-31.5 0-57.3 28.5-57.3 59.2v298.2c0 30.7 28.1 59.6 59.6 59.6h223.7c31.6 0 59.6-28.9 59.6-59.6h14.9c31.6 0 59.6-28.9 59.6-59.6V137.1L360.4 17.4zm-29.8 447.4H106.9c-15.7 0-29.8-14.6-29.8-29.8V136.7c0-15.2 12.7-29.3 28.4-29.3l16.3-.5v268.4c0 30.7 28.1 59.6 59.6 59.6h178.9c.1 15.2-14.1 29.9-29.7 29.9zm104.3-89.5c0 15.2-14.2 29.8-29.8 29.8H181.4c-15.7 0-29.8-14.6-29.8-29.8V77.1c0-15.2 14.2-29.8 29.8-29.8h149.1c-.2 34.3 0 60 0 60 0 31 27.9 59.3 59.6 59.3h44.7v208.7zm-44.7-238.6c-15.9 0-29.8-28.9-29.8-44.3V47.7l74.6 89h-44.8zm-29.8 89.7H226.2c-8.2 0-14.9 6.7-14.9 14.9s6.7 14.9 14.9 14.9h134.2c8.2 0 14.9-6.7 14.9-14.9s-6.7-14.9-14.9-14.9zm0 74.5H226.2c-8.2 0-14.9 6.7-14.9 14.9s6.7 14.9 14.9 14.9h134.2c8.2 0 14.9-6.7 14.9-14.9s-6.7-14.9-14.9-14.9z" />
    </svg>
);

export const SortDelete = (p: Object): React$Element<*> => (
    <svg id="trash" viewBox="-40 0 11.2 11.2" {...p}>
        <g>
            <path d="M-32.73 4.088a.26.26 0 00-.26.259v4.9a.26.26 0 00.52 0v-4.9a.26.26 0 00-.26-.26zm0 0M-35.79 4.088a.26.26 0 00-.259.259v4.9a.26.26 0 00.519 0v-4.9a.26.26 0 00-.26-.26zm0 0" />
            <path d="M-38.02 3.373V9.76c0 .377.14.732.381.986.24.256.576.4.926.4h4.906c.35 0 .686-.144.927-.4a1.43 1.43 0 00.38-.986V3.373a.99.99 0 00-.254-1.948h-1.328V1.1A1.018 1.018 0 00-33.109.077h-2.302A1.019 1.019 0 00-36.438 1.1v.324h-1.327a.99.99 0 00-.254 1.948zm6.213 7.256h-4.906c-.443 0-.788-.38-.788-.868V3.395h6.482v6.366c0 .488-.345.868-.788.868zm-4.112-9.528a.5.5 0 01.508-.506h2.302a.5.5 0 01.509.506v.324h-3.32zm-1.846.842h7.01a.467.467 0 110 .934h-7.01a.467.467 0 110-.934zm0 0" />
            <path d="M-34.26 4.088a.26.26 0 00-.259.259v4.9a.26.26 0 00.519 0v-4.9a.26.26 0 00-.26-.26zm0 0" />
        </g>
    </svg>
);

export const IconColumns = (p: Object): React$Element<*> => (
    <svg id="column-chooser" viewBox="0 0 512 512" {...p}>
        <path d="M432.39 19.72H82.53A58.37 58.37 0 0024.22 78v349.89a58.37 58.37 0 0058.31 58.31h349.86a58.37 58.37 0 0058.31-58.31V78a58.38 58.38 0 00-58.31-58.28zM315.77 58.6v388.73H199.15V58.6zM63.09 427.89V78a19.45 19.45 0 0119.44-19.4h77.75v388.73H82.53a19.46 19.46 0 01-19.44-19.44zm388.73 0a19.45 19.45 0 01-19.43 19.44h-77.75V58.6h77.75A19.44 19.44 0 01451.82 78z" />
    </svg>
);

export const IconShare = (p: Object): React$Element<*> => (
    <svg id="share" viewBox="0 0 512 512" {...p}>
        <g id="share">
            <path
                className="cls-1"
                d="M453.63 101.75A62.67 62.67 0 11391 39.09a62.67 62.67 0 0162.63 62.66z"
            />
            <path
                className="cls-1"
                d="M391 178.88a77.13 77.13 0 1177.12-77.13A77.2 77.2 0 01391 178.88zm0-125.33a48.21 48.21 0 1048.2 48.2 48.27 48.27 0 00-48.2-48.2zM453.63 410.25A62.67 62.67 0 11391 347.58a62.67 62.67 0 0162.63 62.67z"
            />
            <path
                className="cls-1"
                d="M391 487.37a77.13 77.13 0 1177.12-77.12A77.2 77.2 0 01391 487.37zM391 362a48.21 48.21 0 1048.2 48.21A48.27 48.27 0 00391 362zM183.7 256a62.67 62.67 0 11-62.7-62.66A62.66 62.66 0 01183.7 256z"
            />
            <path
                className="cls-1"
                d="M121 333.12A77.12 77.12 0 11198.16 256 77.2 77.2 0 01121 333.12zm0-125.32a48.2 48.2 0 1048.24 48.2A48.26 48.26 0 00121 207.8z"
            />
            <path
                className="cls-1"
                d="M166.56 246.75a19.28 19.28 0 01-9.56-36l178.9-102a19.28 19.28 0 1119.1 33.48l-178.91 102a19.21 19.21 0 01-9.53 2.52zM345.44 405.81a19.11 19.11 0 01-9.52-2.53L157 301.29a19.28 19.28 0 1119.09-33.51L355 369.77a19.28 19.28 0 01-9.57 36z"
            />
        </g>
    </svg>
);

export const IconGroupSort = (p: Object): React$Element<*> => (
    <svg id="latest" viewBox="0 0 16 16" {...p}>
        <g transform="translate(.67 -860.218) scale(.83207)" fillOpacity=".984">
            <rect
                ry="0"
                rx="0"
                y="1038.024"
                x="6.908"
                height="2.13"
                width="10.151"
                strokeWidth="0"
                strokeLinecap="round"
                strokeOpacity=".072"
            />
            <rect
                ry="0"
                rx="0"
                y="1042.205"
                x="6.885"
                height="2.13"
                width="7.98"
                strokeWidth="0"
                strokeLinecap="round"
                strokeOpacity=".072"
            />
            <rect
                ry="0"
                rx="0"
                y="1046.651"
                x="6.912"
                height="2.13"
                width="5.513"
                strokeWidth="0"
                strokeLinecap="round"
                strokeOpacity=".072"
            />
            <rect
                ry="0"
                y="1037.303"
                x="2.127"
                height="12.622"
                width="1.877"
                strokeWidth="0"
                strokeLinecap="round"
                strokeOpacity=".072"
            />
            <path
                d="M.56 1038.082h5.017l-2.43-3.474zM.564 1048.804H5.58l-2.43 3.474z"
                fillRule="evenodd"
            />
        </g>
    </svg>
);

export const IconSearch = (p: Object): React$Element<*> => (
    <svg id="search" viewBox="0 0 18 18" {...p}>
        <path
            d="M11.894 2.228a6.978 6.978 0 00-9.856 0 6.98 6.98 0 000 9.856c2.42 2.42 6.188 2.679 8.903.79.058.27.188.528.399.738l3.956 3.957a1.471 1.471 0 102.083-2.082l-3.957-3.958a1.472 1.472 0 00-.738-.397c1.89-2.716 1.63-6.484-.79-8.904zm-1.249 8.607a5.209 5.209 0 01-7.357 0 5.21 5.21 0 010-7.357 5.21 5.21 0 017.357 0 5.209 5.209 0 010 7.357z"
            fillOpacity=".562"
        />
    </svg>
);

export const IconPlus = (p: Object): React$Element<*> => (
    <svg id="plus" viewBox="0 0 512 512" {...p}>
        <path d="M438.9 216H296V73.1c0-22.1-17.9-40-40-40s-40 17.9-40 40V216H73.1c-22.1 0-40 17.9-40 40s17.9 40 40 40H216v142.9c0 22.1 17.9 40 40 40s40-17.9 40-40V296h142.9c22.1 0 40-17.9 40-40s-17.9-40-40-40z" />
    </svg>
);
export const RowDelete = (p: Object): React$Element<*> => (
    <svg id="trash" viewBox="-40 0 11.2 11.2" {...p}>
        <g>
            <path d="M-32.73 4.088a.26.26 0 00-.26.259v4.9a.26.26 0 00.52 0v-4.9a.26.26 0 00-.26-.26zm0 0M-35.79 4.088a.26.26 0 00-.259.259v4.9a.26.26 0 00.519 0v-4.9a.26.26 0 00-.26-.26zm0 0" />
            <path d="M-38.02 3.373V9.76c0 .377.14.732.381.986.24.256.576.4.926.4h4.906c.35 0 .686-.144.927-.4a1.43 1.43 0 00.38-.986V3.373a.99.99 0 00-.254-1.948h-1.328V1.1A1.018 1.018 0 00-33.109.077h-2.302A1.019 1.019 0 00-36.438 1.1v.324h-1.327a.99.99 0 00-.254 1.948zm6.213 7.256h-4.906c-.443 0-.788-.38-.788-.868V3.395h6.482v6.366c0 .488-.345.868-.788.868zm-4.112-9.528a.5.5 0 01.508-.506h2.302a.5.5 0 01.509.506v.324h-3.32zm-1.846.842h7.01a.467.467 0 110 .934h-7.01a.467.467 0 110-.934zm0 0" />
            <path d="M-34.26 4.088a.26.26 0 00-.259.259v4.9a.26.26 0 00.519 0v-4.9a.26.26 0 00-.26-.26zm0 0" />
        </g>
    </svg>
);
