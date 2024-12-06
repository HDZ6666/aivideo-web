import RuleList, { RuleListProps } from '../index';

export default function FencePage() {
  const props: RuleListProps = {
    alarmTypeId: '16',
    title: '电子围栏',
  };
  return <RuleList {...props} />;
}
