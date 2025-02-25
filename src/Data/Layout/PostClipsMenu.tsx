import { MenuItem } from "@/Types/Layout.type";

export const PostClipsMenuListAdmin: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-1",
    menucontent: "Dashboards",
    Items: [
      {
        path: "/home",
        icon: "home",
        type: "link",
        title: "Dashboard",
        id: 1,
      },
      {
        path: "/users",
        icon: "bookmark",
        type: "link",
        title: "Users",
        id: 2,
      },
    ],
  },
];

export const PostClipsMenuListBrand: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-1",
    menucontent: "Dashboards",
    Items: [
      {
        path: "/home",
        icon: "home",
        type: "link",
        title: "Dashboard",
        id: 1,
      },
      {
        path: "/campaigns",
        icon: "bookmark",
        type: "link",
        title: "Campaigns",
        id: 2,
      },
    ],
  },
];

export const PostClipsMenuListClipper: MenuItem[] | undefined = [
  {
    title: "General",
    lanClass: "lan-1",
    menucontent: "Dashboards",
    Items: [
      {
        path: "/home",
        icon: "home",
        type: "link",
        title: "Dashboard",
        id: 1,
      },
      {
        path: "/clips",
        icon: "bookmark",
        type: "link",
        title: "Clips",
        id: 2,
      },
    ],
  },
];
