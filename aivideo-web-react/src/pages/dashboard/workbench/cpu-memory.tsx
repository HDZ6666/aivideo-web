import { Card, Typography } from 'antd';

import Chart from '@/components/chart/chart';
import useChart from '@/components/chart/useChart';

export default function CpuMemory() {
  return (
    <Card className="flex-col">
      <header className="flex w-full justify-between self-start">
        <Typography.Title level={5}>CPU 和 内存</Typography.Title>
      </header>
      <main className="w-full">
        <ChartArea />
      </main>
    </Card>
  );
}

function ChartArea() {
  const series = [
    { name: 'cpu', data: [31, 40, 28, 51, 42, 109, 100] },
    { name: '内存', data: [11, 32, 45, 32, 34, 52, 41] },
  ];
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
        formatter: (value: number) => `${value.toFixed(0)}%`,
      },
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  });

  return <Chart type="area" series={series} options={chartOptions} height={320} />;
}
