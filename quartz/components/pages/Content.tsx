import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponentConstructor, QuartzComponentProps } from "../types"
import PasswordGate from "../PasswordGate"

const Content: QuartzComponent = ({ fileData, tree }: QuartzComponentProps) => {
  if (fileData.slug === "index" || fileData.slug === "") {
    return <PasswordGate />
  }
  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
