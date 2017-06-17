function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getRandomBoolean() {
    return Math.random() >= 0.5
}

export default function (size = 'thumb') {
    const gender = getRandomBoolean() ? 'men': 'women'
    const number = Math.floor(getRandomArbitrary(0, 100))
    return `https://randomuser.me/api/portraits/${size}/${gender}/${number}.jpg`
}