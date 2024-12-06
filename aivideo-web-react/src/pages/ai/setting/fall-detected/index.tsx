import RuleList, { RuleListProps } from '../index';

export default function FallDetectedPage() {
  const props: RuleListProps = {
    alarmTypeId: '35',
    title: '摔倒识别',
  };
  return <RuleList {...props} />;
}
