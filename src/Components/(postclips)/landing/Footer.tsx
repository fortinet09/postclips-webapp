import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-white py-16">
            {/* Logo Section */}
            <div className="container mx-auto px-4 mb-5 d-flex justify-content-center">
                <Image
                    src="/assets/images/(postclips)/logos/logo.svg"
                    alt="PostClips Logo"
                    width={180}
                    height={48}
                />
            </div>

            {/* App Store Buttons */}
            <div className="container d-flex justify-content-center gap-3">
                <Link href="https://apps.apple.com/mx/app/post-clips/id6742848231?l=en-GB" target="_blank" className="app-store-btn">
                    <Image
                        src="/assets/images/(postclips)/landing/appstore.svg"
                        alt="App Store"
                        width={140}
                        height={44}
                    />
                </Link>
                {/* <Link href="https://play.google.com/store/apps/details?id=com.postclips.app" target="_blank" className="app-store-btn">
                    <Image
                        src="/assets/images/(postclips)/landing/googleplay.svg"
                        alt="Google Play"
                        width={140}
                        height={44}
                    />
                </Link> */}
            </div>

            {/* Legal Links */}
            <div className="container mx-auto px-4 mt-4">
                <div className="flex justify-center gap-8 md:gap-16 text-center postclips-links">
                    <Link href="/terms" target="_blank" className="text-white cursor-pointer">
                        Terms of use
                    </Link>
                    <Link href="/privacy" target="_blank" className="text-white cursor-pointer">
                        Privacy Policy
                    </Link>
                    <Link href="/disclosures" target="_blank" className="text-white cursor-pointer">
                        Disclosures
                    </Link>
                </div>
            </div>

            {/* Social Media Icons */}
            <div className="container mx-auto px-4 mb-5 mt-5">
                <div className="flex justify-center gap-6 socials-container">
                    <Link href="https://x.com/PostClips2" target="_blank" aria-label="Twitter/X">
                        <Image
                            src="/assets/images/(postclips)/landing/twitter.svg"
                            alt="Twitter/X"
                            width={28}
                            height={28}
                        />
                    </Link>
                    <Link href="https://www.tiktok.com/@postclips" target="_blank" aria-label="TikTok">
                        <Image
                            src="/assets/images/(postclips)/landing/tiktok.svg"
                            alt="TikTok"
                            width={28}
                            height={28}
                        />
                    </Link>
                    <Link href="https://www.youtube.com/channel/UCv28tg0BfgzAVvGWFAfkO9A" target="_blank" aria-label="YouTube">
                        <Image
                            src="/assets/images/(postclips)/landing/youtube.svg"
                            alt="YouTube"
                            width={28}
                            height={28}
                        />
                    </Link>
                    <Link href="https://www.facebook.com/profile.php?id=61573178450005" target="_blank" aria-label="Facebook">
                        <Image
                            src="/assets/images/(postclips)/landing/facebook.svg"
                            alt="Facebook"
                            width={28}
                            height={28}
                        />
                    </Link>
                    <Link href="https://www.instagram.com/postclips" target="_blank" aria-label="Instagram">
                        <Image
                            src="/assets/images/(postclips)/landing/instagram.svg"
                            alt="Instagram"
                            width={28}
                            height={28}
                        />
                    </Link>
                </div>
            </div>

            {/* Legal Text */}
            {/* <div className="container mx-auto px-4 text-gray-400 text-xs text-center max-w-4xl footer-text">
                <p className="mb-4">
                    Please read important legal information in our Legal section that applies to your relationship with Stargaze.
                </p>

                <p className="mb-4">
                    All investing involves risk, including the possible loss of money you invest, and past performance does not guarantee future performance. Any historical returns, expected returns or probability projections are hypothetical and may not reflect actual future performance. A balanced portfolio requires different investment strategies. Make sure you understand the risks before investing.
                </p>

                <p className="mb-4">
                    Stargaze is the brand name of Stargaze Tech Inc.
                </p>

                <p className="mb-4">
                    Stargaze Tech Inc. ("Stargaze") is an SEC-registered investment adviser. By using this website, you accept our Terms of Use and our Privacy Policy. SEC Registration does not imply a certain level of skill or training. Nothing on this website should be considered an offer, recommendation, solicitation of an offer, or advice to buy or sell any security. The information provided herein is for informational and general educational purposes only and is not investment or financial advice. Additionally, Stargaze does not provide tax advice, and investors are encouraged to consult with their tax advisors. Please refer to Stargaze's ADV Part 2A (Brochure) for additional details.
                </p>

                <p className="mb-4">
                    Certain services ("Services") offered through our mobile app by Stargaze Tech Inc. are offered only in jurisdictions where it is legal to do so. The availability of the Services over the Internet is not a solicitation for or offering of the Services to any person in any jurisdiction where such solicitation or offer is illegal. We reserve the right to limit the availability of the Services to any person, geographic area, or jurisdiction at any time and at our sole discretion. We make no representation that the Services are appropriate or available for use in locations outside of the United States or that accessing our mobile app is legally permitted in countries or territories where the Services may be illegal. If you access the Services from other locations, you do so at your own risk and are responsible for compliance with local laws.
                </p>

                <p className="mb-4">
                    Diversification and asset allocation do not ensure a profit or guarantee against loss.
                </p>

                <p className="mb-4">
                    Trademarks and logos are the property of their respective owners and do not represent endorsements of any kind. Unless otherwise noted, Stargaze Tech Inc., and it's affiliates are not partners, affiliates, or licensees of these companies.
                </p>

                <p className="mb-4">
                    © {currentYear} Stargaze Tech Inc.<br />
                    11720 Amber Park Dr Suite 160, Alpharetta, GA 30009
                </p>
            </div> */}
        </footer>
    );
}