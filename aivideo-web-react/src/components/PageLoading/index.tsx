import React, { useEffect } from "react";
import NProgress from "@/config/nprogress";

const PageLoading: React.FC<{}> = () => {
	useEffect(() => {
		NProgress.start();
		return () => {
			NProgress.done();
		};
	});
	return <React.Fragment />;
};

export default PageLoading;
