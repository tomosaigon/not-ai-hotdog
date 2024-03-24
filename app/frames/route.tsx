/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const totalPages = 5;

const frames = createFrames({
  basePath: "/",
});

const handleRequest = frames(async (ctx) => {
  if (ctx.message?.transactionId) {
    return {
      accepts: [{
        id: 'farcaster',
        version: 'vNext'
      }, {
        id: 'xmtp',
        version: 'vNext'
      }],
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {ctx.message.transactionId}
        </div>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="link"
          target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
        >
          View on block explorer
        </Button>,
      ],
    };
  }

  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const pastGuesses = ctx.searchParams.guess ? (ctx.searchParams.pastGuesses ? ctx.searchParams.pastGuesses + ',' : '') + ctx.searchParams.guess : '';

  if (pageIndex >= totalPages) {
    const won = pastGuesses.split(',').filter((x) => x === 'not').length >= totalPages;
    return {
      accepts: [{
        id: 'farcaster',
        version: 'vNext'
      }, {
        id: 'xmtp',
        version: 'vNext'
      }],
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          You&apos;ve reached the end! {won ? 'You won! Mint your NFT!' : 'You lost! No NFT for you :('}
        </div>
      ),
      buttons: [
        won ? <Button action="tx" target="/txdata" post_url="/frames">
          Mint
        </Button> : <Button
          action="post"
          target={{
            query: { pageIndex: 0 },
            pathname: "/frames",
          }}
        >
          Restart
        </Button>
      ],
    };
  }

  const imageUrl = [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Coney_Island_hot_dog_from_American_Coney_Island_in_Detroit.jpg/250px-Coney_Island_hot_dog_from_American_Coney_Island_in_Detroit.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Flint_coney_island.jpg/320px-Flint_coney_island.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Detroit_Coney.jpg/248px-Detroit_Coney.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/6/6d/Original_coney_dog.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Skyline_Chili_Coneys.jpg/320px-Skyline_Chili_Coneys.jpg'
  ][pageIndex % totalPages];

  return {
    accepts: [{
      id: 'farcaster',
      version: 'vNext'
    }, {
      id: 'xmtp',
      version: 'vNext'
    }],
    headers: {
      // Max cache age of 5 seconds
      "Cache-Control": "max-age=5",
    },
    image: (
      <div tw="flex flex-col">
        <div tw="flex">
          <h3 tw="m-0">AI Hotdog or Not? {pageIndex + 1} / {totalPages}</h3>
        </div><div tw="flex">
          <p>
            {pageIndex === 0 ? 'We are training AI to recognize hotdogs and we need help from humans. Intelligent humans will be rewarded with an NFT.' : ''}
            
            Please identify which of these hotdogs are AI-generated.
          </p>
        </div>
        <div tw="flex justify-center items-center ">
          <img width={300} height={180} src={imageUrl} alt="Image" />
          {ctx.searchParams.guess ? 'You last guessed ' + ctx.searchParams.guess + 'dog! And this one?' : 'Make a guess!'}
        </div>
      </div>
    ),
    buttons: [
      <Button
        action="post"
        target={{
          query: { pastGuesses, guess: "hot", pageIndex: pageIndex + 1 },
          pathname: "/frames",
        }}
      >
        AI Hotdog
      </Button>,
      <Button
        action="post"
        target={{
          query: { pastGuesses, guess: "not", pageIndex: pageIndex + 1 },
          pathname: "/frames",
        }}
      >
        Not AI Hotdog
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
