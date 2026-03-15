import memory1 from "@/assets/memory-1.jpg";
import memory2 from "@/assets/memory-2.jpg";
import memory3 from "@/assets/memory-3.jpg";
import memory4 from "@/assets/memory-4.jpg";
import memory5 from "@/assets/memory-5.jpg";
import memory6 from "@/assets/memory-6.jpg";
import memory7 from "@/assets/memory-7.jpg";
import memory8 from "@/assets/memory-8.jpg";
import memory9 from "@/assets/memory-9.jpg";
import memory10 from "@/assets/memory-10.jpg";

export interface Memory {
  id: number;
  image: string;
  title: string;
  description: string;
}

export const memories: Memory[] = [
  {
    id: 1,
    image: memory1,
    title: "Golden Hour by the Lake",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. The warmth of the setting sun painted everything in hues of amber and gold.",
  },
  {
    id: 2,
    image: memory2,
    title: "The Old Bicycle",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. A rusty companion that carried countless stories along dirt roads.",
  },
  {
    id: 3,
    image: memory3,
    title: "Rain on the Window",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Each droplet held a reflection of the city lights below.",
  },
  {
    id: 4,
    image: memory4,
    title: "The Forgotten Bookshop",
    description: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Dust motes danced in lamplight between towering shelves.",
  },
  {
    id: 5,
    image: memory5,
    title: "Autumn's Winding Path",
    description: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. Golden leaves carpeted the road less traveled.",
  },
  {
    id: 6,
    image: memory6,
    title: "The Misty Pier",
    description: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Standing alone where the world dissolved into fog and silence.",
  },
  {
    id: 7,
    image: memory7,
    title: "Wildflower Afternoons",
    description: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit. Tiny hands reaching for beauty in the golden meadow.",
  },
  {
    id: 8,
    image: memory8,
    title: "The Last Train",
    description: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur. Steam and memory rising into the evening sky.",
  },
  {
    id: 9,
    image: memory9,
    title: "Candlelit Evening",
    description: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti. Warm light flickering across familiar faces.",
  },
  {
    id: 10,
    image: memory10,
    title: "Letters from the Past",
    description: "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. Faded ink on yellowed paper, voices from another time.",
  },
];
