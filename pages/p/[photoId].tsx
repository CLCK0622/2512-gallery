import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Carousel from "../../components/Carousel";
import {getResults} from "../../utils/cachedImages";
import tags from "../../tags.json";
import { ImageProps } from "../../utils/types";

const PhotoPage: NextPage = ({
  currentPhoto,
  tagName,
}: {
  currentPhoto: ImageProps;
  tagName: string;
}) => {
  const router = useRouter();
  const { photoId } = router.query;
  let index = Number(photoId);

  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhoto.public_id}.${currentPhoto.format}`;

  return (
    <>
      <Head>
        <title>{tags[tagName] || "Untagged"} - 2512 Album</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <h1 className="mb-4 text-2xl font-bold">
          {tags[tagName] || "Untagged"}
        </h1>
        <Carousel currentPhoto={currentPhoto} index={index} />
      </main>
    </>
  );
};

export default PhotoPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const { props } = await getResults();
  const { categorizedImages, untaggedImages } = props;

  const allImages = [
    ...Object.values(categorizedImages).flat(),
    ...untaggedImages,
  ];

  const photoId = context.params.photoId;
  const currentPhoto = allImages.find((img) => img.public_id === photoId);  

  if (!currentPhoto) {
    return { notFound: true };
  }

  const tagName = currentPhoto.tags.length > 0 ? currentPhoto.tags[0] : "untagged";

  return {
    props: {
      currentPhoto,
      tagName,
    },
  };
};

export async function getStaticPaths() {
  const { props } = await getResults();
  const { categorizedImages, untaggedImages } = props;

  let fullPaths = [];

  for (const [tag, images] of Object.entries(categorizedImages) as [string, ImageProps[]][]) {
    images.forEach((image: ImageProps) => {
      fullPaths.push({ params: { photoId: image.public_id } });
    });
  }

  untaggedImages.forEach((image: ImageProps) => {
    fullPaths.push({ params: { photoId: image.public_id } });
  });

  return {
    paths: fullPaths,
    fallback: false,
  };
}
