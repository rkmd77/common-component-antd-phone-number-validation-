import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'
const { Option, OptGroup } = Select

const propTypes = {
  countries: PropTypes.array.isRequired,
  calling_code: PropTypes.string.isRequired,
  onCallingCodeChange: PropTypes.func.isRequired,
  disabled: PropTypes.any,
}

function CallingCodeSelecter(props) {

  let filtedCountryList = []
  if (props.countries && props.countries.length > 0) {
    filtedCountryList = props.countries.filter(v => {
      return v.country_name !== 'Australia' && v.country_name !== 'New Zealand' && v.country_name !== 'United States'
    })
  }
  return (
    <Select
      showSearch
      labelInValue
      style={{ minWidth: '100px' }}
      optionFilterProp="children"
      onChange={props.onCallingCodeChange}
      disabled={props.disabled}
      defaultValue={{ key: '+64' }}
      value = {{key: props.calling_code||'+64'}}
      filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
    >
      <OptGroup label="Default">
        <Option value="NZ +64">NZ +64</Option>
        <Option value="AU +61">AU +61</Option>
        <Option value="US +1">US +1</Option>
      </OptGroup>
      <OptGroup label="All">
        {
          filtedCountryList.length > 0 ?
            filtedCountryList.map(item => {
              return (
                <Option value={item.country_code+' +'+item.calling_code} key={item.geoname_id}>{item.country_code+' +'+item.calling_code}</Option>
              )
            }) : null
        }
      </OptGroup>
    </Select>
  )
}

CallingCodeSelecter.propTypes = propTypes
export default CallingCodeSelecter