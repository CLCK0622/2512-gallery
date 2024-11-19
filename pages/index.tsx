import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { lazy, useEffect, useRef } from "react";
import Bridge from "../components/Icons/Bridge";
import Modal from "../components/Modal";
import cloudinary from "../utils/cloudinary";
// import getBase64ImageUrl from "../utils/generateBlurPlaceholder";
import type { ImageProps } from "../utils/types";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import tags from "../tags.json";
import { getResults } from "../utils/cachedImages";

const Home: NextPage = ({ categorizedImages, untaggedImages }: any) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>2512 Album</title>
        <meta
          property="og:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
        <meta
          name="twitter:image"
          content="https://nextjsconf-pics.vercel.app/og-image.png"
        />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={[
              ...Object.values(categorizedImages).flat(),
              ...untaggedImages,
            ]}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="gap-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Bridge />
              </span>
              <span className="absolute left-0 right-0 bottom-0 h-[400px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>
            {/* <Logo /> */}
            <h1 className="mt-8 mb-4 text-3xl font-bold uppercase tracking-widest">
              2512 Album
            </h1>
            <p className="max-w-[40ch] text-white/75 sm:max-w-[32ch]">
              Welcome to EFZ-GKB 2512!
            </p>
            <a
              className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
              href=""
              target="_blank"
              rel="noreferrer"
            >
              Homepage(WIP)
            </a>
          </div>
          {Object.entries(categorizedImages || {}).map(
            ([tag, images]: [string, any]) => (
              <div key={tag} className="mb-12">
                <h2 className="mb-4 text-xl font-semibold text-white">
                  {tags[tag]}
                </h2>
                <div className="gap-4 columns-1 sm:columns-2 lg:columns-6">
                  {images.map(
                    ({ id, public_id, format, blurDataUrl }: ImageProps) => (
                      <Link
                        key={id}
                        href={`/?photoId=${public_id}`}
                        as={`/p/${public_id}`}
                        ref={
                          id === Number(lastViewedPhoto)
                            ? lastViewedPhotoRef
                            : null
                        }
                        shallow
                        className="after:content group relative mb-5 block cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                      >
                        <Image
                          alt="Album photo"
                          className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                          placeholder="blur"
                          blurDataURL={
                            "https://placehold.co/600x400?text=Hello+World"
                          }
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                          width={720}
                          height={480}
                          sizes="(max-width: 640px) 100vw,
                          (max-width: 1280px) 50vw,
                          (max-width: 1536px) 33vw,
                          25vw"
                        />
                      </Link>
                    )
                  )}
                </div>
              </div>
            )
          )}

          <div className="mb-12">
            <h2 className="mb-4 text-xl font-semibold text-white">未分类</h2>
            <div className="gap-4">
              {(untaggedImages || []).map(
                ({ id, public_id, format, blurDataUrl }: ImageProps) => (
                  <Link
                    key={id}
                    href={`/?photoId=${public_id}`}
                    as={`/p/${public_id}`}
                    ref={
                      id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null
                    }
                    shallow
                    className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
                  >
                    <Image
                      alt="Album photo"
                      className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                      placeholder="blur"
                      blurDataURL={
                        "https://placehold.co/600x400?text=Hello+World"
                      }
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                      width={180}
                      height={120}
                      sizes="(max-width: 640px) 100vw,
                      (max-width: 1280px) 50vw,
                      (max-width: 1536px) 33vw,
                      25vw"
                    />
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </main>
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
};

export default Home;

export async function getStaticProps() {
  const { props } = await getResults();

  return {
    props: {
      categorizedImages: props.categorizedImages || {},
      untaggedImages: props.untaggedImages || [],
    },
  };
}
