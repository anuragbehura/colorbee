const getDateFilter = (filterType: string) => {
    const now = new Date();

    switch(filterType) {
        case 'month':
            // First day of current month
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return {createdAt: { $gte: startOfMonth }};

        case 'year':
            // First day of current year
            const startOfYear = new Date(now.getFullYear(), 0, 1);
            return { createdAt: { $gte: startOfYear } };

        case 'all':
            default:
                // No date filter for all-time
                return {};
    }
};

export default getDateFilter;