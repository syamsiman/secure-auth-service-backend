import Cookies from 'js-cookie'
export const getAccessToken = () => {
    const accessToken = Cookies.get("token")
    if (accessToken) {
        return accessToken
    }
    return ""
}