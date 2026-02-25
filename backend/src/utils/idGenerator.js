const generateId = async (prefix, Model, fieldName = 'userId') => {
    try {
        const date = new Date();
        const year = date.getFullYear();
        let formattedYear = (prefix === 'CMP') ? `-${year}` : '';

        // Find the record with the highest ID for this prefix
        const lastRecord = await Model.findOne({
            [fieldName]: new RegExp(`^${prefix}${formattedYear}`)
        }).sort({ [fieldName]: -1 }).limit(1);

        let nextNumber = 1;
        if (lastRecord && lastRecord[fieldName]) {
            const parts = lastRecord[fieldName].split('-');
            const lastNum = parseInt(parts[parts.length - 1]);
            if (!isNaN(lastNum)) {
                nextNumber = lastNum + 1;
            }
        }

        const paddedNumber = String(nextNumber).padStart(5, '0');
        // If prefix ends with hyphen, don't add another one
        const char = (prefix.endsWith('-') || formattedYear.endsWith('-')) ? '' : '-';
        return `${prefix}${formattedYear}${char}${paddedNumber}`;
    } catch (error) {
        console.error(`Error generating ID for ${prefix}:`, error);
        throw new Error('Could not generate unique ID');
    }
};

export const generateUgr = async (User) => {
    const yearSuffix = new Date().getFullYear().toString().slice(-2); // e.g., 26
    const prefix = `UGR/`;

    // Find highest UGR for this year
    const lastUser = await User.findOne({
        ugrNumber: new RegExp(`^${prefix}\\d{4}/${yearSuffix}$`)
    }).sort({ ugrNumber: -1 }).limit(1);

    let nextNumber = 1001;
    if (lastUser && lastUser.ugrNumber) {
        const parts = lastUser.ugrNumber.split('/');
        const lastPart = parts[1];
        const lastNum = parseInt(lastPart);
        if (!isNaN(lastNum)) {
            nextNumber = lastNum + 1;
        }
    }

    return `${prefix}${nextNumber}/${yearSuffix}`;
};


export default generateId;
