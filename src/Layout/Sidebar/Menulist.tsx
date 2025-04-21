import { useEffect } from "react";
import SVG from "@/CommonComponent/SVG";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { MenuListType, SidebarItemTypes } from "@/Types/Layout.type";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

const Menulist: React.FC<MenuListType> = ({ menu, setActiveMenu, activeMenu, level, className }) => {
  const { sidebarIconType } = useAppSelector((state) => state.themeCustomizer)

  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("common");

  const ActiveNavLinkUrl = (path?: string, active?: boolean) => {
    return pathname === path ? (active ? active : true) : "";
  };

  const shouldSetActive = ({ item }: SidebarItemTypes) => {
    var returnValue = false;
    if (item?.path === pathname) returnValue = true;
    if (!returnValue && item?.children) {
      item?.children.every((subItem) => {
        returnValue = shouldSetActive({ item: subItem });
        return !returnValue;
      });
    }
    return returnValue;
  };

  useEffect(() => {
    menu?.forEach((item: any) => {
      let gotValue = shouldSetActive({ item });
      if (gotValue) {
        let temp = [...activeMenu];
        temp[level] = (item.title);
        setActiveMenu(temp);
      }
    });
  }, [])

  return (
    <>
      {menu?.map((item, index) => (
        <li key={index} className={`${level === 0 ? "sidebar-list" : ""} ${(item.children ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""} `}>

          <Link
            // className={`${!className && level !== 2 ? "sidebar-link sidebar-title" : ""}  ${(item.children ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "active" : ""}`}
            className={`${!className && level !== 2 ? "sidebar-link sidebar-title" : ""}  ${(item.children ? item.children.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path))}`}
            href={item?.path ? `${item.path}` : ""}
            onClick={() => {
              const temp = activeMenu;
              temp[level] = item.title !== temp[level] ? (item.title) : ''
              setActiveMenu([...temp]);
            }}>
            {item.icon && (
              // <SVG className={`${sidebarIconType}-icon`} iconId={`${sidebarIconType}-${item.icon}`} />
              // <SVG className={`${sidebarIconType}-icon`} iconId={`${item.icon}${ActiveNavLinkUrl(item.path) ? "-active" : ""}`} />
              <SVG className={`${sidebarIconType}-icon`} iconId={`${item.icon}`} />
            )}
            <span className={`text-white ${item.lanClass && item.lanClass}`}>{t(item.title)}</span>
          </Link>
          {item.children && (
            <ul className={`${level !== 0 ? "nav-sub-childmenu submenu-content" : "sidebar-submenu "}`}
              style={{
                display: `${(item.Items
                  ? item.Items.map((innerItem) => ActiveNavLinkUrl(innerItem.path)).includes(true) : ActiveNavLinkUrl(item.path)) || activeMenu[level] === item.title ? "block" : "none"
                  }`
              }}>
              <Menulist menu={item.children} activeMenu={activeMenu} setActiveMenu={setActiveMenu} level={level + 1} className="sidebar-submenu" />
            </ul>
          )}
        </li>
      ))}
    </>
  );
};
export default Menulist;