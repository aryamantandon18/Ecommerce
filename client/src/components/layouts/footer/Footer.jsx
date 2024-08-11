import React from 'react'
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/Appstore.png';
import './footer.scss'

const Footer = () => {
  return (
   <footer id='footer'>
   <div className='leftFooter'>
   <h4>Download Our App</h4>
   <p>Download App for Android and IOS mobile phone</p>
   <img src={playStore} alt="playstore" />
    <img src={appStore} alt="Appstore" />
   </div>
   <div className="midFooter">
   <h1>ECOMMERCE.</h1>
    <p>High Quality is our first priority</p>

    <p>Copyrights 2024 &copy; Aryaman</p>
    <p>Testing Credentials: <br/>
        **email** :  test@gmail.com <br/>
        **password** :  password
    </p>
   </div>
   <div className="rightFooter">
   <h4>Follow Us</h4>
        <a href="#">Instagram</a>
        <a href="#">Youtube</a>
        <a href="#">Facebook</a>
   </div>
   </footer>
  )
}

export default Footer





// import React from 'react'
// import logo from '../../../images/logo.png'
// import {ReactNavbar} from "overlay-navbar";

// const options = {
//     burgerColorHover: "#eb4034",
//     logo,
//     logoWidth: "20vmax",
//     navColor1: "white",
//     logoHoverSize: "10px",
//     logoHoverColor: "#eb4034",
//     link1Text: "Home",
//     link2Text: "Products",
//     link3Text: "Contact",
//     link4Text: "About",
//     link1Url: "/",
//     link2Url: "/products",
//     link3Url: "/contact",
//     link4Url: "/about",
//     link1Size: "1.3vmax",
//     link1Color: "rgba(35, 35, 35,0.8)",
//     nav1justifyContent: "flex-end",
//     nav2justifyContent: "flex-end",
//     nav3justifyContent: "flex-start",
//     nav4justifyContent: "flex-start",
//     link1ColorHover: "#eb4034",
//     link1Margin: "1vmax",
//     profileIconUrl: "/login",
//     profileIconColor: "rgba(35, 35, 35,0.8)",
//     searchIconColor: "rgba(35, 35, 35,0.8)",
//     cartIconColor: "rgba(35, 35, 35,0.8)",
//     profileIconColorHover: "#eb4034",
//     searchIconColorHover: "#eb4034",
//     cartIconColorHover: "#eb4034",
//     cartIconMargin: "1vmax",
//   };
// const Header = () => {
//   return (
//    <ReactNavbar {...options}/>
//   )
// }

// export default Header