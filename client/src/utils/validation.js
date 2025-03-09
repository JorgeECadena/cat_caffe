export function register(formData) {
    let username = formData.username;
    let password = formData.password;
    let confirmation = formData.confirmation;

    if (!username || !password || !confirmation) {
        return "No pueden haber campos vacios.";
    }
    if (!(password === confirmation)) {
        return "Las passwords no coinciden.";
    }
    if (password.length < 8) {
        return "El password debe tener una longitud minima de 8 caracteres.";
    }
    if (password === username) {
        return "El password no puede ser igual al nombre de usuario.";
    }
    if (/[^a-zA-Z0-9.]/.test(password)) {
        return "El password solo puede contener '.' o caracteres alfanumericos.";
    }

    return "";
}