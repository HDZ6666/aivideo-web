import RuleList, { RuleListProps } from '../index';

export default function FencePage() {
  const props: RuleListProps = {
    alarmTypeId: '15',
    title: '垃圾识别',
  };
  return <RuleList {...props} />;
}
