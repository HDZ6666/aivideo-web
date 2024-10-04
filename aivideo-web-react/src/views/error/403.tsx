import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_URL, Login_URL } from "@/config/config";
import { useTranslation } from "react-i18next";
import { RootState, useSelector } from "@/redux";
import "./index.less";

const NotAuth = () => {
	const { token } = useSelector((state: RootState) => state.user);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const goHome = () => {
		token ? navigate(HOME_URL) : navigate(Login_URL);
	};
	return (
		<Result
			status="403"
			title="403"
			subTitle={t("error.Authorized")}
			extra={
				<Button type="primary" onClick={goHome}>
					{token ? "返回首页" : "登录"}
				</Button>
			}
		/>
	);
};

export default NotAuth;
