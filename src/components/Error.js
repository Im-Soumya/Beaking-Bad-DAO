import React from "react";

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen md:hidden">
      <h1 className="text-white text-xl">Too small screen size.</h1>
      <h2 className="mx-auto">
        Please switch to a{" "}
        <span className="text-lg text-cyan-400 font-semibold">desktop</span> or
        a <span className="text-lg text-cyan-400 font-semibold">laptop</span>{" "}
        for a better view.
      </h2>
    </div>
  );
};

export default Error;
