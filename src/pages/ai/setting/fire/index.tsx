import RuleList, { RuleListProps } from '../index';

export default function FirePage() {
  const props: RuleListProps = {
    alarmTypeId: '32',
    title: '火焰识别',
  };
  return <RuleList {...props} />;
}
