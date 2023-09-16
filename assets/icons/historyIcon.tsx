import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill={props.color}
      fillRule="evenodd"
      d="M5.25 3.75v16.5h13.5V3.75H5.25ZM4.5 1.5A1.5 1.5 0 0 0 3 3v18a1.5 1.5 0 0 0 1.5 1.5h15A1.5 1.5 0 0 0 21 21V3a1.5 1.5 0 0 0-1.5-1.5h-15Zm7.5 15a1.125 1.125 0 0 1 1.125-1.125h2.625a1.125 1.125 0 1 1 0 2.25h-2.625A1.125 1.125 0 0 1 12 16.5ZM9 18a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm3-6a1.125 1.125 0 0 1 1.125-1.125h2.625a1.125 1.125 0 1 1 0 2.25h-2.625A1.125 1.125 0 0 1 12 12Zm-3 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm3-6a1.125 1.125 0 0 1 1.125-1.125h2.625a1.125 1.125 0 0 1 0 2.25h-2.625A1.125 1.125 0 0 1 12 7.5ZM9 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default SvgComponent
