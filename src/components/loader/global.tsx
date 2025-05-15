import React from "react";
import styles from "./styles/preloader.module.css";

export default function Loading() {
  return (
    <div className={styles.preloader}>
      <div className={styles.preloader_content}>
        <div className={styles.logo}>
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 12L11 15L16 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className={styles.loader}>
          <div className={styles.loader_bar}></div>
        </div>
        <div className={styles.loader_text}>Loading OpenSourceCodes</div>
      </div>
    </div>
  );
}