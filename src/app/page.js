"use client";
import { useState } from "react";
import styles from "./page.module.css";
import StyleGrid from "./components/StyleGrid";
import StyleGenerator from "./components/StyleGenerator";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navigation from "./components/Navigation";
import SearchBar from "./components/SearchBar";

export default function Home() {
  const { data: session } = useSession();
  const [sortBy, setSortBy] = useState("newest");
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
        <StyleGenerator />
        <StyleGrid searchTerm={searchTerm} sortBy={sortBy} />
      </main>
    </div>
  );
}
