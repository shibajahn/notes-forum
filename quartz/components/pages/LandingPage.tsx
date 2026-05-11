import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import Content from "./Content"
import PasswordGate from "./PasswordGate"

const LandingPage: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  if (fileData.slug === "index") {
    return <PasswordGate />
  }
  return <Content />
}

export default (() => LandingPage) satisfies QuartzComponentConstructor
