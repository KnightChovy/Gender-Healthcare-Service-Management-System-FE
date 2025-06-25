import React from "react";
import styles from "../MenstrualCycle.module.scss"; // Import the SCSS file for styling
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx("header")}>
            <h1>Theo dõi chu kì</h1>
            <p>Quản lý và theo dõi chu kì kinh nguyệt của bạn</p>
        </header>
    );
}

export default Header;
