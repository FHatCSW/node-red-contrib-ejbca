function extractErrorMessageFromBody(html) {
    // Use regular expressions to extract the error message.
    // In your specific case, you can use a regex pattern to match the error message.
    const match = /<body[^>]*>(.*?)<\/body>/i.exec(html);
    if (match) {
        return match[1].trim();
    }
    return null;
}

module.exports = extractErrorMessageFromBody;