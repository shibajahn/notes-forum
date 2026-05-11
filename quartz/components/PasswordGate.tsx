import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/passwordGate.scss"

// Per-user credentials: username -> SHA-256 hash of password
// Never store plaintext passwords. Generate hashes with:
// echo -n "password" | sha256sum | cut -d' ' -f1
const USERS: Record<string, string> = {
  shibajahn: "91b9db45eefb82bcab3ec0f77bc32c4f6ebeb5a7233c8e580c180522d636c8b7",
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export default (() => {
  const PasswordGate: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
    return (
      <div id="password-gate">
        <div id="gate-card">
          <h1>Private Notes</h1>
          <p>Sign in to access your notes.</p>
          <form id="gate-form">
            <input
              type="text"
              id="gate-username"
              placeholder="Username"
              autocomplete="off"
              required
            />
            <input
              type="password"
              id="gate-password"
              placeholder="Password"
              autocomplete="off"
              required
            />
            <button type="submit">Unlock</button>
          </form>
          <p id="gate-error">Incorrect credentials. Try again.</p>
        </div>
      </div>
    )
  }

  PasswordGate.afterDOMLoaded = `
    ;(async function () {
      const USERS = ${JSON.stringify(USERS)}

      // Already authenticated this session
      if (sessionStorage.getItem("notes_auth") === "true") {
        var gate = document.getElementById("password-gate")
        if (gate) gate.style.display = "none"
        return
      }

      var form = document.getElementById("gate-form")
      var error = document.getElementById("gate-error")
      var gate = document.getElementById("password-gate")

      if (!form || !error || !gate) return

      form.addEventListener("submit", async function (e) {
        e.preventDefault()
        var username = document.getElementById("gate-username").value.trim().toLowerCase()
        var passwordInput = document.getElementById("gate-password").value

        if (!USERS[username]) {
          error.style.display = "block"
          document.getElementById("gate-username").value = ""
          document.getElementById("gate-password").value = ""
          return
        }

        var hash = await sha256(passwordInput)

        if (hash === USERS[username]) {
          sessionStorage.setItem("notes_auth", "true")
          sessionStorage.setItem("notes_user", username)
          gate.style.display = "none"
        } else {
          error.style.display = "block"
          document.getElementById("gate-password").value = ""
        }
      })

      // Intercept internal navigation
      document.addEventListener("click", function (e) {
        var link = e.target.closest("a")
        if (
          link &&
          link.hostname === window.location.hostname &&
          link.href.startsWith(window.location.origin)
        ) {
          if (sessionStorage.getItem("notes_auth") !== "true") {
            e.preventDefault()
          }
        }
      })

      // Handle browser back/forward
      window.addEventListener("popstate", function () {
        if (sessionStorage.getItem("notes_auth") !== "true") {
          gate.style.display = "block"
        }
      })
    })()
  `

  PasswordGate.css = style
  return PasswordGate
}) satisfies QuartzComponentConstructor
