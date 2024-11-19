import pLimit from "p-limit";
import cloudinary from "./cloudinary";

import tags from "../tags.json";
// import getBase64ImageUrl from "./generateBlurPlaceholder";
import { ImageProps } from "./types";

export async function getResults() {
  cloudinary.v2.api.resources({ type: "upload", max_results: 1000 });

  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .with_field("tags")
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  let reducedResults: ImageProps[] = [];
  let i = 0;

  for (let result of results.resources) {
    reducedResults.push({
      id: result.public_id,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      tags: result.tags || [],
    });
    i++;
  }

  const limit = pLimit(5);

//   const blurImagePromises = reducedResults.map((image) =>
//     limit(() => getBase64ImageUrl(image))
//   );

//   const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

//   for (let i = 0; i < reducedResults.length; i++) {
//     reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
//   }

  const categorizedImages = {};
  const untaggedImages = [];

  reducedResults.forEach((image) => {
    if (image.tags.length > 0) {
      image.tags.forEach((tag) => {
        if (tags[tag]) {
          if (!categorizedImages[tag]) categorizedImages[tag] = [];
          categorizedImages[tag].push(image);
        }
      });
    } else {
      untaggedImages.push(image);
    }
  });

  return {
    props: {
      categorizedImages,
      untaggedImages,
    },
  };
}
