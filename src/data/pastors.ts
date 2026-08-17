import pastors from "@/assets/images/meet-our-pastors.jpg";
import pastorChukz from "@/assets/images/pastor-chukz.jpeg";

/** Edit the welcome note and pastor bios here. */
export const WELCOME = {
  eyebrow: "Welcome home",
  heading: "You are welcome to Fountain of Life Church USA",
  signature: "Pastor Chukz & Pastor Mrs. Chukz",
  role: "Lead Pastors, Fountain of Life Church USA",
  image: pastors,
  imageAlt: "The lead pastors of Fountain of Life Church USA",
  paragraphs: [
    "Thank you for finding us. Whether you are searching, returning, or simply looking for a family to grow with, we want you to know that this house was built with you in mind. Fountain of Life Church USA is a place where the Word of God is taught plainly, where prayer is a lifestyle, and where ordinary people discover the extraordinary purpose God has written over their lives.",
    "We believe church is far more than a Sunday gathering. It is a family that walks with you through the seasons — the celebrations, the waiting rooms, the fresh starts. So when you come, come as you are. You will find warm faces, honest teaching, worship that lifts your heart, and people who will genuinely pray with you.",
    "Our prayer for you is simple: that you would discover your purpose, take hold of your inheritance in Christ, and fulfil the destiny God has prepared for you. If you are in Indianapolis, we would love to meet you this Sunday. If you are far away, join us online — there is a seat for you here either way.",
  ],
};

export type Leader = {
  name: string;
  role: string;
  img: string;
  bio: string[];
};

/** The lead pastor and his wife. */
export const LEAD_PASTORS: Leader[] = [
  {
    name: "Pastor Chukz",
    role: "Lead Pastor",
    img: pastorChukz,
    bio: [
      "Pastor Chukz is the Lead Pastor of Fountain of Life Church USA in Indianapolis, Indiana. He carries a deep passion for teaching the Word of God with clarity and for raising believers who are grounded in prayer and confident in their identity in Christ.",
      "His ministry is marked by a pastoral heart — patient with people, unwavering on the Word, and committed to seeing every member discover and fulfil their God-given destiny.",
    ],
  },
  {
    name: "Pastor Mrs. Chukz",
    role: "Lead Pastor",
    img: pastors,
    bio: [
      "Pastor Mrs. Chukz serves alongside her husband as Lead Pastor, with a special grace for women, families and the next generation. She leads with warmth, wisdom and a genuine love for people.",
      "Through counselling, mentoring and the ministry of intercession, she nurtures a culture of care in the house — helping wives, mothers and young women stand strong in faith and purpose.",
    ],
  },
];
