import React from 'react'

export default class Adsense extends React.Component {
  componentDidMount() {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }

  render() {
    const container = {
      display: 'block',
      maxWidth: 970,
      margin: '0 auto .5rem auto'
    }
    return (
      <div style={container}>
        <ins
          className='adsbygoogle'
          data-ad-client='ca-pub-5633529273423665'
          data-ad-slot='1882412178'
          data-ad-format='auto'
        />
      </div>
    )
  }
}