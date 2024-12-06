import RuleList, { RuleListProps } from '../index';

export default function HardhatsPage() {
  const props: RuleListProps = {
    alarmTypeId: '9',
    title: '安全帽识别',
  };
  return <RuleList {...props} />;
}
