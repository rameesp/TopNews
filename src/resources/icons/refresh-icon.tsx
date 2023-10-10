import * as React from 'react';
import Svg, {SvgProps, Path} from 'react-native-svg';
import {memo} from 'react';
import {Pressable} from 'react-native';
const SvgComponent: React.FC<ISvgIcons> = ({onClick}) => (
  <Pressable onPress={onClick}>
    <Svg width={24} height={24} fill="none">
      <Path stroke="#33363F" strokeWidth={2} d="m14 15-4 4 4 4" />
      <Path
        stroke="#33363F"
        strokeLinecap="round"
        strokeWidth={2}
        d="M18.062 8.5A7 7 0 0 1 12 19"
      />
      <Path stroke="#33363F" strokeWidth={2} d="m10 9 4-4-4-4" />
      <Path
        stroke="#33363F"
        strokeLinecap="round"
        strokeWidth={2}
        d="M5.938 15.5A7 7 0 0 1 12 5"
      />
    </Svg>
  </Pressable>
);
const RefreshIcon = memo(SvgComponent);
export default RefreshIcon;
