import { Href, ImagePath } from "@/Constant";
import { userProfileData } from "@/Data/Layout/Header";
import { useAuth } from "@/Providers/SessionProvider";
import { supabase } from "@/Clients/supabase/SupabaseClient";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "react-feather";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const { user, selectedRole } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
    supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <li className="profile-nav onhover-dropdown p-0">
      <div className="d-flex align-items-center profile-media">
        <Image
          className="b-r-10 img-40 img-fluid"
          width={40}
          height={40}
          src={user?.avatar || `${ImagePath}/dashboard/profile.png`}
          alt=""
        />
        <div className="flex-grow-1">
          <span>{user?.email || "Unknown"}</span>
          {selectedRole && (
            <p className="mb-0">{selectedRole || "Clipper"}</p>
          )}
        </div>
      </div>
      <ul className="profile-dropdown onhover-show-div">
        {userProfileData.map((item, index) => (
          <li key={index}>
            <Link href={`/${item.link}`}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          </li>
        ))}
        <li onClick={handleLogout}>
          <LogOut />
          <span>{"Log out"}</span>
        </li>
      </ul>
    </li>
  );
};
export default UserProfile;
