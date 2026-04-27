export function getFromLocalStorage(key) {
    const storedData = localStorage.getItem(key);
    let list = [];
    if (!storedData) {
        return list;
    }

    try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
            list = parsedData;
        } else {
            console.warn("Se encontró data corrupta en LocalStorage al leer.");
        }
    } catch (error) {
        console.error("Error al procesar LocalStorage:", error);
    }
    return list;
}