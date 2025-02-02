import React from "react";

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl m-auto w-full">
      <h2 className="text-2xl font-bold mt-16 mb-5 flex items-center">
        <img src={"/logo50.png"} alt="" className="mr-3" />
        bobo ballot
      </h2>
      <p>
        welcome to FORM's new internal voting tool! to get started, there's just
        a few steps:
      </p>
      <ol className="list-decimal mt-5">
        {!localStorage.getItem("adminKey") && (
          <li>click the login link to activate bobo ballot</li>
        )}
        <li>configure your settings (hit the button in the top right!)</li>
        <li>click Vote in the navigation bar, and start voting!</li>
      </ol>
      <p className="mt-5">
        we've also added some keyboard shortcuts for your convenience:
      </p>
      <ol className="list-disc mt-5">
        <li>
          <strong>number keys</strong> let you choose your vote
        </li>
        <li>
          <strong>enter</strong> moves to the next song
        </li>
        <li>
          <strong>left and right arrows</strong> skip forward and backward
        </li>
        <li>
          <strong>spacebar or 0</strong> plays and pauses
        </li>
      </ol>
      <p className="mt-5">
        please note that bobo ballot is still unfinished, and can't replace the
        entire voting process just yet. here's a few important things to keep in
        mind:
      </p>
      <ol className="list-disc mt-5">
        <li>
          your votes will automatically synchronize with the spreadsheet. feel
          free to use either or both!
        </li>
        <li>
          the transition from round 1 to round 2 will still take place in the
          spreadsheet. to be specific: sorting, backfilling empty votes,
          choosing a round 2 cutoff, and moving to the round 2 sheet will still
          be performed in the spreadsheet.
        </li>
        <li>
          relatedly, saves will still take place in the spreadsheet. you'll need
          to continue to mark your save in the spreadsheet and ensure your saved
          song is copied into the round 2 sheet.
        </li>
        <li>the final evaluation call will still use the spreadsheet</li>
        <li>
          feedback is appreciated! we're planning on continuing to work on bobo
          ballot to make the new voting process even better.
        </li>
      </ol>
    </div>
  );
};

export default Home;
