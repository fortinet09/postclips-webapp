import { MenuItem } from "@/Types/Layout.type";

export const PostClipsMenuList: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-1",
    menucontent: "Dashboards",
    Items: [
      {
        title: "Dashboards",
        id: 1,
        icon: "home",
        type: "sub",
        lanClass: "lan-3",
        children: [
          { path: "/home", title: "Clipper", type: "link", lanClass: "lan-4" },
          { path: "/home", title: "Brand", type: "link", lanClass: "lan-4" },
          { path: "/home", title: "Admin", type: "link", lanClass: "lan-4" },
        ],
      },
    ],
  },
];
