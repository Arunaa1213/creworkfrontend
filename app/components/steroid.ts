interface FormState {
    name: string;
    email: string;
    password: string;
}

interface ValidationErrors {
    name: string;
    email: string;
    password: string;
}

export default function validate(formState: FormState): ValidationErrors {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    let emailError: string = "True";
    let passwordError: string = "True";
    let nameError: string = "True";

    if (!formState.name.trim()) {
        nameError = "name is required.";
    }

    if (!emailRegex.test(formState.email)) {
        emailError = "Invalid email format. Ensure it contains '@' and a domain part.";
    }

    if (formState.password.length < 8) {
        passwordError = "Password must be at least 8 characters long.";
    } else if (!/[a-z]/.test(formState.password)) {
        passwordError = "Password must contain at least one lowercase letter.";
    } else if (!/[A-Z]/.test(formState.password)) {
        passwordError = "Password must contain at least one uppercase letter.";
    } else if (!/\d/.test(formState.password)) {
        passwordError = "Password must contain at least one digit.";
    } else if (!/[!@#$%^&*]/.test(formState.password)) {
        passwordError = "Password must contain at least one special character (!@#$%^&*).";
    }


    return {
        name: nameError,
        email: emailError,
        password: passwordError
    };
}

interface LoginErrors {
    email: string;
    password: string;
}

export function validatelogin(email: string, password: string): LoginErrors {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    let emailError: string = "True";
    let passwordError: string = "True";

    if (!emailRegex.test(email)) {
        emailError = "Invalid email format. Ensure it contains '@' and a domain part.";
    }

    if (password.length < 8) {
        passwordError = "Password must be at least 8 characters long.";
    } else if (!/[a-z]/.test(password)) {
        passwordError = "Password must contain at least one lowercase letter.";
    } else if (!/[A-Z]/.test(password)) {
        passwordError = "Password must contain at least one uppercase letter.";
    } else if (!/\d/.test(password)) {
        passwordError = "Password must contain at least one digit.";
    } else if (!/[!@#$%^&*]/.test(password)) {
        passwordError = "Password must contain at least one special character (!@#$%^&*).";
    }

    return {
        email: emailError,
        password: passwordError
    };
}
