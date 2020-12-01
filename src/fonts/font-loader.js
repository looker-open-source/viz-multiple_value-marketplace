import { createGlobalStyle } from 'styled-components'
import roboto from "./roboto-v20-latin-regular.woff2"
//import notoSansJP from "./noto-sans-jp-v28-japanese-regular.woff2"

export default createGlobalStyle`
  @import url(//fonts.googleapis.com/earlyaccess/notosansjapanese.css); 
  @font-face {
    font-family: "Roboto";
    src:  local('Roboto') 
          url(${roboto}) format("woff2");
  }
`
// @font-face {
//   font-family: "Noto Sans JP";
//   src:  local('Noto Sans JP') 
//         url(//fonts.googleapis.com/earlyaccess/notosansjapanese.css);
// }
//url(${notoSansJP}) format("woff2");