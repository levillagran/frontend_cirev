export default function authHeader() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return {
      'Access-Control-Allow_Origin': '*'
      , 'Content-Type': 'application/json'
      , 'Authorization': user.type + ' ' + user.token
    }; // for Spring Boot back-end
    // return { 'x-access-token': user.accessToken };       // for Node.js Express back-end
  } else {
    //window.location.href = "./";
  }
}