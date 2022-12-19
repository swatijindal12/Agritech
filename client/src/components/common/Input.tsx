import React from 'react';
import '../../sass/common/input.scss';

// Input box component 
const Input = (props: any) => {
  const {type,placeholder,maxLength} = props;
  return (
    <div className='input-field_wrapper'>
      <input className='input-field' type={type} placeholder={placeholder} maxLength={maxLength?maxLength:5}/>
    </div>
  )
}

export default Input
