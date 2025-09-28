import RuleList, { RuleListProps } from '../index';

export default function MaskPage() {
  const props: RuleListProps = {
    alarmTypeId: '10',
    title: '口罩识别',
  };
  return <RuleList {...props} />;
}
