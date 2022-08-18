export function randomId(len = 20) {
    let now = new Date().getTime()
    let rid = 'x'.repeat(len).replace(/[x]/g, (c) => {
        let random = (now + Math.random() * 16) % 16 | 0
        now = Math.floor(now / 16)

        return random.toString(16)
    })

    return rid
}