import { NavigateOptions, useNavigate } from 'react-router-dom';

// A custom hook that builds on useLocation to parse
// the query string for you.
export function useCustomNavigation() {
    const navigate = useNavigate();

    const navigateHome = (options?: NavigateOptions) => {
        navigate(`/home`, options)
    }

    const navigateVenue = (options?: NavigateOptions) => {
        navigate(`/venue`, options)
    }
    const navigateBookings = (options?: NavigateOptions) => {
        navigate(`/bookings`, options)
    }
    return {
        navigateHome,
        navigateVenue,
        navigateBookings,
    }
}