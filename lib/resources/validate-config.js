function validateConfig(jsonConfig) {
    try {
        const config = JSON.parse(jsonConfig);

        // Check if 'subjects' and 'subject_alternative_names' properties exist
        if (!config.subjects || !config.subject_alternative_names) {
            return "JSON must have 'subjects' and 'subject_alternative_names' properties.";
        }

        // Validate 'subjects' array
        if (!Array.isArray(config.subjects) || config.subjects.length === 0) {
            return "'subjects' must be a non-empty array.";
        }

        // Validate each subject in 'subjects' array
        for (const subject of config.subjects) {
            const errors = [];

            if (!subject.property || typeof subject.property !== 'string') {
                errors.push("'property' must be a non-empty string.");
            }

            if (typeof subject.prop_value !== 'string') {
                errors.push("'prop_value' must be a string.");
            }

            if (!subject.hasOwnProperty('prop_required') || typeof subject.prop_required !== 'boolean') {
                errors.push("'prop_required' must be a boolean.");
            }

            if (!subject.hasOwnProperty('prop_modifiable') || typeof subject.prop_modifiable !== 'boolean') {
                errors.push("'prop_modifiable' must be a boolean.");
            }

            if (errors.length > 0) {
                return `Error in '${subject.property}': ${errors.join(' ')}`;
            }
        }

        // Validate 'subject_alternative_names' array
        if (!Array.isArray(config.subject_alternative_names)) {
            return "'subject_alternative_names' must be an array.";
        }

        // Validate each subject alternative name in 'subject_alternative_names' array
        for (const san of config.subject_alternative_names) {
            const errors = [];

            if (!san.property || typeof san.property !== 'string') {
                errors.push("'property' must be a non-empty string.");
            }

            if (typeof san.prop_value !== 'string') {
                errors.push("'prop_value' must be a string.");
            }

            if (!san.hasOwnProperty('prop_required') || typeof san.prop_required !== 'boolean') {
                errors.push("'prop_required' must be a boolean.");
            }

            if (!san.hasOwnProperty('prop_modifiable') || typeof san.prop_modifiable !== 'boolean') {
                errors.push("'prop_modifiable' must be a boolean.");
            }

            if (errors.length > 0) {
                return `Error in '${san.property}': ${errors.join(' ')}`;
            }
        }

        // Validate 'profile' object
        const profile = config.profile;
        if (!profile) {
            return "'profile' object is missing.";
        }

        const requiredProperties = [
            'hostname',
            'certificate_profile_name',
            'end_entity_profile_name',
            'certificate_authority_name',
            'username',
            'enrollment_code',
            'mail',
        ];

        for (const prop of requiredProperties) {
            if (!profile.hasOwnProperty(prop)) {
                return `'profile' object must have '${prop}' property.`;
            }
        }

        // If all checks pass, the JSON is valid
        return null;
    } catch (error) {
        return "Invalid JSON format.";
    }
}

// Export the validateConfig function to make it available for import
module.exports = validateConfig;