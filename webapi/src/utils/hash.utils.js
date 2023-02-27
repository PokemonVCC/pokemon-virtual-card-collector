function hashToHex(buffer) {
    const hexBuffer = [];

    for(let i = 0; i < buffer.length; i++) {
        const hex = buffer[i].toString(16);
        hexBuffer.push(hex);
    }

    return hexBuffer.join('');
}

module.exports = {
    hashToHex
};