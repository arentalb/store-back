const parseDuration = (duration) => {
    const timeUnits = {
        s: 1000,        // seconds
        m: 1000 * 60,   // minutes
        h: 1000 * 60 * 60,  // hours
        d: 1000 * 60 * 60 * 24  // days
    };

    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error("Invalid duration format");
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    return value * timeUnits[unit];
};
export default parseDuration
