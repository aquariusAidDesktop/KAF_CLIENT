import React from "react";
import styles from "./PreviewStart.module.css";

const PreviewStart: React.FC = () => {
  // Массив с символами, где для букв с особым цветом устанавливается флаг colored
  const letters = [
    { char: "М", colored: false },
    { char: "А", colored: false },
    { char: "Ф", colored: true },
    { char: ".", colored: true },
  ];

  return (
    <div className={styles.startContainer}>
      <div className={styles.headerContainer}>
        <h1 className={styles.h1Item}>
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`${styles.letter} ${
                letter.colored ? styles.coloredPart : ""
              }`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              {letter.char}
            </span>
          ))}
        </h1>
        <div className={styles.descriptionContainer}>
          <p className={styles.descriptionItem}>
            Простые решения для сложных задач
          </p>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        <div className={styles.buttonChatContainer}>
          <button className={styles.buttonChat}>Перейти в чат</button>
        </div>
        <div className={styles.buttonMoreContainer}>
          <button className={styles.buttonMore}>Узнать подробнее</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStart;
