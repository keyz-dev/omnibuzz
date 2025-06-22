// FileValidator.js - Handles all file validation logic
export class FileValidator {
    static requiredColumns = ['plateNumber', 'busType', 'capacity', 'seatLayout', 'baseStationId', 'amenities'];

    static validateFileStructure(data) {
        if (!data || data.length === 0) {
            return { isValid: false, error: 'File is empty or could not be parsed' };
        }

        // Get the first row to check column headers
        const firstRow = data[0];
        const fileColumns = Object.keys(firstRow).map(col => col.trim().toLowerCase());

        // Check if all required columns are present
        const missingColumns = this.requiredColumns.filter(
            reqCol => !fileColumns.includes(reqCol.toLowerCase())
        );

        if (missingColumns.length > 0) {
            return {
                isValid: false,
                error: `Missing required columns: ${missingColumns.join(', ')}`
            };
        }

        // Validate data types and required fields
        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            // Check if required fields are not empty
            if (!row.plateNumber || !row.busType || !row.capacity || !row.baseStationId) {
                return {
                    isValid: false,
                    error: `Row ${i + 1}: Missing required data in plateNumber, busType, capacity, or baseStationId`
                };
            }

            // Check if capacity is numeric
            if (isNaN(Number(row.capacity))) {
                return {
                    isValid: false,
                    error: `Row ${i + 1}: Capacity must be a number`
                };
            }
        }

        return { isValid: true, error: null };
    }

    static processFileData(data) {
        return data.map((row, index) => {
            // Clean and normalize the data
            const cleanRow = {};
            Object.keys(row).forEach(key => {
                const cleanKey = key.trim();
                cleanRow[cleanKey] = typeof row[key] === 'string' ? row[key].trim() : row[key];
            });

            // Debug: Log the processed row
            console.log('Processing row:', cleanRow);

            return {
                id: `bus-${index}`,
                plateNumber: cleanRow.plateNumber || cleanRow.PlateNumber || '',
                busType: cleanRow.busType || cleanRow.BusType || '',
                capacity: parseInt(cleanRow.capacity || cleanRow.Capacity) || 0,
                seatLayout: cleanRow.seatLayout || cleanRow.SeatLayout || '',
                baseStationId: cleanRow.baseStationId || cleanRow.BaseStationId || '',
                amenities: cleanRow.amenities || cleanRow.Amenities || '',
                status: cleanRow.status || cleanRow.Status || 'Active' // Default status
            };
        });
    }
}