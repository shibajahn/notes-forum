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
    console.log("PasswordGate rendering")
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

      async function sha256(text) {
        const encoder = new TextEncoder()
        const data = encoder.encode(text)
        const hashBuffer = await crypto.subtle.digest("SHA-256", data)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      }

      // Auth check function — runs on every page load AND every SPA navigation
      function checkAuth() {
        if (sessionStorage.getItem("notes_auth") === "true") {
          var gate = document.getElementById("password-gate")
          if (gate) gate.style.display = "none"
          return true
        }
        // Not authenticated
        var gate = document.getElementById("password-gate")
        if (gate) gate.style.display = "block"
        // If on a non-index page, redirect to index
        if (window.location.pathname !== "" && window.location.pathname !== "/") {
          window.location.replace("./")
          return false
        }
        return false
      }

      // Run auth check immediately
      var authed = checkAuth()

      if (!authed) {
        // On index page: set up the login form
        var form = document.getElementById("gate-form")
        var error = document.getElementById("gate-error")
        if (!form || !error) return
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
            var gate = document.getElementById("password-gate")
            if (gate) gate.style.display = "none"
          } else {
            error.style.display = "block"
            document.getElementById("gate-password").value = ""
          }
        })
      }

      // Block SPA navigation by adding a capturing listener on window that runs
      // before the SPA router's bubbling listener. Capturing phase fires
      // window→document→element, so this fires before the SPA router.
      // We use stopImmediatePropagation to kill the event before bubbling.
      window.addEventListener(
        "click",
        function (e) {
          if (sessionStorage.getItem("notes_auth") !== "true") {
            var link = e.target.closest("a")
            if (
              link &&
              link.hostname === window.location.hostname &&
              link.href.startsWith(window.location.origin)
            ) {
              e.stopImmediatePropagation()
              e.preventDefault()
            }
          }
        },
        true, // capture phase
      )

      // Re-check auth on every SPA navigation event
      document.addEventListener("nav", function () {
        checkAuth()
      })

      // Handle browser back/forward
      window.addEventListener("popstate", function () {
        checkAuth()
      })
    })()
  `

  PasswordGate.css = style
  return PasswordGate
}) satisfies QuartzComponentConstructor
