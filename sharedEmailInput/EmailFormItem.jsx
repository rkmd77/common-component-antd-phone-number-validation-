import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Input, Form } from 'antd'
import {Validation} from 'lc-web-lib'

const propTypes = {
  email: PropTypes.any,
  onEmailChange: PropTypes.func.isRequired,
  formItemLayout: PropTypes.object,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  showLabel: PropTypes.bool,  // showLabel={false} if the lable not required
}

function EmailFormItem(props) {
  const [email_help, setEmail_help] = useState('')
  const [email_status, setEmail_status] = useState('')
  let emailValidate = false

  const { email, disabled, required, showLabel } = props

  useEffect(() => {
    if(email.emailValidate && email.email_address.length>0){
      setEmail_status('success')
    }
    else{
      if(email.email_address.length>0){
        setEmail_status('error')
      }
      else{
        setEmail_status('')
      }
    }
  })

  const onEmailValidate = (email_address) => {
    let propsEmail = email_address?Validation.validateEmail(email_address):''
    if(email_address && email_address.length>0){
      if(propsEmail){
        setEmail_help('')
        setEmail_status('success')
        emailValidate = true
      }
      else{
        setEmail_help('Email invalid')
        setEmail_status('error')
        emailValidate = false
      }
    }
    else{
      setEmail_help('')
      setEmail_status('')
      emailValidate = false
    }
  }


  const onEmailChange = (e) => {
    const email_address = e.target.value
    onEmailValidate(email_address)
    props.onEmailChange(email_address, emailValidate)
  }

  return (
    <Form.Item
      {...props.formItemLayout}
      label={showLabel===false?'':'Email'}
      hasFeedback
      required={required}
      help={email_help}
      validateStatus={email_status}
    >
      <Input
        onChange={onEmailChange}
        value={email.email_address}
        name='email' placeholder='Input email'
        disabled={disabled}
      />
    </Form.Item>
  )
}
EmailFormItem.propTypes = propTypes
export default EmailFormItem