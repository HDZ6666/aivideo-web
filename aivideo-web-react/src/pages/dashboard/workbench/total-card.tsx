import { Progress } from 'antd';

import Card from '@/components/card';
import { SvgIcon } from '@/components/icon';
import { useThemeToken } from '@/theme/hooks';

export function NationalDevice() {
  const { colorPrimary } = useThemeToken();
  return <TotalCard title="国标设备" count="18,765" percent={75} strokeColor={colorPrimary} />;
}
export function Channel() {
  const { colorInfo } = useThemeToken();
  return <TotalCard title="通道数量" count="18,765" percent={75} strokeColor={colorInfo} />;
}
export function PushDevice() {
  const { colorWarning } = useThemeToken();
  return <TotalCard title="推流设备" count="18,765" percent={75} strokeColor={colorWarning} />;
}
export function PullDevice() {
  const { colorError } = useThemeToken();
  return <TotalCard title="拉流设备" count="18,765" percent={75} strokeColor={colorError} />;
}

type Props = {
  title: string;
  percent: number;
  count: string;
  strokeColor: string;
};
function TotalCard({ title, count, percent, strokeColor }: Props) {
  const format = (val?: number) => <span style={{ color: strokeColor }}>{val}%</span>;
  return (
    <Card className="h-full w-full">
      <div className="flex-grow">
        <h6 className="text-sm font-medium">{title}</h6>
        <div className="mb-2 mt-4 flex flex-row">
          <SvgIcon icon="ic_rise" size={24} color="rgb(34, 197, 94)" />
          <div className="ml-2">
            <span>在线：{percent}</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold">{count}</h3>
      </div>

      <Progress
        type="circle"
        size={70}
        percent={percent}
        format={format}
        strokeColor={strokeColor}
      />
    </Card>
  );
}
