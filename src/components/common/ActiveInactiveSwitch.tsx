import Toggle from '@/components/common/Toggle';

export default function ActiveInactiveSwitch({
  isActivated,
  activateNodeHandler,
  tokenId,
}: {
  isActivated: any;
  tokenId?: number;
  activateNodeHandler?: (tokenId: number) => void;
}) {
  const handleChange = () => {
    activateNodeHandler(tokenId);
  };

  return (
    <Toggle
      options={['ACTIVE', 'INACTIVE']}
      value={isActivated ? 'ACTIVE' : 'INACTIVE'}
      onChange={handleChange}
    />
  );
}
