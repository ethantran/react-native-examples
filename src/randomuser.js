import randomboolean from './randomboolean'
import randomnumber from './randomnumber'

export default function (size = 'thumb') {
    const gender = randomboolean() ? 'men': 'women'
    const number = Math.floor(randomnumber(0, 100))
    return `https://randomuser.me/api/portraits/${size}/${gender}/${number}.jpg`
}