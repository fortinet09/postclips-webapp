import { useRouter } from "next/navigation";
import Image from "next/image";

const Feedback = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/brand/feedback");
    };

    return (
        <li className="onhover-dropdown">
            <div onClick={handleClick} style={{ backgroundColor: "#FFFFFF14", borderRadius: "99px", padding: "12px" }}>
                <Image
                    src="/assets/images/(postclips)/header/help.svg"
                    alt="!"
                    className="next-image-full"
                    width={25}
                    height={25}
                    priority
                />
            </div>
        </li>
    );
};

export default Feedback; 