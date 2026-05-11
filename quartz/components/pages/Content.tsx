import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const PasswordGate = () => {
  // The actual gate script is loaded via afterBody from the PasswordGate component
  // This is just a placeholder that the script hides on successful auth
  const gateStyle = `
    <style>
      #password-gate { display: flex; align-items: center; justify-content: center; min-height: 100vh; width: 100%; }
      .gate-loading { text-align: center; padding: 40px; color: #999; }
    </style>
  `
  return (
    <div id="password-gate">
      <div class="gate-loading">Loading authentication...</div>
    </div>
  )
}

const Content: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  if (fileData.slug === "index") {
    return <PasswordGate />
  }
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
