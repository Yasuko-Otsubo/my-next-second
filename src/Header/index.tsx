//import React from "react";
import { Link } from "react-router-dom";
import styles from './styles.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.h_ul}>
          <li>
            <Link className={styles.h_link} to="/">Blog</Link>
          </li>
          <li>
            <Link className={styles.h_link} to="/form_page">お問い合わせ</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
