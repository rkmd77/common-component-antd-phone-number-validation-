import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, Form } from 'antd'
import { AsYouType, parsePhoneNumberFromString } from 'libphonenumber-js'
import { numberOnly } from '../../utils/actionHelperFunctions'
import CallingCodeSelecter from './CallingCodeSelecter'

const propTypes = {
  countries: PropTypes.array.isRequired,
  phone: PropTypes.any,
  onPhoneChange: PropTypes.func.isRequired,
  formItemLayout: PropTypes.object,
  disabled: PropTypes.any,
  required: PropTypes.bool,
  showLabel: PropTypes.bool, // showLabel={false} if the lable not required
  onPhoneReset: PropTypes.bool,
}

function PhoneFormItem(props) {
  const [phone_help, setPhone_help] = useState('')
  const [phone_status, setPhone_status] = useState('')
  const [calling_code, setCalling_code] = useState('+64')
  const [country_code, setCountry_code] = useState('NZ')
  let phoneValidate = false

  const { phone, disabled, required, showLabel, countries } = props

  useEffect(() => {
    if(phone.phoneValidate && phone.phone_number.length>0){
      setPhone_status('success')
    }
    else{
      if(phone.phone_number.length>0){
        setPhone_status('error')
      }
      else{
        setPhone_status('')
      }
    }
  })

  const onPhoneValidate = (phone_number) => {
    let propsPhoneNumber = phone_number?phone_number.replace(/\s+/g,'').replace(/\b(0+)/gi,''):''
    if(propsPhoneNumber && propsPhoneNumber.length>0){
      const asYouType = new AsYouType(country_code)
      asYouType.input(propsPhoneNumber)
      const output = asYouType.getNumber().number
      const phoneNumberObj = parsePhoneNumberFromString(output)
      const validated = phoneNumberObj?phoneNumberObj.isValid():false
      if(!validated){
        setPhone_help('Phone number invalid')
        setPhone_status('error')
        phoneValidate= false
      }
      else{
        setPhone_help('')
        setPhone_status('success')
        phoneValidate = true
      }
    }
    else{
      setPhone_help('')
      setPhone_status('')
      phoneValidate= false
    }
  }

  const onPhoneChange = (e) => {
    const phone_number = numberOnly(e.target.value)
    onPhoneValidate(phone_number)
    props.onPhoneChange(phone_number, calling_code, country_code, phoneValidate)
  }


  const onCallingCodeChange = (e) => {
    setPhone_help('')
    setPhone_status('')
    props.onPhoneChange('')
    if(e){
      setCalling_code('+'+e.key.split('+')[1])
      setCountry_code(e.key.split('+')[0].trim())
    }
  }

  const selectBefore = (
    <CallingCodeSelecter onCallingCodeChange={onCallingCodeChange} calling_code={calling_code} disabled={disabled} countries={countries} />
  )

  const onReset = () => {
    if(props.onPhoneReset){
      setPhone_help('')
      setPhone_status('')
      setCalling_code('+64')
      setCountry_code('NZ')
    }
  }
  useEffect(() => {
    onReset()
  },[props.onPhoneReset])// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Form.Item
      {...props.formItemLayout}
      label={showLabel===false?'':'Phone'}
      hasFeedback
      required={required}
      help={phone_help}
      validateStatus={phone_status}
    >
      <Input
        addonBefore={selectBefore}
        onChange={onPhoneChange}
        value={phone.phone_number}
        name='phone' placeholder='Input phone'
        disabled={disabled}
      />
    </Form.Item>
  )
}
PhoneFormItem.propTypes = propTypes
export default PhoneFormItem