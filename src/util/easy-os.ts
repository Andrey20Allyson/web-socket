import os from 'os';

export function getFirstExternalAddress() {
    let interfaces = Object.values(os.networkInterfaces());

    let found = interfaces.find(v => {
        if (v === undefined) return false;

        return v[1].internal === false;
    });

    if (found === undefined) return;

    return found[1].address
}

export default { getFirstExternalAddress }