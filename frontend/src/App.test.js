import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});


// FB.getLoginStatus(function (response) {
//   statusChangeCallback(response);
// });



// {
//   status: 'connected',
//     authResponse: {
//     accessToken: '...',
//       expiresIn: '...',
//         signedRequest: '...',
//           userID: '...'
//   }
// }




// ]
// <fb:login-button 
//   scope="public_profile,email"
//   onlogin="checkLoginState();">
// </fb:login-button>
// ]



// function checkLoginState() {
//   FB.getLoginStatus(function (response) {
//     statusChangeCallback(response);
//   });
// }