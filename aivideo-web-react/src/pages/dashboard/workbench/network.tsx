import { Card, Typography } from 'antd';

import Chart from '@/components/chart/chart';
import useChart from '@/components/chart/useChart';

export default function Network() {
  return (
    <Card className="flex-col">
      <header className="flex w-full justify-between self-start">
        <Typography.Title level={5}>网络</Typography.Title>
      </header>
      <main className="w-full">
        <ChartArea />
      </main>
    </Card>
  );
}

const series = [
  { name: '上传', data: [12, 40, 23, 51, 54, 109, 100] },
  { name: '下载', data: [30, 5, 44, 4, 41, 33, 41] },
];
function ChartArea() {
  const chartOptions = useChart({
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-19T01:30:00.000Z',
        '2018-09-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-09-19T04:30:00.000Z',
        '2018-09-19T05:30:00.000Z',
        '2018-09-19T06:30:00.000Z',
      ],
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value.toFixed(0)}Mbps`,
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  });

  return <Chart type="line" series={series} options={chartOptions} height={320} />;
}
