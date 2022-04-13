export default function authHeaderForm() {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { 
      'Access-Control-Allow_Origin' : '*'
      ,'Content-Type' : 'multipart/form-data'
      ,'Authorization' : user.type + ' ' + user.token
    }; 
  } else {
      //window.location.href = "./";
  }
}