import Layout from "@/layouts/index";
import BlankLayout from "@/layouts/BlankLayout";
// 懒加载 Layout
// import React from "react";
// import lazyLoad from "@/routers/util/lazyLoad";
// const Layout = lazyLoad(React.lazy(() => import("@/layouts/index")));

/**
 * @description: default layout
 */
export const LayoutIndex = () => <Layout />;
export const BlankLayoutIndex = () => <BlankLayout />;
