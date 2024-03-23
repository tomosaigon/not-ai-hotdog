/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const totalPages = 5;

const frames = createFrames({
  basePath: "/frames",
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);

  const imageUrl = [`https://picsum.photos/seed/frames.js-1/300/200`,
  'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Coney_Island_hot_dog_from_American_Coney_Island_in_Detroit.jpg/250px-Coney_Island_hot_dog_from_American_Coney_Island_in_Detroit.jpg',
  ][1];

  return {
    image: (
      <div tw="flex flex-col">
        <img width={300} height={200} src={imageUrl} alt="Image" />
        <div tw="flex">
          You guessed {ctx.searchParams.guess}
        </div>
        <div tw="flex">
          This is slide {pageIndex + 1} / {totalPages}
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: { guess: "hot", pageIndex: (pageIndex + 1 + totalPages) % totalPages },
        }}
      >
        AI Hotdog
      </Button>,
      <Button
        action="post"
        target={{
          query: { guess: "not", pageIndex: (pageIndex + 1 + totalPages) % totalPages },
        }}
      >
        Not AI Hotdog
      </Button>,
    ],
    // textInput: "Type something!",
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
