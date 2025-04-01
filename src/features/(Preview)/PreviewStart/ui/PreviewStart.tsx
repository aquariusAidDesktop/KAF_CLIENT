import React from "react";
import styles from "./PreviewStart.module.css";
import Link from "next/link";

const PreviewStart: React.FC = () => {
  return (
    <div className={styles.startContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.typedText}>МАФ.</h1>
        <div className={styles.descriptionContainer}>
          <p className={styles.descriptionItem}>
            Простые решения для сложных задач
          </p>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        <div className={styles.buttonChatContainer}>
          <Link href={"/search"} className={styles.buttonChat}>
            Перейти в чат
          </Link>
        </div>
        <div className={styles.buttonMoreContainer}>
          <Link href={"/"} className={styles.buttonMore}>
            Узнать подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PreviewStart;
