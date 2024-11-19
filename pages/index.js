import { useEffect, useState } from "react";
import styles from "../styles/main.module.scss";
import tags from "../tags.json"
import Head from "next/head";

export default function Home() {
    const [photos, setPhotos] = useState({});

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const res = await fetch("./api/fetchPhotos");
                const data = await res.json();
                setPhotos(data);
            } catch (error) {
                console.error("Failed to fetch photos", error);
            }
        };
        fetchPhotos();
    }, []);

    return (
        <>
            <Head><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0&icon_names=keyboard_arrow_down" /></Head>
            <div className={styles.container}>
                <section id="title-section">
                    <div className={styles.title}>2512 Album</div>
                    <div class="material-symbols-outlined">
                        keyboard_arrow_down
                    </div>
                </section>
                <section id="content-section">
                    {Object.entries(photos).map(([tag, images]) => (
                        <div key={tag} className={styles.tagGroup}>
                            <h2 className={styles.tag}>{tags[tag]}</h2>
                            <div className={styles.imageGrid}>
                                {(Array.isArray(images) ? images : []).map((image) => (
                                    <a
                                        key={image.public_id}
                                        href={image.original_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={image.thumbnail_url}
                                            alt={image.public_id}
                                            loading="lazy"
                                            className={styles.image}
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
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
                All made with ❤️. Copyright ©️ 2023 - 2024.
            </footer>
        </>
    );
}
