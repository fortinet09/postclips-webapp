import { useAppSelector } from "@/Redux/Hooks";
import { Fragment, useState } from "react";
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
  const { pinedMenu } = useAppSelector((state) => state.layout);
  const shouldHideMenu = (mainMenu: MenuItem) => {
    return mainMenu?.Items?.map((data) => data.title).every((titles) =>
      pinedMenu.includes(titles || "")
    );
  };
  const { t } = useTranslation("common");
  const { selectedRole } = useAuth(); // Get userRole from context

  let menuList;
  console.log({ selectedRole });
  if (selectedRole === "ADMIN") {
    menuList = PostClipsMenuListAdmin;
  } else if (selectedRole === "BRAND") {
    menuList = PostClipsMenuListBrand;
  } else if (selectedRole === "CLIPPER") {
    menuList = PostClipsMenuListClipper;
  }

  console.log({menuList});

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
