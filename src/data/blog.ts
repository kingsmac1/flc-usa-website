import { PLACEHOLDER } from "./site";

/**
 * BLOG
 * ----
 * Add a post by copying a block below. `body` is an array of paragraphs.
 */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  image: string;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "walking-in-your-inheritance",
    title: "Walking in Your Inheritance",
    excerpt:
      "Your inheritance in Christ is not a future promise alone — much of it is available to you today.",
    date: "2026-08-10",
    author: "Apostle Chuks",
    category: "Purpose",
    image: PLACEHOLDER.bible,
    body: [
      "Paul prayed that the eyes of our understanding would be enlightened so that we would know the riches of the glory of His inheritance in the saints. Notice that the inheritance is already given; what is missing is understanding.",
      "Many believers pray for what they already possess. The Christian life is less about asking God to do something new and more about learning to stand on what He has already done through Christ.",
      "Take time this week to write out what scripture says belongs to you — righteousness, peace, access, authority, provision. Then begin to live from that place instead of striving toward it.",
    ],
  },
  {
    slug: "why-prayer-is-a-lifestyle",
    title: "Why Prayer Is a Lifestyle, Not an Emergency Service",
    excerpt:
      "Prayer was never meant to be the last resort. It is the ongoing conversation of a son with his Father.",
    date: "2026-07-28",
    author: "Evang. Josephine Akuma",
    category: "Prayer",
    image: PLACEHOLDER.prayer,
    body: [
      "When prayer only happens in crisis, faith becomes reactive. But when prayer becomes the rhythm of your day, you meet crises already anchored.",
      "Start small and be consistent. Ten honest minutes every morning will do more for your walk than two hours of panic once a month.",
      "Invite your household in. A family that prays together develops a shared language of faith that carries children long after they leave home.",
    ],
  },
  {
    slug: "serving-our-city",
    title: "Serving Our City: Outreach in Indianapolis",
    excerpt:
      "A look at how the outreach team is reaching families across Indianapolis this season.",
    date: "2026-07-12",
    author: "FLC USA Team",
    category: "Church News",
    image: PLACEHOLDER.outreach,
    body: [
      "Every month our outreach team steps out of the building and into the neighbourhoods around Directors Row with food, prayer and practical help.",
      "This season we have focused on single-parent families and newly arrived immigrants, offering grocery support and help navigating local services.",
      "If you would like to serve, speak with any team member on Sunday or reach us through the contact page.",
    ],
  },
  {
    slug: "raising-children-in-the-word",
    title: "Raising Children in the Word",
    excerpt: "Practical habits for planting scripture in the hearts of your children early.",
    date: "2026-06-30",
    author: "Evang. Josephine Akuma",
    category: "Family",
    image: PLACEHOLDER.youth,
    body: [
      "Children absorb what is repeated, not what is announced. A short scripture at breakfast repeated all week will outlast a long lecture on Sunday.",
      "Let them see you pray. The most powerful discipleship happens when your children watch you depend on God in real time.",
      "Celebrate spiritual milestones the same way you celebrate school and sport achievements — it teaches them what your family truly values.",
    ],
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
