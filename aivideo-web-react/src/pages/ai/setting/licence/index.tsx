import RuleList, { RuleListProps } from '../index';

export default function LicencePage() {
  const props: RuleListProps = {
    alarmTypeId: '34',
    title: '车牌识别',
  };
  return <RuleList {...props} />;
}
