import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL, Login_URL } from "@/config/config";
import { useTranslation } from "react-i18next";
import { RootState, useSelector } from "@/redux";
import "./index.less";

const NotNetwork = () => {
	const { token } = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const goHome = () => {
		token ? navigate(HOME_URL) : navigate(Login_URL);
	};
	return (
		<Result
			status="500"
			title="500"
			subTitle={t("error.busy")}
			extra={
				<Button type="primary" onClick={goHome}>
					{token ? "返回首页" : "登录"}
				</Button>
			}
		/>
	);
};

export default NotNetwork;
