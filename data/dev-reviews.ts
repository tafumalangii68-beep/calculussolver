// DUMMY REVIEWS FOR LOCAL TESTING ONLY.
// Used only by `npm run dev` when no database is connected (see lib/reviews/store.ts).
// They are never used in a production build, so they can never appear on the live site.

import type { PublicReview } from "@/lib/reviews/validate";

const dummy: [string, number, string, string][] = [
  ["Sophia Williams", 5, "College student", "TEST DATA. The derivative steps show every rule, which makes long chain rule problems easy to follow."],
  ["James Carter", 5, "AP Calculus student", "TEST DATA. Integration by parts finally clicked once I could see each step of the working laid out."],
  ["Emily Johnson", 4, "High school student", "TEST DATA. The limit calculator explains L'Hôpital's rule clearly. I'd like graphs too, but the steps are great."],
  ["Daniel Anderson", 5, "College student", "TEST DATA. The Taylor series table of derivatives and coefficients is perfect for checking homework."],
  ["Olivia Bennett", 5, "Self-learner", "TEST DATA. I'm relearning calculus on my own, and the guides plus the solver make it much less intimidating."],
  ["Ethan Wilson", 4, "Graduate student", "TEST DATA. Handy for quickly checking partial derivatives, and the f_xy option saves time."],
  ["Mia Thompson", 5, "AP Calculus student", "TEST DATA. Critical points come with the test that decided them, which is exactly what my teacher asks for."],
  ["Noah Mitchell", 5, "Teacher or tutor", "TEST DATA. I use it to prepare worked examples for my students; the steps match how I teach."],
  ["Isabella Davis", 5, "High school student", "TEST DATA. Implicit differentiation used to confuse me, but the step-by-step version made sense."],
];

export const devReviews: PublicReview[] = dummy.map(([name, rating, category, message], i) => ({
  id: 9000 + i,
  name,
  rating,
  category,
  message,
  createdAt: new Date(Date.UTC(2026, 10, 1 + i)).toISOString(),
}));
