export function getToken() {
  //TODO replace this with logic to get the jwt. For now just going to store the username in memory
  return localStorage.getItem('username')
}

export function isLoggedIn() {
  const token = getToken()
  console.log('Token ' + token)
  if (!token) return false

  //TODO add logic to decode the token?
  console.log('loggedin')
  return true
}
