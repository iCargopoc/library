/* eslint-disable flowtype/no-weak-types */
// @flow
import React from "react";

const Svg = (p: Object): React$Element<*> => (
    <svg width="12" height="13" {...p} />
);

export const IconColumns = (): React$Element<*> => (
    <Svg width="12px" height="13px">
        <path
            d="M.992 11.836c.045.054.1.08.162.08h4.384v-9.75H.923v9.48c0 .073.023.137.069.19zm10.016 0a.284.284 0 00.069-.19v-9.48H6.462v9.75h4.384a.207.207 0 00.162-.08zM11.661.398c.226.265.339.584.339.956v10.292c0 .372-.113.691-.339.956-.226.265-.498.398-.815.398H1.154c-.317 0-.59-.133-.815-.398A1.426 1.426 0 010 11.646V1.354C0 .982.113.663.339.398.565.133.837 0 1.154 0h9.692c.317 0 .59.133.815.398z"
            fill="#3c476f"
            fillOpacity="0.8"
        />
    </Svg>
);

export const IconAngle = (p: Object): React$Element<*> => (
    <Svg width="12px" height="7px" {...p}>
        <path
            d="M11.88.722a.38.38 0 010 .553L6.277 6.88a.38.38 0 01-.554 0L.12 1.275a.38.38 0 010-.553L.721.12a.38.38 0 01.554 0L6 4.847 10.725.12a.38.38 0 01.554 0l.6.602z"
            fill="#0e415e"
            fillOpacity="0.4"
        />
    </Svg>
);

export const IconFilter = (): React$Element<*> => (
    <Svg width="11px" height="11px">
        <path
            d="M10.486 0c.218 0 .371.102.46.305.088.213.051.396-.11.547l-3.84 3.851V10.5a.467.467 0 01-.304.46.54.54 0 01-.195.04.462.462 0 01-.35-.148l-1.995-2a.481.481 0 01-.148-.352V4.703L.164.852C.003.7-.034.518.054.305A.466.466 0 01.515 0h9.972z"
            fill="#636c8c"
        />
    </Svg>
);

export const IconShare = (): React$Element<*> => (
    <Svg width="12px" height="12px">
        <path
            d="M7.797 7.672A2.41 2.41 0 019.5 7a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 9.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 12a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 017 9.5c0-.063.005-.151.016-.266L4.203 7.828A2.41 2.41 0 012.5 8.5a2.41 2.41 0 01-1.77-.73A2.41 2.41 0 010 6c0-.693.243-1.283.73-1.77A2.41 2.41 0 012.5 3.5a2.41 2.41 0 011.703.672l2.813-1.406A3.146 3.146 0 017 2.5c0-.693.243-1.283.73-1.77A2.41 2.41 0 019.5 0a2.41 2.41 0 011.77.73A2.41 2.41 0 0112 2.5a2.41 2.41 0 01-.73 1.77A2.41 2.41 0 019.5 5a2.41 2.41 0 01-1.703-.672L4.984 5.734C4.994 5.85 5 5.938 5 6c0 .063-.005.151-.016.266l2.813 1.406z"
            fill="#636c8c"
        />
    </Svg>
);

export const IconGroupSort = (): React$Element<*> => (
    <Svg width="12px" height="12px">
        <path
            d="M8.013 10.346c.041.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V10.5a.207.207 0 01.218-.214h1.744c.064 0 .116.02.157.06zm-3.271-.857c.04.04.061.091.061.154a.25.25 0 01-.068.16L2.561 11.94a.23.23 0 01-.157.06.247.247 0 01-.156-.06L.067 9.797c-.068-.072-.084-.15-.048-.235.036-.089.104-.133.204-.133h1.309V.214A.207.207 0 011.75 0h1.309a.207.207 0 01.218.214V9.43h1.308c.064 0 .116.02.157.06zm4.58-2.572c.04.04.061.092.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V7.071a.207.207 0 01.218-.214h3.053c.064 0 .116.02.157.06zM10.63 3.49c.041.04.061.091.061.154v1.286a.207.207 0 01-.218.214H6.112a.207.207 0 01-.218-.214V3.643a.207.207 0 01.218-.214h4.361c.064 0 .116.02.157.06zM11.94.06c.04.04.061.092.061.154V1.5a.207.207 0 01-.218.214h-5.67a.207.207 0 01-.218-.214V.214A.207.207 0 016.112 0h5.67c.064 0 .116.02.157.06z"
            fill="#3c476f"
            fillOpacity="0.8"
        />
    </Svg>
);

export const IconSort = (p: Object): React$Element<*> => (
    <Svg width="8px" height="5px" {...p}>
        <path d="M0 0l4 5 4-5H0z" fill="#4f6475" />
    </Svg>
);

export const IconPencil = (): React$Element<*> => (
    <Svg width="10px" height="10px">
        <path
            d="M1.69 9.155h.706l.6-.6-1.55-1.552-.601.601v.706h.845v.845zm4.112-6.013a.153.153 0 00.046-.112c0-.097-.048-.146-.145-.146a.153.153 0 00-.112.047L2.013 6.508a.153.153 0 00-.046.112c0 .097.048.146.145.146a.153.153 0 00.112-.047l3.578-3.577zM0 7.254l5.492-5.492 2.746 2.746L2.746 10H0V7.254zm9.756-5.459a.845.845 0 01.244.601.809.809 0 01-.244.594L8.66 4.086 5.914 1.34 7.01.25A.784.784 0 017.604 0a.82.82 0 01.6.25l1.552 1.545z"
            fill="#80a0a2"
        />
    </Svg>
);

export const IconTick = (): React$Element<*> => (
    <Svg width="14px" height="11px">
        <path
            d="M13.747 1.519a.868.868 0 01.253.63.868.868 0 01-.253.629L7.207 9.48l-1.228 1.26a.826.826 0 01-.614.259.826.826 0 01-.614-.26L3.523 9.482.253 6.13A.868.868 0 010 5.5c0-.247.084-.457.253-.63L1.48 3.611a.826.826 0 01.614-.26c.241 0 .446.087.615.26l2.655 2.732L11.29.259A.826.826 0 0111.905 0c.24 0 .445.086.614.26l1.228 1.259z"
            fill="#fff"
            fillOpacity="0.996"
        />
    </Svg>
);

export const IconCancel = (): React$Element<*> => (
    <Svg width="11px" height="11px">
        <path
            d="M10.74 8.222c.174.173.26.383.26.63a.857.857 0 01-.26.63L9.482 10.74a.857.857 0 01-.63.259.857.857 0 01-.629-.26L5.5 8.02 2.778 10.74a.857.857 0 01-.63.259.857.857 0 01-.63-.26L.26 9.482A.857.857 0 010 8.851c0-.246.086-.456.26-.629L2.98 5.5.26 2.778A.857.857 0 010 2.148c0-.247.086-.457.26-.63L1.518.26A.857.857 0 012.149 0c.246 0 .456.086.629.26L5.5 2.98 8.222.26A.857.857 0 018.852 0c.247 0 .457.086.63.26l1.259 1.259c.173.172.259.382.259.63a.857.857 0 01-.26.629L8.02 5.5l2.722 2.722z"
            fill="gray"
            fillOpacity="0.349"
        />
    </Svg>
);

export const IconSearch = (): React$Element<*> => (
    <Svg width="11px" height="11px">
        <path
            d="M6.746 6.746c.58-.58.87-1.277.87-2.092 0-.815-.29-1.513-.87-2.092a2.852 2.852 0 00-2.092-.87c-.815 0-1.513.29-2.092.87-.58.58-.87 1.277-.87 2.092 0 .815.29 1.513.87 2.092.58.58 1.277.87 2.092.87.815 0 1.513-.29 2.092-.87zm4.01 2.813a.81.81 0 01.244.595c0 .229-.084.427-.251.595a.813.813 0 01-.595.251.786.786 0 01-.595-.251L7.29 8.488a4.527 4.527 0 01-2.637.82c-.63 0-1.233-.123-1.808-.367a4.653 4.653 0 01-1.488-.992 4.653 4.653 0 01-.991-1.487A4.573 4.573 0 010 4.654c0-.63.122-1.233.367-1.808.244-.575.575-1.071.991-1.488A4.653 4.653 0 012.846.367 4.573 4.573 0 014.654 0c.63 0 1.233.122 1.808.367.575.244 1.07.575 1.487.991.417.417.747.913.992 1.488.244.575.367 1.178.367 1.808 0 .97-.274 1.849-.82 2.637l2.267 2.268z"
            fill="#3c476f"
            fillOpacity="0.8"
        />
    </Svg>
);

export const IconClose = (): React$Element<*> => (
    <Svg width="14px" height="14px">
        <path
            d="M13.67 10.465c.22.22.33.487.33.801 0 .314-.11.581-.33.801l-1.603 1.603c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L7 10.205 3.535 13.67c-.22.22-.487.33-.801.33-.314 0-.581-.11-.801-.33L.33 12.067c-.22-.22-.33-.487-.33-.801 0-.314.11-.581.33-.801L3.795 7 .33 3.535C.11 3.315 0 3.048 0 2.734c0-.314.11-.581.33-.801L1.933.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33L7 3.795 10.465.33c.22-.22.487-.33.801-.33.314 0 .581.11.801.33l1.603 1.603c.22.22.33.487.33.801 0 .314-.11.581-.33.801L10.205 7l3.465 3.465z"
            fill="#3c476f"
            fillOpacity="0.71"
        />
    </Svg>
);

export const IconJustify = (): React$Element<*> => (
    <Svg width="10px" height="9px">
        <path
            d="M9.876 7.334A.45.45 0 0110 7.65v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 8.55v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 4.05v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 4.95v-.9a.45.45 0 01.124-.316.386.386 0 01.293-.134h9.166c.113 0 .21.045.293.134zm0-3.6A.45.45 0 0110 .45v.9a.45.45 0 01-.124.316.386.386 0 01-.293.134H.417a.386.386 0 01-.293-.134A.45.45 0 010 1.35v-.9A.45.45 0 01.124.134.386.386 0 01.417 0h9.166c.113 0 .21.045.293.134z"
            fill="#1a4769"
            fillOpacity="0.498"
        />
    </Svg>
);

export const IconCsv = (): React$Element<*> => (
    <Svg width="23px" height="27px">
        <path
            d="M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm3.75-11.982v-.964a.47.47 0 01.135-.347c.09-.09.204-.136.344.293h10.542c.14-.429.254-.383.344-.293a.47.47 0 01.135.347v.964a.47.47 0 01-.135.346c-.09.09-.204.136-.344-.364H6.229c-.14.5-.254.455-.344.364a.47.47 0 01-.135-.346zM6.23 15h10.54c.14.429.255.474.345.564a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.222H6.229c-.14.357-.254.312-.344.222a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.564zm0 4h10.54c.14.286.255.33.345.421a.47.47 0 01.135.347v.964a.47.47 0 01-.135.347c-.09.09-.204.135-.344-.079H6.229c-.14.214-.254.17-.344.079a.47.47 0 01-.135-.347v-.964a.47.47 0 01.135-.347c.09-.09.204-.135.344-.421z"
            fill="#1a4869"
        />
    </Svg>
);

export const IconExcel = (): React$Element<*> => (
    <Svg width="23px" height="27px">
        <path
            d="M17.31 1.025l4.672 4.7c.28.282.519.663.719 1.146.2.482.299.924.299 1.325v17.358a1.4 1.4 0 01-.42 1.024c-.279.281-.618.422-1.017.422H1.438c-.4 0-.74-.14-1.019-.422A1.4 1.4 0 010 25.554V1.446C0 1.045.14.703.42.422.698.14 1.037 0 1.437 0h13.416c.4 0 .839.1 1.318.301.479.201.858.442 1.138.724zM15.947 2.38c-.12-.121-.324-.231-.614-.332v5.665h5.63c-.1-.291-.21-.497-.329-.617L15.947 2.38zM2 25h19V9.643h-6.146c-.4 0-.739-.14-1.018-.422a1.4 1.4 0 01-.42-1.025V2H2v23zm5.442-3.454H6.424v1.597h4.208v-1.597H9.508l1.543-2.426c.05-.07.1-.153.15-.249.05-.095.087-.163.112-.203.025-.04.042-.06.052-.06h.03c.01.04.035.09.075.15.02.04.042.078.067.113.025.036.055.076.09.12l.098.129 1.602 2.426h-1.138v1.597h4.357v-1.597h-1.018l-2.875-4.114 2.92-4.248h1.003V11.57h-4.178v1.613h1.109l-1.543 2.395a6.727 6.727 0 01-.284.452l-.03.045h-.03a.52.52 0 00-.075-.15 1.797 1.797 0 00-.255-.347l-1.587-2.395h1.138V11.57H6.5v1.613h1.018l2.83 4.098-2.905 4.264z"
            fill="#3da751"
        />
    </Svg>
);

export const IconPdf = (): React$Element<*> => (
    <Svg width="24px" height="28px">
        <path
            d="M18.063 1.063l4.875 4.875c.291.291.541.687.75 1.187.208.5.312.958.312 1.375v18c0 .417-.146.77-.438 1.063A1.447 1.447 0 0122.5 28h-21c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 010 26.5v-25C0 1.083.146.73.438.437A1.447 1.447 0 011.5 0h14c.417 0 .875.104 1.375.313.5.208.896.458 1.188.75zM16.64 2.468c-.125-.125-.339-.24-.641-.344V8h5.875c-.104-.302-.219-.516-.344-.64l-4.89-4.891zM2 26h20V10h-6.5c-.417 0-.77-.146-1.063-.438A1.447 1.447 0 0114 8.5V2H2v24zm9.688-12.984c.572 1.708 1.333 2.948 2.28 3.718.345.271.782.563 1.313.875.615-.073 1.224-.109 1.828-.109 1.532 0 2.453.255 2.766.766.167.229.177.5.031.812 0 .01-.005.021-.015.031l-.032.032v.015c-.062.396-.432.594-1.109.594-.5 0-1.099-.104-1.797-.313a11.391 11.391 0 01-2.031-.828c-2.302.25-4.344.683-6.125 1.297C7.203 22.636 5.943 24 5.016 24a.909.909 0 01-.438-.11l-.375-.187a1.671 1.671 0 00-.094-.078c-.104-.104-.135-.292-.093-.563.093-.416.385-.893.875-1.43.49-.536 1.177-1.038 2.062-1.507.146-.094.266-.063.36.094.02.02.03.041.03.062a38.204 38.204 0 001.673-3.078c.708-1.417 1.25-2.781 1.625-4.094a12.63 12.63 0 01-.477-2.492c-.068-.807-.034-1.471.102-1.992.114-.417.333-.625.656-.625H11.266c.24 0 .421.078.546.234.188.22.235.573.141 1.063a.34.34 0 01-.062.125c.01.031.015.073.015.125v.469c-.02 1.28-.094 2.28-.219 3zM5.742 22c-.38.458-.638.844-.773 1.156.541-.25 1.255-1.073 2.14-2.468A8.908 8.908 0 005.742 22zm5.446-13.25v.031c-.157.438-.167 1.125-.032 2.063.01-.073.047-.302.11-.688 0-.031.036-.255.109-.672a.352.352 0 01.063-.125c-.01-.01-.016-.02-.016-.03a.12.12 0 01-.016-.048.9.9 0 00-.203-.562c0 .01-.005.02-.015.031zm-1.235 9.063a106.31 106.31 0 01-.703 1.296 22.918 22.918 0 014.438-1.265c-.021-.01-.089-.06-.204-.149a2.793 2.793 0 01-.25-.21c-.791-.699-1.453-1.615-1.984-2.75-.281.895-.714 1.921-1.297 3.078zm9.422 1.093c0-.01-.01-.026-.031-.047-.25-.25-.98-.375-2.188-.375.792.292 1.438.438 1.938.438.146 0 .24-.005.281-.016z"
            fill="#ff4a4a"
        />
    </Svg>
);

export const IconNav = (): React$Element<*> => (
    <Svg width="13px" height="11px">
        <path
            d="M12.84 8.963c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 10.45v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 8.8h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 6.05v-1.1c0-.149.054-.278.16-.387A.517.517 0 01.543 4.4h11.916c.147 0 .274.054.381.163zm0-4.4c.106.11.16.238.16.387v1.1a.533.533 0 01-.16.387.517.517 0 01-.382.163H.542a.517.517 0 01-.381-.163A.533.533 0 010 1.65V.55C0 .401.054.272.16.163A.517.517 0 01.543 0h11.916c.147 0 .274.054.381.163z"
            fillOpacity="0.11"
        />
    </Svg>
);

export const SortCopy = (): React$Element<*> => (
    <Svg width="13px" height="16px">
        <defs>
            <linearGradient
                gradientUnits="userSpaceOnUse"
                x1="442.5"
                y1="6"
                x2="442.5"
                y2="22"
                id="LinearGradient9"
            >
                <stop
                    id="Stop10"
                    stopColor="#246290"
                    stopOpacity="0.6"
                    offset="0"
                />
                <stop id="Stop11" stopColor="#f2f2f2" offset="0" />
                <stop id="Stop12" stopColor="#e4e4e4" offset="1" />
                <stop id="Stop13" stopColor="#ffffff" offset="1" />
            </linearGradient>
        </defs>
        <g transform="matrix(1 0 0 1 -436 -6 )">
            <path
                d="M 439.6 21  L 448 21  L 448 12.2  L 442.8 7  L 437 7  L 437 18.4  L 438.3 18.4  L 438.3 19.7  L 439.6 19.7  L 439.6 21  Z "
                fillRule="nonzero"
                fill="url(#LinearGradient9)"
                stroke="none"
            />
            <path
                d="M 439.1 21.5  L 448.5 21.5  L 448.5 11.7  L 443.3 6.5  L 436.5 6.5  L 436.5 18.9  L 437.8 18.9  L 437.8 20.2  L 439.1 20.2  L 439.1 21.5  Z "
                strokeWidth="1"
                stroke="#1a4769"
                fill="none"
                stopOpacity="0.6"
            />
            <path
                d="M 445.9 10.4  L 447.2 10.9  L 447.2 20.2  L 439.6 20.2  M 443.3 7  L 443.3 9.1  L 445.9 9.1  L 445.9 18.9  L 438.3 18.9  M 448 11.7  L 447.2 11.7  "
                strokeWidth="1"
                stroke="#1a4769"
                fill="none"
                stopOpacity="0.6"
            />
        </g>
    </Svg>
);

export const SortDelete = (): React$Element<*> => (
    <Svg width="15px" height="16px">
        <path
            d="M5.359 6.094a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 014.432 6h.682c.1 0 .18.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 017.16 6h.682c.1 0 .181.031.245.094zm2.727 0a.32.32 0 01.096.24v6a.32.32 0 01-.096.239.336.336 0 01-.245.094h-.682a.336.336 0 01-.245-.094.32.32 0 01-.096-.24v-6a.32.32 0 01.096-.24A.336.336 0 019.886 6h.682c.1 0 .181.031.245.094zm1.385 8.203c.05-.129.075-.27.075-.422V4H2.727v9.875a1.16 1.16 0 00.23.703c.053.06.09.089.111.089h8.864c.021 0 .058-.03.112-.089a.928.928 0 00.154-.281zM5.636 1.447l-.522 1.22h4.772l-.511-1.22a.301.301 0 00-.181-.114H5.817a.301.301 0 00-.181.115zm9.268 1.313A.32.32 0 0115 3v.667a.32.32 0 01-.096.24.336.336 0 01-.245.093h-1.023v9.875c0 .576-.167 1.075-.5 1.495-.334.42-.735.63-1.204.63H3.068c-.469 0-.87-.203-1.204-.61-.333-.406-.5-.897-.5-1.473V4H.34a.336.336 0 01-.245-.094.32.32 0 01-.096-.24V3a.32.32 0 01.096-.24.336.336 0 01.245-.093h3.292l.746-1.74c.106-.257.298-.476.575-.656C5.23.09 5.51 0 5.795 0h3.41c.284 0 .564.09.841.27.277.181.469.4.575.657l.746 1.74h3.292c.1 0 .181.03.245.093z"
            fill="#1a4769"
            fillOpacity="0.6"
        />
    </Svg>
);
export const IconRefresh = (): React$Element<*> => (
    <Svg width="12px" height="12px">
        <g transform="matrix(1 0 0 1 -791 -292 )">
            <path
                d="M 11.73046875 7.07421875  C 11.7799479166666 7.12369791666664  11.8046875000001 7.18229166666668  11.8046875000001 7.24999999999998  C 11.8046875000001 7.27604166666664  11.8020833333333 7.29427083333331  11.7968749999999 7.30468749999998  C 11.4635416666666 8.70052083333333  10.7656249999999 9.83203125000001  9.703125 10.69921875  C 8.64062500000006 11.56640625  7.39583333333329 12  5.96875000000006 12  C 5.20833333333336 12  4.47265624999994 11.8567708333333  3.76171875 11.5703125  C 3.05078125000006 11.2838541666667  2.41666666666658 10.875  1.85937499999993 10.34375  L 0.851562499999935 11.3515625  C 0.75260416666658 11.4505208333333  0.63541666666658 11.5  0.499999999999935 11.5  C 0.36458333333329 11.5  0.24739583333329 11.4505208333333  0.148437499999935 11.3515625  C 0.04947916666658 11.2526041666667  0 11.1354166666667  0 11  L 0 7.49999999999999  C 0 7.36458333333334  0.04947916666658 7.24739583333335  0.148437499999935 7.14843749999998  C 0.24739583333329 7.04947916666666  0.36458333333329 6.99999999999998  0.499999999999935 6.99999999999998  L 4.00000000000006 6.99999999999998  C 4.13541666666671 6.99999999999998  4.25260416666671 7.04947916666666  4.35156250000006 7.14843749999998  C 4.45052083333342 7.24739583333335  4.5 7.36458333333334  4.5 7.49999999999999  C 4.5 7.63541666666664  4.45052083333342 7.75260416666668  4.35156250000006 7.85156249999999  L 3.28125 8.921875  C 3.65104166666665 9.26562500000002  4.07031250000006 9.53125000000001  4.53906250000006 9.71874999999998  C 5.00781250000006 9.90624999999999  5.49479166666671 10  6 10  C 6.69791666666664 10  7.34895833333329 9.83072916666665  7.95312499999994 9.49218749999999  C 8.55729166666658 9.15364583333334  9.04166666666664 8.68749999999998  9.40624999999994 8.09375000000001  C 9.46354166666664 8.00520833333331  9.60156250000006 7.70052083333331  9.8203125 7.1796875  C 9.86197916666664 7.05989583333333  9.94010416666658 6.99999999999998  10.0546875 6.99999999999998  L 11.5546875 6.99999999999998  C 11.6223958333334 6.99999999999998  11.6809895833334 7.02473958333332  11.73046875 7.07421875  Z M 11.8515625000001 0.648437500000017  C 11.9505208333334 0.747395833333338  12 0.864583333333324  12 0.999999999999976  L 12 4.50000000000001  C 12 4.63541666666666  11.9505208333334 4.75260416666665  11.8515625000001 4.85156250000002  C 11.7526041666667 4.95052083333334  11.6354166666667 4.99999999999998  11.5000000000001 4.99999999999998  L 7.99999999999994 4.99999999999998  C 7.86458333333329 4.99999999999998  7.74739583333329 4.95052083333334  7.64843749999994 4.85156250000002  C 7.54947916666658 4.75260416666665  7.5 4.63541666666666  7.5 4.50000000000001  C 7.5 4.36458333333331  7.54947916666658 4.24739583333333  7.64843749999994 4.14843750000001  L 8.72656249999994 3.07031250000001  C 7.95572916666671 2.35677083333332  7.04687500000006 2  6 2  C 5.30208333333336 2  4.65104166666671 2.16927083333335  4.04687500000006 2.5078125  C 3.44270833333342 2.84635416666666  2.95833333333336 3.31250000000002  2.59375000000006 3.90624999999999  C 2.53645833333336 3.99479166666664  2.39843749999994 4.29947916666664  2.1796875 4.8203125  C 2.13802083333336 4.94010416666667  2.05989583333342 4.99999999999998  1.9453125 4.99999999999998  L 0.390625000000065 4.99999999999998  C 0.322916666666645 4.99999999999998  0.264322916666645 4.97526041666668  0.214843750000065 4.92578125  C 0.16536458333329 4.87630208333331  0.140625 4.81770833333332  0.140625 4.75000000000002  L 0.140625 4.69531250000002  C 0.47916666666671 3.29947916666667  1.18229166666671 2.16796874999999  2.25 1.30078124999998  C 3.31770833333329 0.433593749999978  4.56770833333342 0  6 0  C 6.76041666666671 0  7.5 0.144531250000009  8.21875000000006 0.433593749999978  C 8.93749999999994 0.722656249999996  9.57552083333329 1.13020833333332  10.1328124999999 1.65624999999999  L 11.1484375000001 0.648437500000017  C 11.2473958333334 0.549479166666648  11.3645833333334 0.500000000000012  11.5000000000001 0.500000000000012  C 11.6354166666667 0.500000000000012  11.7526041666667 0.549479166666648  11.8515625000001 0.648437500000017  Z "
                fill="#3c476f"
                fillOpacity="0.8"
                transform="matrix(1 0 0 1 791 292 )"
            />
        </g>
    </Svg>
);
