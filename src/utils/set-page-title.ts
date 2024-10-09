import config from "@/config/constants";

export default function setPageTitle(routerTitle?: string): void {
  window.document.title = routerTitle
    ? `${routerTitle} | ${config.pageDefaultTitle}`
    : `${config.pageDefaultTitle}`;
}
