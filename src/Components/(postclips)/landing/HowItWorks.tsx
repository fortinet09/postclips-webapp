
type Step = {
    id: string;
    title: string;
    description: string;
    highlight: string;
    highlightColor1: string;
    highlightColor2?: string;
};

const stepsClipper: Step[] = [
    {
        id: "step-1",
        title: "Watch YOUR Favorite Networks",
        description:
            "Browse top content from major networks—Just pick your show or movie & watch right inside our app",
        highlight: "YOUR",
        highlightColor1: "#00E7FF"
    },
    {
        id: "step-2",
        title: "Clip YOUR Favorite Moments",
        description:
            "Select the scenes that will go viral—anything interesting, intense, or meme-worthy",
        highlight: "YOUR",
        highlightColor1: "#75A4FF"
    },
    {
        id: "step-3",
        title: "Post YOUR Clips",
        description:
            "Instantly Post to TikTok, Instagram, Facebook, X (Twitter), and YouTube Shorts all from one place",
        highlight: "YOUR",
        highlightColor1: "#00E7FF",
        highlightColor2: "#003FDD"
    },
    {
        id: "step-4",
        title: "YOU Get Paid!",
        description:
            "Get paid for every 1,000 views you get—the more views, the more you earn!",
        highlight: "YOU",
        highlightColor1: "#00E7FF",
        highlightColor2: "#003FDD"
    },
];

// Define network steps data based on the image
const stepsNetwork = [
    {
        id: "step-1",
        title: "DESIGN the Accounts",
        description:
            "Choose the username, bio, link in bio, and profile pictures for every account",
        highlight: "DESIGN",
    },
    {
        id: "step-2",
        title: "CUSTOMIZE your clips",
        description:
            "Control every detail— Pick the caption, add your logo, show name, and outro for every post",
        highlight: "CUSTOMIZE",
    },
    {
        id: "step-3",
        title: "APPROVE or REJECT Every Clip Submitted",
        description:
            "Total control—nothing goes live without your sign-off",
        highlight: "APPROVE",
    },
    {
        id: "step-4",
        title: "GET UP to Billions of Views",
        description:
            "Let our clippers push content across thousands of accounts",
        highlight: "GET UP",
    },
    {
        id: "step-5",
        title: "Up to 10,000 Accounts Analytics All in 1 Place",
        description:
            "[placeholder description]",
        highlight: "Up to",
    },
];


export const HowItWorks: React.FC = () => {

    function highlightTitle(
        text: string,
        highlight: string,
        color1: string,
        color2?: string
    ): React.ReactNode {
        const regex = new RegExp(`(${highlight})`, "gi");

        const parts = [];
        let lastIndex = 0;

        text.replace(regex, (match, _, offset) => {
            if (lastIndex < offset) {
                parts.push(<span key={lastIndex}>{text.slice(lastIndex, offset)}</span>);
            }

            const key = `highlight-${offset}`;

            if (color2) {
                parts.push(
                    <span
                        key={offset}
                        style={{
                            position: "relative",
                            display: "inline-block",
                            fontWeight: 700,
                            margin: "0 0.25ch", // ensures spacing before/after
                        }}
                    >
                        <span style={{ opacity: 0 }}>{match}</span>
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                background: `linear-gradient(to right, ${color1}, ${color2})`,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {match}
                        </span>
                    </span>
                );

            } else {
                parts.push(
                    <span
                        key={offset}
                        style={{
                            color: color1,
                            fontWeight: 700,
                            margin: "0 0.25ch",
                        }}
                    >
                        {match}
                    </span>
                );
            }

            lastIndex = offset + match.length;
            return match;
        });

        if (lastIndex < text.length) {
            parts.push(<span key={lastIndex}>{" "}{text.slice(lastIndex)}{" "}</span>);
        }

        return parts;
    }




    return (
        <>
            <section className="howitworks_section">
                <div className="howitworks_scrollWrapper">
                    {/* Desktop video only */}
                    <div className="howitworks_videoColumn desktop-only">
                        <video
                            src="/assets/images/(postclips)/landing/how-it-works.mp4"
                            autoPlay
                            muted
                            loop
                            className="howitworks_video"
                        />
                    </div>

                    <div className="howitworks_textColumn">
                        <div className="howitworks_content">
                            {stepsClipper.map((step, index) => (
                                <div className="howitworks_step" key={step.id}>
                                    {index === 0 && (
                                        <div className="howitworks_title">How it works</div>
                                    )}
                                    <h2>
                                        {highlightTitle(
                                            step.title,
                                            step.highlight,
                                            step.highlightColor1,
                                            step.highlightColor2
                                        )}
                                    </h2>
                                    <p>{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile video only */}
            </section>

            <div className="howitworks_videoMobile mobile-only">
                <video
                    src="/assets/images/(postclips)/landing/how-it-works.mp4"
                    autoPlay
                    muted
                    loop
                    className="howitworks_video"
                />
            </div>
        </>
    );
};