import RuleList, { RuleListProps } from '../index';

export default function SmokingPage() {
  const props: RuleListProps = {
    alarmTypeId: '19',
    title: '抽烟识别',
  };
  return <RuleList {...props} />;
}
