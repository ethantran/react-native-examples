import randomboolean from './randomboolean'
import randomnumber from './randomnumber'

export default function (size) {
    const gender = randomboolean() ? 'men': 'women'
    const number = Math.floor(randomnumber(0, 100))
    if (!size) {
        return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`
    }
    return `https://randomuser.me/api/portraits/${size}/${gender}/${number}.jpg`
}