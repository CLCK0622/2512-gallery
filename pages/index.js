import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import tagName from "../tags.json";
import styles from "../styles/main.module.scss";

export default function Home() {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const cachedData = localStorage.getItem("photoData");
            if (cachedData) {
                const parsedData = JSON.parse(cachedData);
                setTags(Object.keys(parsedData));
            } else {
                const res = await fetch("/api/fetchPhotos");
                const data = await res.json();
                localStorage.setItem("photoData", JSON.stringify(data));
                setTags(Object.keys(data));
            }
            setLoading(false);
        };

        fetchData();

        const clearLocalStorage = () => {
            localStorage.removeItem("photoData");
        };

        window.addEventListener("beforeunload", clearLocalStorage);

        return () => {
            window.removeEventListener("beforeunload", clearLocalStorage);
        };
    }, []);

    return (
        <>
            <div className={styles.container}>
                <section id="title-section">
                    <div className={styles.title}>2512 Album</div>
                    <div className={"material-symbols-outlined"}>
                        keyboard_arrow_down
                    </div>
                </section>
                <section id="content-section">
                    <h1>{loading ? "Loading..." : "Events"}</h1>
                    {tags.map((tag) => (
                        <p
                            className={styles.tagList}
                            key={tag}
                        >
                            <span
                                onClick={() => router.push(`/tag/${tag}`)}>{tagName[tag] || tag}</span>
                        </p>
                    ))}
                </section>
            </div>
            <footer className="p-6 text-center text-white/80 sm:p-12">
                Site made by{" "}
                <a
                    href="https://github.com/CLCK0622"
                    target="_blank"
                    className="font-semibold hover:text-white"
                    rel="noreferrer"
                >
                    Kevin Zhong
                </a>
                . Photos organized by{" "}
                <a
                    href="https://www.instagram.com/crhappyforever/"
                    target="_blank"
                    className="font-semibold hover:text-white"
                    rel="noreferrer"
                >
                    crhappyforever
                </a>
                . <br />
                Thanks to{" "}
                <a
                    href=""
                    target="_blank"
                    className="font-semibold hover:text-white"
                    rel="noreferrer"
                >
                    2512
                </a>{" "}
                for all the pictures and the happy memories.
                <br />
                All made with ❤️. Copyright &copy; 2023 - 2024.
            </footer>
        </>
    );
}
