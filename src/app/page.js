"use client";
import { useState } from "react";
import styles from "./page.module.css";
import StyleGrid from "./components/StyleGrid";
import StyleGenerator from "./components/StyleGenerator";
import { useSession } from "next-auth/react";
import SearchBar from "./components/SearchBar";

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
        <StyleGenerator> </StyleGenerator>

        <StyleGrid
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </main>
    </div>
  );
}
