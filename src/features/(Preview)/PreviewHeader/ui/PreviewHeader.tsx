import Image from "next/image";
import styles from "./PreviewHeader.module.css";

const PreviewHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className={styles.headerContainer}>
        <div className={styles.logoContainer}>
          <Image
            width={1200}
            height={1000}
            alt="logo"
            src="/logo-2fac.png"
            className={styles.logo}
          />
          <div className={styles.sloganContainer}>
            <p className={styles.sloganItem}>Поколения . Технологии.</p>
            <p className={styles.sloganItem}>Окружение. Хайп.</p>
          </div>
        </div>
        <ul className={styles.ulContainer}>
          <li className={styles.liContainer}>
            <p className={styles.itemLink}>Преимущества</p>
          </li>
          <li className={styles.liContainer}>
            <p className={styles.itemLink}>Консепт</p>
          </li>
          <li className={styles.liContainer}>
            <p className={styles.itemLink}>Команда</p>
          </li>
          <li className={styles.liContainer}>
            <p className={styles.itemLink}>Чат</p>
          </li>
        </ul>
        <div className={styles.languageContainer}>
          <button className={styles.languageButton}>RU</button>
        </div>
      </div>
      {children}
    </>
  );
};

export default PreviewHeader;
