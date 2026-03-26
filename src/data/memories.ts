export interface Memory {
  id: number;
  image: string;
  title: string;
  description: string;
}
export const memoriesData: Memory[] = [
  {
    id: 1,
    image: "/images/memory-1.jpeg",
    title: "First Day",
    description: "The beginning of a new journey."
  },
  {
    id: 2,
    image: "/images/memory-2.jpeg",
    title: "Hackathon Night",
    description: "Coding all night with friends."
  },
  {
    id: 3,
    image: "/images/memory-3.jpeg",
    title: "Graduation Day",
    description: "A proud moment to remember forever."
  }
];