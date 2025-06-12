import RotatingGlowButton from "@/Components/Buttons/Common/RotatingGlowButton";
import Image from "next/image";

export const Header = ({ button = "GET THE APP" }) => {
  return (
    <header className="landing-header">
      <div className="logo-container">
        <Image src="/assets/images/(postclips)/logos/logo.svg" alt="PostClips Logo" width={120} height={32} priority />
      </div>
      <div className="header-btn-wrapper">
        <RotatingGlowButton>
          <a href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB" target="_blank" className="btn-chipped">
            {button}
          </a>
        </RotatingGlowButton>
      </div>
    </header>
  )
}