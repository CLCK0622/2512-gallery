import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/main.module.scss";
import tagName from "../../tags.json";

export default function TagPage() {
    const router = useRouter();
    const { tag } = router.query;
    const [photos, setPhotos] = useState([]);
    const [page, setPage] = useState(0);
    const photosPerPage = 50;

    useEffect(() => {
        if (!tag) return;

        const cachedData = localStorage.getItem("photoData");
        if (cachedData) {
            const data = JSON.parse(cachedData);
            setPhotos(data[tag] || []);
        }
    }, [tag]);

    const loadMore = () => {
        setPage((prev) => prev + 1);
    };

    return (
        <>
            <section id="tags-section">
                <div className={styles.tagTitle}>{tagName[tag] || tag}</div>
            </section>
            <div className={styles.navigation}>
                <button
                    onClick={() => router.push("/")}
                >
                    Homepage
                </button>
            </div>
            <section id="content-section">
                <div
                    style={{
                        display: "grid",
                        gap: "10px",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                    }}
                >
                    {photos
                        .slice(0, (page + 1) * photosPerPage)
                        .map((photo, index) => (
                            <a href={photo.original_url} target="_blank" key={index}>
                                <img
                                    className={styles.image}
                                    key={index}
                                    src={photo.thumbnail_url}
                                    alt={`Photo ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        borderRadius: "8px",
                                    }}
                                    loading="lazy"
                                />
                            </a>
                        ))}
                </div>

                {photos.length > (page + 1) * photosPerPage && (
                    <button
                        onClick={loadMore}
                    >
                        Load More
                    </button>
                )}
            </section>
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
