import { Card, Typography } from 'antd';

import Chart from '@/components/chart/chart';
import useChart from '@/components/chart/useChart';

export default function Nodes() {
  return (
    <Card className="flex-col">
      <header className="flex w-full justify-between self-start">
        <Typography.Title level={5}>节点</Typography.Title>
      </header>
      <main className="w-full">
        <ChartColumnSingle />
      </main>
    </Card>
  );
}

function ChartColumnSingle() {
  const series = [{ name: 'Net Profit', data: [44, 55, 57, 56] }];
  const chartOptions = useChart({
    plotOptions: {
      bar: {
        columnWidth: '30%',
        distributed: true,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ['直播推流', '拉流代理', '国标收流', '国标推流'],
    },
    tooltip: {
      y: {
        formatter: (value: number) => `$ ${value} `,
      },
    },
  });

  return <Chart type="bar" series={series} options={chartOptions} height={320} />;
}
