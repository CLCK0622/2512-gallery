import cloudinary from "./cloudinary";

import tags from "../tags.json";
import getBase64ImageUrl from "./generateBlurPlaceholder";
import { ImageProps } from "./types";

export async function getResults() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  let reducedResults: ImageProps[] = [];
  let i = 0;

  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
      tags: result.tags || [],
    });
    i++;
  }

  const blurImagePromises = reducedResults.map((image) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

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

  console.log("categorizedImages:", categorizedImages);
  console.log("untaggedImages:", untaggedImages);

  return {
    props: {
      categorizedImages,
      untaggedImages,
    },
  };
}
