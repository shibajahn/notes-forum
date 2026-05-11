import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"

const Content: QuartzComponent = ({ fileData, tree, cfg, ctx, externalResources, children, allFiles }: QuartzComponentProps) => {
  if (fileData.filePath.endsWith("index.md")) {
    return <article class="popover-hint"><div id="password-gate"><div id="gate-card"><h1>Private Notes</h1><p>Sign in to access your notes.</p><form id="gate-form"><input type="text" id="gate-username" placeholder="Username" autocomplete="off" required/><input type="password" id="gate-password" placeholder="Password" autocomplete="off" required/><button type="submit">Unlock</button></form><p id="gate-error" style="display:none">Incorrect credentials. Try again.</p></div></div></article>
  }
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
