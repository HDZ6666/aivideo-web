import { Card, Typography } from 'antd';

import Chart from '@/components/chart/chart';
import useChart from '@/components/chart/useChart';

export default function Disk() {
  return (
    <Card className="flex-col">
      <header className="flex w-full justify-between self-start">
        <Typography.Title level={5}>磁盘占用</Typography.Title>
      </header>
      <main className="w-full">
        <ChartBar />
      </main>
    </Card>
  );
}

function ChartBar() {
  const series = [
    {
      name: '剩余',
      data: [44, 55],
    },
    {
      name: '已使用',
      data: [13, 23],
    },
  ];
  const chartOptions = useChart({
    stroke: { show: false },
    chart: {
      stacked: true,
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: '30%' },
    },
    xaxis: {
      categories: ['/', '/home'],
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value}GB `,
      },
    },
  });

  return <Chart type="bar" series={series} options={chartOptions} height={320} />;
}
