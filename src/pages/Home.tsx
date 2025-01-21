import React from "react";

const Home: React.FC = () => {
  return (
    <div className="max-w-4xl m-auto w-full leading-9">
      <h2 className="text-2xl font-bold mt-16 mb-5 flex items-center">
        <img src={"/logo50.png"} alt="" className="mr-3" />
        bobo ballot
      </h2>
      <p>
        welcome to FORM's new internal voting tool! to get started, there's just
        a few steps:
      </p>
      <ol className="list-decimal">
        {!localStorage.getItem("adminKey") && (
          <li>click the login link to activate bobo ballot</li>
        )}
        <li>configure your settings (hit the button in the top right!)</li>
        <li>click Vote in the navigation bar, and start voting!</li>
      </ol>
      <p className="mt-5">
        we've also added some keyboard shortcuts for your convenience:
      </p>
      <ol className="list-disc">
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
          <strong>spacebar</strong> plays and pauses
        </li>
      </ol>
    </div>
  );
};

export default Home;
