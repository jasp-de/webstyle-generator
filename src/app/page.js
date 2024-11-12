import Image from "next/image";
import styles from "./page.module.css";
import StyleGrid from "./components/StyleGrid.js";
import StyleGenerator from "./components/StyleGenerator";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className="heading">
          <h1>Webstyle Explorer</h1>
          <p>Discover and compare different web design aesthetics</p>
        </div>
        <StyleGenerator></StyleGenerator>
        <div>
          <StyleGrid></StyleGrid>
        </div>
      </main>
      <footer className={styles.footer}></footer>
    </div>
  );
}
