 
// authWidget.js
import {api_auth_register ,api_auth_login,api_auth_me,

    api_auth_logout

 } from "../../JS/apiClient.js";
//import { api_auth_login, api_auth_register, api_auth_me, api_auth_logout } from "./api.js";
import   RunButton   from "../../JS/wuli-ui/runButton.js";


export class AuthWidget {

    constructor({
        container,
        className = "authWidget"
    }) {

        this.container = container;

        this.root = document.createElement("div");
        this.root.className = className;

        this.container.appendChild(this.root);

        this.user = null;

        this.render();
        this.checkAuth();
    }


    // ============================================================
    // AUTH STATE
    // ============================================================

    async checkAuth() {

        try {

            const result = await api_auth_me();

            this.user = result.user || null;

        } catch (error) {

            this.user = null;

        }

        this.render();
    }


    // ============================================================
    // RENDER
    // ============================================================

    render() {

        this.root.innerHTML = "";

        if (this.user) {

            this.renderAuthenticated();

        } else {

            this.renderLogin();

        }
    }


    // ============================================================
    // LOGIN
    // ============================================================

    renderLogin() {

        const title = document.createElement("div");

        title.textContent = "Login";

        this.root.appendChild(title);


        const email = this.createInput(
            "email",
            "Email"
        );

        const password = this.createInput(
            "password",
            "Password"
        );

        this.root.appendChild(email);
        this.root.appendChild(password);


        const buttonContainer = document.createElement("div");

        this.root.appendChild(buttonContainer);


        const loginButton = new RunButton({

            container: buttonContainer,

            label: "Login",

            onClick: async () => {

                try {

                    loginButton.button.disabled = true;

                    const result = await api_auth_login({

                        email: email.value,
                        password: password.value

                    });

                    this.user = result.user;

                    this.render();

                    this.emit("auth_login", this.user);

                } catch (error) {

                    console.error(
                        "Login failed:",
                        error
                    );

                    alert("Login failed.");

                } finally {

                    loginButton.button.disabled = false;

                }
            }
        });


        loginButton.button.classList.add("btn");


        const registerLink = document.createElement("button");

        registerLink.textContent = "Create account";

        registerLink.type = "button";

        registerLink.addEventListener(
            "click",
            () => this.renderRegister()
        );

        this.root.appendChild(registerLink);
    }


    // ============================================================
    // REGISTER
    // ============================================================

    renderRegister() {

        this.root.innerHTML = "";


        const title = document.createElement("div");

        title.textContent = "Create account";

        this.root.appendChild(title);


        const email = this.createInput(
            "email",
            "Email"
        );

        const password = this.createInput(
            "password",
            "Password"
        );

        const passwordConfirm = this.createInput(
            "password",
            "Confirm password"
        );


        this.root.appendChild(email);
        this.root.appendChild(password);
        this.root.appendChild(passwordConfirm);


        const buttonContainer = document.createElement("div");

        this.root.appendChild(buttonContainer);


        const registerButton = new RunButton({

            container: buttonContainer,

            label: "Register",

            onClick: async () => {

                if (
                    password.value !==
                    passwordConfirm.value
                ) {

                    alert("Passwords do not match.");

                    return;
                }


                try {

                    registerButton.button.disabled = true;

                    const result =
                        await api_auth_register({

                            email: email.value,
                            password: password.value

                        });


                    /*
                     * Registration does not automatically
                     * log the user in.
                     *
                     * Login explicitly after registration.
                     */

                    console.log(
                        "Registered:",
                        result
                    );


                    alert(
                        "Account created. Please login."
                    );

                    this.renderLogin();

                    this.emit(
                        "auth_register",
                        result
                    );


                } catch (error) {

                    console.error(
                        "Registration failed:",
                        error
                    );

                    alert(
                        "Registration failed."
                    );

                } finally {

                    registerButton.button.disabled = false;

                }
            }
        });


        registerButton.button.classList.add("btn");


        const loginLink =
            document.createElement("button");

        loginLink.textContent =
            "Already have an account? Login";

        loginLink.type = "button";

        loginLink.addEventListener(
            "click",
            () => this.renderLogin()
        );

        this.root.appendChild(loginLink);
    }


    // ============================================================
    // AUTHENTICATED
    // ============================================================

    renderAuthenticated() {

        const identity =
            document.createElement("div");

        identity.className =
            "authIdentity";


        identity.textContent =
            this.user.email;


        this.root.appendChild(identity);


        const plan =
            document.createElement("div");

        plan.textContent =
            `Plan: ${this.user.plan}`;

        this.root.appendChild(plan);


        const buttonContainer =
            document.createElement("div");

        this.root.appendChild(
            buttonContainer
        );


        const logoutButton =
            new RunButton({

                container:
                    buttonContainer,

                label: "Logout",

                onClick: async () => {

                    try {

                        logoutButton.button.disabled =
                            true;

                        await api_auth_logout();

                        this.user = null;

                        this.render();

                        this.emit(
                            "auth_logout"
                        );

                    } catch (error) {

                        console.error(
                            "Logout failed:",
                            error
                        );

                    } finally {

                        logoutButton.button.disabled =
                            false;

                    }
                }
            });


        logoutButton.button.classList.add(
            "btn"
        );
    }


    // ============================================================
    // INPUT
    // ============================================================

    createInput(type, placeholder) {

        const input =
            document.createElement("input");

        input.type = type;

        input.placeholder =
            placeholder;

        input.autocomplete =
            type === "password"
                ? "current-password"
                : "email";

        return input;
    }


    // ============================================================
    // EVENTS
    // ============================================================

    emit(name, detail) {

        this.root.dispatchEvent(
            new CustomEvent(
                name,
                {
                    detail,
                    bubbles: true
                }
            )
        );
    }
}
 
