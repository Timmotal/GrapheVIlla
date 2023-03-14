export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear()

   return userInfo
}

 // so we already used this line in Home jsx, now it's time to turn it into a utility function