import crypto from "crypto"

export class Util
{
    generateRandomString(length = 10) {
        return crypto.randomBytes(Math.ceil(length / 2))
            .toString('hex')
            .slice(0, length);
    }

    generateSecureNumericString(length = 6) {
        let result = '';
        const max = 10;
        
        while (result.length < length) {
            const byte = crypto.randomBytes(1)[0];
            if (byte < 250) {
                result += byte % max;
            }
        }
        
        return result.slice(0, length);
    }
}