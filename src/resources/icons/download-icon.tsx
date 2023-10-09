import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
import { memo } from "react"
const SvgComponent = (props: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="#33363F"
      strokeWidth={2}
      d="M3 11c0 .932 0 1.398.152 1.765a2 2 0 0 0 1.083 1.083C4.602 14 5.068 14 6 14h.675c.581 0 .872 0 1.104.134a.995.995 0 0 1 .164.118c.2.178.292.453.476 1.005l.125.376c.22.66.33.99.592 1.178.262.189.61.189 1.306.189h3.117c.695 0 1.043 0 1.305-.189s.372-.518.592-1.178l.125-.376c.184-.552.276-.827.476-1.005a.99.99 0 0 1 .164-.118c.232-.134.523-.134 1.104-.134H18c.932 0 1.398 0 1.765-.152a2 2 0 0 0 1.083-1.083C21 12.398 21 11.932 21 11M8 9l4 3m0 0 4-3m-4 3V2"
    />
    <Path
      stroke="#33363F"
      strokeWidth={2}
      d="M16 5h1c1.886 0 2.828 0 3.414.586C21 6.172 21 7.114 21 9v8c0 1.886 0 2.828-.586 3.414C19.828 21 18.886 21 17 21H7c-1.886 0-2.828 0-3.414-.586C3 19.828 3 18.886 3 17V9c0-1.886 0-2.828.586-3.414C4.172 5 5.114 5 7 5h1"
    />
  </Svg>
)
const DownloadIcon = memo(SvgComponent)
export default DownloadIcon