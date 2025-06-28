import './ParamInput.css';
import { ChangeEventHandler, useState } from 'react';

type ParamInputProps = {
  value: number;
  setValue: (newValue: number) => void;
};
export const ParamInput = ({ value, setValue }: ParamInputProps) => {
  const [tmpVal, setTmpVal] = useState(String(value));

  // lowk idk exactly why this works but it does have the desired behavior so.
  // have fun fixing it!

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.validity.valid) return;

    let val = e.target.value;
    setTmpVal(val);

    let newValue = Number(val);
    if (isNaN(newValue)) return;

    if (val !== '') setTmpVal(String(newValue));
    setValue(newValue);
  };

  const onBlur = () => {
    let newValue = Number(tmpVal);
    if (isNaN(newValue)) newValue = value;

    setTmpVal(String(newValue));
    setValue(newValue);
  };

  return (
    <input
      type="number"
      value={tmpVal}
      onChange={onChange}
      onBlur={onBlur}
      style={{ border: 'none', fontFamily: 'monospace', width: '5.5ch' }}
    />
  );
};
