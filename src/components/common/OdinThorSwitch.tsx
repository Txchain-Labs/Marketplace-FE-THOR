import Toggle from '@/components/common/Toggle';

export default function OdinThorSwitch({
  driftODINorTHOR,
  setDriftODINorTHOR,
}: // sx,
{
  driftODINorTHOR: any;
  setDriftODINorTHOR?: (isODINorTHOR: string) => void;
  // sx: any;
}) {
  const handleChange = (value: string) => {
    setDriftODINorTHOR(value);
  };

  return (
    <Toggle
      options={['ODIN', 'THOR']}
      value={driftODINorTHOR}
      onChange={handleChange}
    />
  );
}
