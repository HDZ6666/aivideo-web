import RuleList, { RuleListProps } from '../index';

export default function PersonPage() {
  const props: RuleListProps = {
    alarmTypeId: '33',
    title: '行人识别',
  };
  return <RuleList {...props} />;
}
