const generateId = async (prefix, Model, fieldName = 'userId') => {
    try {
        const date = new Date();
        const year = date.getFullYear();
        let formattedYear = (prefix === 'CMP') ? `-${year}` : '';

        const query = { [fieldName]: new RegExp(`^${prefix}${formattedYear}`) };
        const lastRecord = await Model.findOne(query).sort({ [fieldName]: -1 }).exec();

        let nextNumber = 1;
        if (lastRecord && lastRecord[fieldName]) {
            const matches = lastRecord[fieldName].match(/(\d+)$/);
            const lastNum = matches ? parseInt(matches[1]) : 0;
            nextNumber = lastNum + 1;
        }

        const paddedNumber = String(nextNumber).padStart(5, '0');
        const char = (prefix.endsWith('-') || formattedYear.endsWith('-')) ? '' : '-';
        return `${prefix}${formattedYear}${char}${paddedNumber}`;
    } catch (error) {
        console.error(`Error generating ID for ${prefix}:`, error);
        throw new Error('Could not generate unique ID');
    }
};

/**
 * Generates IDs in the format: PREFIX/NUMBER/SUFFIX (e.g., STF/0001/18)
 */
export const generateFormattedId = async (prefix, Model, fieldName = 'userId', suffix = '18') => {
    try {
        // Regex to find matches for this prefix and suffix
        const query = { [fieldName]: new RegExp(`^${prefix}/\\d+/${suffix}$`) };
        const lastRecord = await Model.findOne(query).sort({ [fieldName]: -1 }).exec();

        let nextNumber = (prefix === 'UGR') ? 1001 : 1;

        if (lastRecord && lastRecord[fieldName]) {
            const parts = lastRecord[fieldName].split('/');
            const lastPartNum = parseInt(parts[1]);
            if (!isNaN(lastPartNum)) {
                nextNumber = lastPartNum + 1;
            }
        }

        // Pad number if not UGR (user usually expects 4 digits for STF/ADM)
        const displayNum = (prefix === 'UGR') ? nextNumber : String(nextNumber).padStart(4, '0');

        return `${prefix}/${displayNum}/${suffix}`;
    } catch (error) {
        console.error(`Error generating formatted ID for ${prefix}:`, error);
        throw new Error('Could not generate unique ID');
    }
};

export const generateUgr = async (User) => {
    return generateFormattedId('UGR', User, 'ugrNumber', '18');
};

export const generateStaffId = async (User) => {
    return generateFormattedId('STF', User, 'userId', '18');
};

export const generateAdminId = async (User) => {
    return generateFormattedId('ADM', User, 'userId', '18');
};

export default generateId;
