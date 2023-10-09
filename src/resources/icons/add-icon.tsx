import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { memo } from "react"
const SvgComponent:React.FC = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#33363F"
      strokeLinecap="round"
      strokeWidth={2}
      d="M12 6v12M18 12H6"
    />
  </Svg>
)
const AddIcon = memo(SvgComponent)
export default AddIcon