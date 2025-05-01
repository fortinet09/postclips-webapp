import { useAppSelector } from "@/Redux/Hooks";
import { Fragment, useState, useEffect } from "react";
import {
  PostClipsMenuListAdmin,
  PostClipsMenuListBrand,
  PostClipsMenuListClipper,
} from "@/Data/Layout/PostClipsMenu";
import { MenuList } from "@/Data/Layout/Menu";

import { MenuItem } from "@/Types/Layout.type";
import Menulist from "./Menulist";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/Providers/SessionProvider";

const SidebarMenuList = () => {
  const [activeMenu, setActiveMenu] = useState([]);
  const { selectedRole, loading } = useAuth();

  let menuList;
  if (loading) {
    return null; // or a loading spinner if you prefer
  }

  if (selectedRole === "ADMIN") {
    menuList = PostClipsMenuListAdmin;
  } else if (selectedRole === "BRAND") {
    menuList = PostClipsMenuListBrand;
  } else if (selectedRole === "CLIPPER") {
    menuList = PostClipsMenuListClipper;
  }

  return (
    <>
      {menuList &&
        menuList.map((mainMenu: MenuItem, index) => (
          <Fragment key={index}>
            {/* <li className={`sidebar-main-title ${shouldHideMenu(mainMenu) ? "d-none" : ""}`}>
              <div>
                <h6 className={mainMenu.lanClass ? mainMenu.lanClass : ""}>{t(mainMenu.title)}</h6>
              </div>
            </li> */}
            <Menulist
              menu={mainMenu.Items}
              activeMenu={activeMenu}
              setActiveMenu={setActiveMenu}
              level={0}
            />
          </Fragment>
        ))}
    </>
  );
};
export default SidebarMenuList;
