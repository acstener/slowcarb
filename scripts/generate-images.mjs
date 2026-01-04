import { writeFile, mkdir } from "fs/promises";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const baseStyle = `Professional food photography, top-down flat lay shot, bright natural daylight, clean white marble surface, soft diffused lighting, linen napkin edge visible, shallow depth of field, 85mm lens, f/2.8, high-end editorial food magazine style, appetizing and vibrant colors. No herbs scattered on the table surface.`;

const recipes = [
  {
    id: "global-carnitas-lettuce-wraps",
    prompt: `${baseStyle} Mexican carnitas lettuce wraps - crispy pork carnitas with black beans, diced tomatoes, and fresh cilantro in butter lettuce cups. Vibrant Mexican colors, fresh and appetizing.`,
  },
  {
    id: "global-lamb-keema-squash",
    prompt: `${baseStyle} Indian lamb keema - spiced ground lamb curry with green peas served over golden spaghetti squash strands. Rich curry colors, aromatic spices visible.`,
  },
  {
    id: "global-chicken-shawarma-cabbage",
    prompt: `${baseStyle} Middle Eastern chicken shawarma bowl - golden spiced chicken over shredded cabbage with chickpeas, cucumber, and creamy tahini drizzle. Fresh Mediterranean presentation.`,
  },
  {
    id: "global-banh-mi-collard-wraps",
    prompt: `${baseStyle} Vietnamese banh mi collard wraps - lemongrass pork with pickled julienned carrots, edamame, and fresh herbs wrapped in dark green collard leaves. Fresh and colorful.`,
  },
  {
    id: "global-moroccan-lamb-turnip",
    prompt: `${baseStyle} Moroccan lamb tagine - aromatic lamb stew with chickpeas and dried apricots over creamy white turnip mash. Warm spices, cilantro garnish. North African comfort food.`,
  },
  {
    id: "global-ethiopian-doro-wat",
    prompt: `${baseStyle} Ethiopian doro wat - deep red berbere-spiced chicken stew with halved boiled eggs over shredded cabbage and lentils. Rich Ethiopian colors, warm and rustic.`,
  },
  {
    id: "global-lomo-saltado-portobello",
    prompt: `${baseStyle} Peruvian lomo saltado - stir-fried beef strips with tomato wedges and onions served in large roasted portobello mushroom caps. Colorful Latin fusion presentation.`,
  },
  {
    id: "global-shogayaki-cabbage",
    prompt: `${baseStyle} Japanese ginger pork bowl - caramelized ginger-glazed pork slices over finely shredded crisp cabbage with bright green edamame. Clean Japanese presentation.`,
  },
  {
    id: "global-picanha-collard-greens",
    prompt: `${baseStyle} Brazilian picanha - sliced grilled beef with coarse salt crust alongside garlicky braised collard greens and black beans with lime. Rustic Brazilian churrasco style.`,
  },
  {
    id: "global-thai-larb-lettuce",
    prompt: `${baseStyle} Thai larb gai lettuce cups - spicy minced chicken salad with shallots and edamame in butter lettuce cups. Fresh Thai herbs, lime wedge. Bright and zesty.`,
  },
];

async function generateImages() {
  await mkdir("public/recipes", { recursive: true });

  for (const recipe of recipes) {
    console.log(`\nGenerating: ${recipe.id}`);

    try {
      const output = await replicate.run("bytedance/seedream-3", {
        input: {
          prompt: recipe.prompt,
          aspect_ratio: "4:3",
          output_format: "jpg",
          output_quality: 90,
        },
      });

      const filename = `public/recipes/${recipe.id}.jpg`;
      await writeFile(filename, output);
      console.log(`✓ Saved: ${filename}`);
    } catch (error) {
      console.error(`✗ Failed: ${error.message}`);
    }
  }

  console.log("\n✓ Done!");
}

generateImages();
