import randomBoolean from './randomBoolean';
import randomNumber from './randomNumber';

export default function (size) {
    const gender = randomBoolean() ? 'men' : 'women';
    const number = Math.floor(randomNumber(0, 100));
    if (!size) {
        return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
    }
    return `https://randomuser.me/api/portraits/${size}/${gender}/${number}.jpg`;
}
