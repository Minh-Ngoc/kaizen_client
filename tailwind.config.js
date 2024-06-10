/** @type {import("tailwindcss").Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        "task-icon": "#44546f",
        "task-title": "#505f79",
        "task-label": "#164B35",
        "isChecked": "#acafb5",
      },
      backgroundImage: {
        auth: "linear-gradient(135deg, #3e95ed 0%, #243b4f 100%)",
        admin: "url('assets/img/bg-ad.jpg')",
        // "card-project":
        //   "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.49) 76.65%)",
        "card-project-hover":
          "linear-gradient(127.09deg, rgba(6, 11, 40, 0.54) 19.41%, rgba(10, 14, 35, 0.39) 76.65%)",
        modal: "linear-gradient(127.09deg, rgba(6, 11, 40, 0.94) 19.41%, rgba(10, 14, 35, 0.89) 76.65%)",
      },
      backgroundColor: {
        "card-kanban": "rgb(241, 242, 244)",
        "btn-detail": "rgba(228, 230, 234, 0.6)",
        "btn-detail-hover": "#091e4224",
        success: "#1f845a",
        table: "#060c2478",
        "card-project": "#060c2478",
      },
      boxShadow: {
        "card-project":
          "rgba(255, 255, 255, 0.3) 0px 6px 10px 0px, rgba(255, 255, 255, 0.2) 0px 0px 0px 1px",
        input:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        "input-modal": "0 0 0 0.5px rgb(49,130,206)",
        comment: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
        wrapper: "rgb(62 98 143) 0px 0px 0px 1px, rgb(255 255 255 / 21%) 0px 1px 1px -0.5px, rgb(255 255 255 / 12%) 0px 3px 3px -1.5px, rgb(255 255 255 / 4%) 0px 6px 6px -3px, rgb(255 255 255 / 1%) 0px 12px 12px -6px, rgb(239 239 239 / 4%) 0px 24px 24px -12px"
        // wrapper: "rgb(255 255 255) 0px 1px 3px, rgb(161 161 161 / 5%) 0px 1px 2px"
      },
      maxWidth: {
        "task-label": "90%",
        "board": "calc(100% - 24px)",
        "progress": "calc(100% - 48px)",
        "item-checklist": "calc(100% - 44px)",
        "1/3": "calc(100% / 3)"
      },
      height: {
        "skeleton-sidebar": "calc(100vh - 16px)",
        "skeleton-content": "calc(100vh - 72px - 48px - 16px)"
      },
      maxHeight: {
        "sidebar-list": "calc(100vh - 16px - 280px)",
        "skeleton-sidebar": "calc(100vh - 16px)",
        "skeleton-content": "calc(100vh - 72px - 48px - 16px)"
      }
    },
  },
  plugins: [nextui()],
};
