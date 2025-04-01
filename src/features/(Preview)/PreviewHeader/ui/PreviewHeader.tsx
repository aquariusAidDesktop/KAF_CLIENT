import Image from "next/image";
import styles from "./PreviewHeader.module.css";
import Link from "next/link";

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
            <p className={styles.sloganItem}>Поколения. Технологии.</p>
            <p className={styles.sloganItem}>Окружение.</p>
          </div>
        </div>
        <ul className={styles.ulContainer}>
          <li className={styles.liContainer}>
            <Link href={"/"} className={styles.itemLink}>
              Преимущества
            </Link>
          </li>
          <li className={styles.liContainer}>
            <Link href={"/"} className={styles.itemLink}>
              Консепт
            </Link>
          </li>
          <li className={styles.liContainer}>
            <Link href={"/"} className={styles.itemLink}>
              Команда
            </Link>
          </li>
          <li className={styles.liContainer}>
            <Link href={"/search"} className={styles.itemLink}>
              Чат
            </Link>
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
