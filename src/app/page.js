"use client";
import { useState } from "react";
import styles from "./page.module.css";
import StyleGenerator from "./components/StyleGenerator";
import SearchBar from "./components/SearchBar";
import StyleGrid from "./components/StyleGrid";

export default function Home() {
  const [sortBy, setSortBy] = useState("mostLiked");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
        <StyleGenerator setSortBy={setSortBy}> </StyleGenerator>
        <StyleGrid
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </main>
    </div>
  );
}
