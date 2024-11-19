import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    const result = await cloudinary.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .with_field("tags")
      .sort_by("public_id", "desc")
      .max_results(500)
      .execute();

    const resources = result.resources;

    const groupedPhotos = resources.reduce((acc, photo) => {
      (photo.tags || []).forEach((tag) => {
        if (!acc[tag]) acc[tag] = [];
        acc[tag].push({
          public_id: photo.public_id,
          original_url: photo.secure_url,
          thumbnail_url: cloudinary.url(photo.public_id, {
            transformation: [
              { width: 200, height: 200, crop: "fill" },
              { quality: "auto" },
            ],
          }),
        });
      });
      return acc;
    }, {});

    res.status(200).json(groupedPhotos);
  } catch (error) {
    console.error("Error fetching Cloudinary resources:", error);
    res.status(500).json({ error: error.message });
  }
}
