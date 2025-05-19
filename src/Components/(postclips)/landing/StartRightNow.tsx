import React from "react";
import Image from "next/image";
export const StartRightNow = () => {
  return (
    <div className="start-right-now-section">
      <Image src="/assets/images/(postclips)/landing/rocket.svg" alt="Start right now" width={50} height={50} />
      <h2 className="start-right-now-title">Start right now</h2>
      <p className="start-right-now-subtitle">Become a Clipper Today</p>
      <div className="header-btn-wrapper">
        <a href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB" target="_blank" className="btn-chipped">GET THE APP</a>
      </div>
    </div>
  );
};
