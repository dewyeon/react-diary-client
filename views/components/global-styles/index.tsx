import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  html,
  body {
    width : 100%;
    height: 100%;
    background-color: #EEEEEE;
  }

  button {
    cursor: pointer;
    background-color: none;
  }

  button:focus {
    outline: none;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }


  /* Events On Calendar */
  .goodMood {
    background-image: url('/good.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .sosoMood {
    background-image: url('/soso.png');
    background-size: contain;
    background-repeat: no-repeat;
  }
  .sadMood {
    background-image: url('/sad.png');
    background-size: contain;
    background-repeat: no-repeat;
  }

  /* OVERRIDE @fullcalendar */
  .fc-daygrid-day-events:before {
    content:none;
  }

  .fc-daygrid-day-events {
    display: grid;
    padding: 0;
    
    grid-template-rows: repeat(3, 30px);
    grid-template-columns: repeat(3, 30px);
    direction: rtl;
  
    @media only screen and (max-width: 1200px) {
      grid-template-rows: repeat(2, 30px);
      grid-template-columns: repeat(2, 30px);
    }
  }

  .fc-toolbar-chunk{
    display: flex;
  }


`;

export default GlobalStyles;
