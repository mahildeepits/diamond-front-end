/**
 * Safely extracts the most meaningful error message from a backend API response.
 * Standard format expected: { status: false, message: "...", errors: [...] }
 */
export const getErrorMessage = (error, fallback = "Something went wrong. Please try again.") => {
    if (!error) return fallback;

    // Handle Axios/Network/RTK-Query errors
    let data = error.response ? error.response.data : (error.data ? error.data : null);

    if (data) {
        // 1. If backend sends a specific 'message' string
        if (data.message && typeof data.message === "string" && data.message.trim() !== "") {
            return data.message;
        }

        // 2. If backend sends validation 'errors' object
        if (data.errors && typeof data.errors === "object") {
            const firstErrorKey = Object.keys(data.errors)[0];
            const errorValue = data.errors[firstErrorKey];

            if (Array.isArray(errorValue) && errorValue.length > 0) {
                return errorValue[0];
            }
            if (typeof errorValue === "string") {
                return errorValue;
            }
        }
    }

    // 3. RTK-Query status based error
    if (error.status) {
        if (error.status === 'FETCH_ERROR') return "Unable to connect to server. Please check your internet.";
        if (typeof error.status === 'number') {
            if (error.status === 401) return "Session expired. Please login again.";
            if (error.status === 404) return "Requested resource not found.";
            if (error.status >= 500) return "Server encountered an error.";
        }
    }

    // 4. Axios/Network message
    if (error.message) {
        if (error.message === "Network Error") return "Unable to connect to server. Please check your internet.";
        return error.message;
    }

    return fallback;
};
