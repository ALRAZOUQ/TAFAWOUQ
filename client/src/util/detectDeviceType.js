export default function detectDeviceType() {
    const userAgent = navigator.userAgent;

    if (/iPad/i.test(userAgent)) {
        return "iPad";
    } else if (/iPhone/i.test(userAgent)) {
        return "iPhone";
    } else if (/Android/i.test(userAgent) && /Mobile/i.test(userAgent)) {
        return "Android Phone";
    } else if (/Android/i.test(userAgent)) {
        return "Android Tablet";
    } else if (/Tablet|PlayBook|Silk/i.test(userAgent)) {
        return "Tablet";
    } else {
        return "Laptop/Desktop";
    }
}
