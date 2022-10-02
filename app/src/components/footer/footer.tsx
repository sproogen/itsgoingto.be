import React from 'react'
import JWGMediaImage from './assets/jwgmedia.png'
import './footer.scss'

const Footer = (): React.ReactElement => (
  <div className="footer-container">
    <div className="footer">
      <span className="contact">
        <a href="mailto:itsgoingtobe@jameswgrant.co.uk" target="_top">itsgoingtobe@jameswgrant.co.uk</a>
      </span>
      <span className="jwg_logo">
        <a href="https://www.jameswgrant.co.uk" target="_blank" rel="noopener noreferrer">
          <img src={JWGMediaImage} alt="JWGMedia logo" />
        </a>
      </span>
    </div>
  </div>
)

export default Footer
