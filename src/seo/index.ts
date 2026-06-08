import { goldenVisaPages } from "./goldenVisa";
import { offPlanPages } from "./offPlan";
import { areaGuidePages } from "./areaGuides";
import { investmentGuidePages } from "./investmentGuides";
import { buyerGuidePages } from "./buyerGuides";
import { brandedResidencePages } from "./brandedResidences";
import { lifestylePages } from "./lifestyle";
import { jumeirahDeepPages } from "./jumeirahDeep";
import { jumeirahPages } from "./jumeirahPages";
import { alMaryahPages } from "./alMaryahPages";
import { pricingPages } from "./pricingPages";
import { communityPages } from "./communityPages";
import { brandPages } from "./brandPages";
import { SeoPageData } from "./types";

export const allSeoPages: SeoPageData[] = [
  ...goldenVisaPages,
  ...offPlanPages,
  ...areaGuidePages,
  ...investmentGuidePages,
  ...buyerGuidePages,
  ...brandedResidencePages,
  ...lifestylePages,
  ...jumeirahDeepPages,
  ...jumeirahPages,
  ...alMaryahPages,
  ...pricingPages,
  ...communityPages,
  ...brandPages,
];

// Fast lookup map: slug → page data
export const seoPageMap: Record<string, SeoPageData> = Object.fromEntries(
  allSeoPages.map((p) => [p.slug, p])
);

export type { SeoPageData };
