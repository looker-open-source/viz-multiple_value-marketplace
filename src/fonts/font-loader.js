import { createGlobalStyle } from 'styled-components'
import roboto from "./roboto-v20-latin-regular.woff2"


export default createGlobalStyle`
  @import url(//fonts.googleapis.com/earlyaccess/notosansjapanese.css);
  @font-face {
    font-family: "Roboto";
    src:  local('Roboto') 
          url(${roboto}) format("woff2");
  }
`