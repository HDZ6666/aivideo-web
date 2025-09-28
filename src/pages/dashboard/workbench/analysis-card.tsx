import Color from 'color';
import { CSSProperties } from 'react';

import glass_bag from '@/assets/images/glass/ic_glass_bag.png';
import glass_buy from '@/assets/images/glass/ic_glass_buy.png';
import glass_message from '@/assets/images/glass/ic_glass_message.png';
import glass_users from '@/assets/images/glass/ic_glass_users.png';
import { useThemeToken } from '@/theme/hooks';

type Props = {
  cover: string;
  subtitle: string;
  title: string;
  style?: CSSProperties;
};

export function TotalDevice() {
  const theme = useThemeToken();
  return (
    <AnalysisCard
      cover={glass_bag}
      title="2000"
      subtitle="设备总数"
      style={{
        color: theme.colorPrimaryTextActive,
        background: `linear-gradient(135deg, ${Color(theme.colorPrimaryActive)
          .alpha(0.2)
          .toString()}, ${Color(theme.colorPrimary).alpha(0.2).toString()}) rgb(255, 255, 255)`,
      }}
    />
  );
}

export function OnlineDevice() {
  const theme = useThemeToken();
  return (
    <AnalysisCard
      cover={glass_users}
      title="500"
      subtitle="在线数量"
      style={{
        color: theme.colorInfoTextActive,
        background: `linear-gradient(135deg, ${Color(theme.colorInfoActive)
          .alpha(0.2)
          .toString()}, ${Color(theme.colorInfo).alpha(0.2).toString()}) rgb(255, 255, 255)`,
      }}
    />
  );
}

export function TodayAlarm() {
  const theme = useThemeToken();
  return (
    <AnalysisCard
      cover={glass_buy}
      title="20"
      subtitle="今日告警"
      style={{
        color: theme.colorWarningTextActive,
        background: `linear-gradient(135deg, ${Color(theme.colorWarningActive)
          .alpha(0.2)
          .toString()}, ${Color(theme.colorWarning).alpha(0.2).toString()}) rgb(255, 255, 255)`,
      }}
    />
  );
}

export function AlarmNoHandle() {
  const theme = useThemeToken();
  return (
    <AnalysisCard
      cover={glass_message}
      title="20"
      subtitle="待处理"
      style={{
        color: theme.colorErrorTextActive,
        background: `linear-gradient(135deg, ${Color(theme.colorErrorActive)
          .alpha(0.2)
          .toString()}, ${Color(theme.colorError).alpha(0.2).toString()}) rgb(255, 255, 255)`,
      }}
    />
  );
}

function AnalysisCard({ cover, subtitle, title, style }: Props) {
  return (
    <div
      className="flex flex-col items-center rounded-2xl py-5"
      style={{
        ...style,
      }}
    >
      <img src={cover} alt="" />
      <span className="text-3xl font-bold">{title}</span>
      <span className="text-sm">{subtitle}</span>
    </div>
  );
}
