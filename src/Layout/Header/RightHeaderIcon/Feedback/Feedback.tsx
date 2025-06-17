import { useRouter } from "next/navigation";
import Image from "next/image";

const Feedback = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push("/brand/feedback");
    };

    return (
        <li className="onhover-dropdown">
            <div onClick={handleClick}>
                <Image
                    src="/assets/images/(postclips)/header/help.svg"
                    alt="!"
                    className="next-image-full"
                    width={18}
                    height={18}
                    priority
                />
            </div>
        </li>
    );
};

export default Feedback; 