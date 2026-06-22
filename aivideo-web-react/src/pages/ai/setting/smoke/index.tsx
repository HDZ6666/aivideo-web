import RuleList, { RuleListProps } from '../index';

export default function SmokePage() {
  const props: RuleListProps = {
    alarmTypeId: '29',
    title: '烟雾识别',
  };
  return <RuleList {...props} />;
}
