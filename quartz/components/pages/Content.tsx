import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import PasswordGate from "../PasswordGate"
import { h } from "preact"

const Content: QuartzComponent = ({ fileData, tree, cfg, ctx, externalResources, children, allFiles }: QuartzComponentProps) => {
  if (fileData.filePath.endsWith("index.md")) {
    const gate = PasswordGate()
    return h(gate, { fileData, tree, cfg, ctx, externalResources, children, allFiles })
  }
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
