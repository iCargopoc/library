/* eslint-disable flowtype/no-weak-types */
// @flow
import React from "react";

const Svg = (p: Object): React$Element<*> => (
    <svg width="12" height="13" {...p} />
);
const SvgEdit = (p: Object): React$Element<*> => (
    <svg width="12" height="13" viewBox="0 0 1792 1792" {...p} />
);

export const IconTimes = (): React$Element<*> => (
    <Svg width="14px" height="14px" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1 0 0 1 -961 -29 )">
            <path
                d="M 13.6700336700337 10.4646464646465  C 13.8900112233446 10.6846240179573  14 10.9517396184063  14 11.2659932659933  C 14 11.5802469135802  13.8900112233446 11.8473625140292  13.6700336700337 12.0673400673401  L 12.0673400673401 13.6700336700337  C 11.8473625140292 13.8900112233446  11.5802469135802 14  11.2659932659933 14  C 10.9517396184063 14  10.6846240179574 13.8900112233446  10.4646464646465 13.6700336700337  L 7 10.2053872053872  L 3.53535353535354 13.6700336700337  C 3.31537598204265 13.8900112233446  3.04826038159371 14  2.73400673400673 14  C 2.41975308641975 14  2.15263748597082 13.8900112233446  1.93265993265993 13.6700336700337  L 0.32996632996633 12.0673400673401  C 0.109988776655443 11.8473625140292  0 11.5802469135802  0 11.2659932659933  C 0 10.9517396184063  0.109988776655443 10.6846240179573  0.32996632996633 10.4646464646465  L 3.79461279461279 7  L 0.32996632996633 3.53535353535353  C 0.109988776655443 3.31537598204265  0 3.04826038159371  0 2.73400673400673  C 0 2.41975308641975  0.109988776655443 2.15263748597082  0.32996632996633 1.93265993265993  L 1.93265993265993 0.32996632996633  C 2.15263748597082 0.109988776655443  2.41975308641975 0  2.73400673400673 0  C 3.04826038159371 0  3.31537598204265 0.109988776655443  3.53535353535354 0.32996632996633  L 7 3.7946127946128  L 10.4646464646465 0.32996632996633  C 10.6846240179574 0.109988776655443  10.9517396184063 0  11.2659932659933 0  C 11.5802469135802 0  11.8473625140292 0.109988776655443  12.0673400673401 0.32996632996633  L 13.6700336700337 1.93265993265993  C 13.8900112233446 2.15263748597082  14 2.41975308641975  14 2.73400673400673  C 14 3.04826038159371  13.8900112233446 3.31537598204265  13.6700336700337 3.53535353535353  L 10.2053872053872 7  L 13.6700336700337 10.4646464646465  Z "
                fillRule="nonzero"
                fill="#3c476f"
                stroke="none"
                fillOpacity="0.709803921568627"
                transform="matrix(1 0 0 1 961 29 )"
            />
        </g>
    </Svg>
);

export const IconCheck = (): React$Element<*> => (
    <Svg
        version="1.1"
        width="12px"
        height="9px"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g transform="matrix(1 0 0 1 -17 -48 )">
            <path
                d="M 11.7832258064516 1.24242424242425  C 11.9277419354839 1.38383838383845  12 1.55555555555554  12 1.75757575757575  C 12 1.95959595959596  11.9277419354839 2.13131313131311  11.7832258064516 2.27272727272725  L 6.17806451612904 7.75757575757575  L 5.12516129032258 8.78787878787875  C 4.98064516129031 8.92929292929296  4.80516129032259 9  4.59870967741935 9  C 4.39225806451614 9  4.21677419354839 8.92929292929296  4.07225806451612 8.78787878787875  L 3.01935483870966 7.75757575757575  L 0.216774193548417 5.0151515151515  C 0.0722580645161486 4.87373737373741  0 4.70202020202021  0 4.5  C 0 4.29797979797979  0.0722580645161486 4.12626262626259  0.216774193548417 3.9848484848485  L 1.26967741935482 2.9545454545455  C 1.41419354838709 2.81313131313135  1.58967741935484 2.74242424242425  1.79612903225805 2.74242424242425  C 2.00258064516129 2.74242424242425  2.17806451612901 2.81313131313135  2.32258064516131 2.9545454545455  L 4.59870967741935 5.18939393939394  L 9.67741935483869 0.212121212121247  C 9.82193548387099 0.0707070707070443  9.99741935483871 0  10.2038709677419 0  C 10.4103225806452 0  10.5858064516129 0.0707070707070443  10.7303225806452 0.212121212121247  L 11.7832258064516 1.24242424242425  Z "
                fillRule="nonzero"
                fill="#15aacc"
                stroke="none"
                transform="matrix(1 0 0 1 17 48 )"
            />
        </g>
    </Svg>
);

export const IconUpArrow = (): React$Element<*> => (
    <Svg
        version="1.1"
        width="10px"
        height="6px"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(180deg)" }}
    >
        <g transform="matrix(1 0 0 1 -191 -14 )">
            <path
                d="M 9.8997995991984 0.618556701030928  C 9.96659986639947 0.687285223367696  10 0.766323024054982  10 0.855670103092784  C 10 0.945017182130584  9.96659986639947 1.02405498281787  9.8997995991984 1.09278350515464  L 5.23046092184369 5.89690721649484  C 5.16366065464262 5.96563573883161  5.08684034736139 6  5 6  C 4.91315965263861 6  4.83633934535738 5.96563573883161  4.76953907815631 5.89690721649484  L 0.100200400801603 1.09278350515464  C 0.0334001336005345 1.02405498281787  0 0.945017182130584  0 0.855670103092784  C 0 0.766323024054982  0.0334001336005345 0.687285223367696  0.100200400801603 0.618556701030928  L 0.601202404809619 0.103092783505155  C 0.668002672010688 0.0343642611683841  0.744822979291917 0  0.831663326653307 0  C 0.918503674014696 0  0.995323981295925 0.0343642611683841  1.06212424849699 0.103092783505155  L 5 4.15463917525773  L 8.93787575150301 0.103092783505155  C 9.00467601870407 0.0343642611683841  9.0814963259853 0  9.16833667334669 0  C 9.25517702070808 0  9.33199732798931 0.0343642611683841  9.39879759519038 0.103092783505155  L 9.8997995991984 0.618556701030928  Z "
                fillRule="nonzero"
                fill="#1a4869"
                stroke="none"
                transform="matrix(1 0 0 1 191 14 )"
            />
        </g>
    </Svg>
);

export const IconDownArrow = (): React$Element<*> => (
    <Svg
        version="1.1"
        width="10px"
        height="6px"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(0deg)" }}
    >
        <g transform="matrix(1 0 0 1 -191 -14 )">
            <path
                d="M 9.8997995991984 0.618556701030928  C 9.96659986639947 0.687285223367696  10 0.766323024054982  10 0.855670103092784  C 10 0.945017182130584  9.96659986639947 1.02405498281787  9.8997995991984 1.09278350515464  L 5.23046092184369 5.89690721649484  C 5.16366065464262 5.96563573883161  5.08684034736139 6  5 6  C 4.91315965263861 6  4.83633934535738 5.96563573883161  4.76953907815631 5.89690721649484  L 0.100200400801603 1.09278350515464  C 0.0334001336005345 1.02405498281787  0 0.945017182130584  0 0.855670103092784  C 0 0.766323024054982  0.0334001336005345 0.687285223367696  0.100200400801603 0.618556701030928  L 0.601202404809619 0.103092783505155  C 0.668002672010688 0.0343642611683841  0.744822979291917 0  0.831663326653307 0  C 0.918503674014696 0  0.995323981295925 0.0343642611683841  1.06212424849699 0.103092783505155  L 5 4.15463917525773  L 8.93787575150301 0.103092783505155  C 9.00467601870407 0.0343642611683841  9.0814963259853 0  9.16833667334669 0  C 9.25517702070808 0  9.33199732798931 0.0343642611683841  9.39879759519038 0.103092783505155  L 9.8997995991984 0.618556701030928  Z "
                fillRule="nonzero"
                fill="#1a4869"
                stroke="none"
                transform="matrix(1 0 0 1 191 14 )"
            />
        </g>
    </Svg>
);

export const SaveLogo = (): React$Element<*> => (
    <Svg width="16px" height="16px" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1 0 0 1 -235 -468 )">
            <path
                d="M 4 10.6666666666667  L 4 14.6666666666667  L 12 14.6666666666667  L 12 10.6666666666667  L 4 10.6666666666667  Z M 13.3333333333333 10.3333333333333  L 13.3333333333333 14.6666666666667  L 14.6666666666667 14.6666666666667  L 14.6666666666667 5.33333333333333  C 14.6666666666667 5.23611111111111  14.6319444444444 5.10243055555556  14.5625 4.93229166666667  C 14.4930555555556 4.76215277777778  14.4236111111111 4.64236111111111  14.3541666666667 4.57291666666667  L 11.4270833333333 1.64583333333333  C 11.3576388888889 1.57638888888889  11.2395833333333 1.50694444444444  11.0729166666667 1.4375  C 10.90625 1.36805555555556  10.7708333333333 1.33333333333333  10.6666666666667 1.33333333333333  L 10.6666666666667 5.66666666666667  C 10.6666666666667 5.94444444444444  10.5694444444444 6.18055555555556  10.375 6.375  C 10.1805555555556 6.56944444444444  9.94444444444444 6.66666666666667  9.66666666666667 6.66666666666667  L 3.66666666666667 6.66666666666667  C 3.38888888888889 6.66666666666667  3.15277777777778 6.56944444444444  2.95833333333333 6.375  C 2.76388888888889 6.18055555555556  2.66666666666667 5.94444444444444  2.66666666666667 5.66666666666667  L 2.66666666666667 1.33333333333333  L 1.33333333333333 1.33333333333333  L 1.33333333333333 14.6666666666667  L 2.66666666666667 14.6666666666667  L 2.66666666666667 10.3333333333333  C 2.66666666666667 10.0555555555556  2.76388888888889 9.81944444444444  2.95833333333333 9.625  C 3.15277777777778 9.43055555555555  3.38888888888889 9.33333333333333  3.66666666666667 9.33333333333333  L 12.3333333333333 9.33333333333333  C 12.6111111111111 9.33333333333333  12.8472222222222 9.43055555555555  13.0416666666667 9.625  C 13.2361111111111 9.81944444444444  13.3333333333333 10.0555555555556  13.3333333333333 10.3333333333333  Z M 9.234375 5.234375  C 9.30034722222222 5.16840277777778  9.33333333333333 5.09027777777778  9.33333333333333 5  L 9.33333333333333 1.66666666666667  C 9.33333333333333 1.57638888888889  9.30034722222222 1.49826388888889  9.234375 1.43229166666667  C 9.16840277777778 1.36631944444444  9.09027777777778 1.33333333333333  9 1.33333333333333  L 7 1.33333333333333  C 6.90972222222222 1.33333333333333  6.83159722222222 1.36631944444444  6.765625 1.43229166666667  C 6.69965277777778 1.49826388888889  6.66666666666667 1.57638888888889  6.66666666666667 1.66666666666667  L 6.66666666666667 5  C 6.66666666666667 5.09027777777778  6.69965277777778 5.16840277777778  6.765625 5.234375  C 6.83159722222222 5.30034722222222  6.90972222222222 5.33333333333333  7 5.33333333333333  L 9 5.33333333333333  C 9.09027777777778 5.33333333333333  9.16840277777778 5.30034722222222  9.234375 5.234375  Z M 15.7916666666667 4.41666666666667  C 15.9305555555556 4.75  16 5.05555555555556  16 5.33333333333333  L 16 15  C 16 15.2777777777778  15.9027777777778 15.5138888888889  15.7083333333333 15.7083333333333  C 15.5138888888889 15.9027777777778  15.2777777777778 16  15 16  L 1 16  C 0.722222222222222 16  0.486111111111111 15.9027777777778  0.291666666666667 15.7083333333333  C 0.0972222222222222 15.5138888888889  0 15.2777777777778  0 15  L 0 1  C 0 0.722222222222221  0.0972222222222222 0.486111111111109  0.291666666666667 0.291666666666666  C 0.486111111111111 0.0972222222222214  0.722222222222222 0  1 0  L 10.6666666666667 0  C 10.9444444444444 0  11.25 0.0694444444444429  11.5833333333333 0.208333333333334  C 11.9166666666667 0.347222222222221  12.1805555555556 0.513888888888888  12.375 0.708333333333334  L 15.2916666666667 3.625  C 15.4861111111111 3.81944444444444  15.6527777777778 4.08333333333333  15.7916666666667 4.41666666666667  Z "
                fillRule="nonzero"
                fill="#1a4869"
                stroke="none"
                fillOpacity="0.749019607843137"
                transform="matrix(1 0 0 1 235 468 )"
            />
        </g>
    </Svg>
);

export const IconLeftAlign = (): React$Element<*> => (
    <SvgEdit
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="align-left"
        className="svg-inline--fa fa-align-left fa-w-14"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
    >
        <path
            fill="currentColor"
            d="M12.83 352h262.34A12.82 12.82 0 0 0 288 339.17v-38.34A12.82 12.82 0 0 0 275.17 288H12.83A12.82 12.82 0 0 0 0 300.83v38.34A12.82 12.82 0 0 0 12.83 352zm0-256h262.34A12.82 12.82 0 0 0 288 83.17V44.83A12.82 12.82 0 0 0 275.17 32H12.83A12.82 12.82 0 0 0 0 44.83v38.34A12.82 12.82 0 0 0 12.83 96zM432 160H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0 256H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"
        />
    </SvgEdit>
);
