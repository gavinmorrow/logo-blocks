import './ParamInput.css';
import { ChangeEventHandler, useState } from 'react';

type ParamInputProps = {
  value: string | number;
  setValue: (newValue: string | number) => void;
};
export const ParamInput = ({ value, setValue }: ParamInputProps) => {
  const [tmp, setTmp] = useState(
    typeof value == 'string' ? ':' + value : value,
  );
  const [width, setWidth] = useState(String(tmp).length);
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.target.value;
    setWidth(value.length);
    setTmp(value);

    if (value[0] == ':') {
      // variable
      setValue(value.substring(1));
    } else if (isNaN(Number(value))) {
      setValue(value);
    } else {
      setValue(Number(value));
    }
  };

  return (
    <input
      type="text"
      value={tmp ?? ''}
      onChange={onChange}
      style={{
        border: 'none',
        fontFamily: 'monospace',
        width: `${width}ch`,
      }}
    />
  );
};
