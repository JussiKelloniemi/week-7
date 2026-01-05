const initializeRegister = () => {
    document.getElementById("registerForm").addEventListener("submit", (event) => {
        fetchData(event)
    })
}

const fetchData = async (event) => {
    event.preventDefault()

    const formData = {
        email: event.target.email.value,
        password: event.target.password.value,
    }

    try {
        const response = await fetch("/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
        if (!response.ok) {
            document.getElementById("error").innerText ="Error when trying to register. Please try again"
        } else {
            const data = await response.json()
            console.log("User registered:", data)
        }
    } catch {
        console.log(`Error while trying to register: ${error.message}`)
    }
}

initializeRegister()