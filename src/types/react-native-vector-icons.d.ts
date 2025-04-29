declare module 'react-native-vector-icons/AntDesign' {
  import * as React from 'react';
  import {TextStyle} from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  const AntDesign: React.FC<IconProps>;
  export default AntDesign;
}

declare module 'react-native-vector-icons/FontAwesome' {
  import * as React from 'react';
  import {TextStyle} from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  const FontAwesome: React.FC<IconProps>;
  export default FontAwesome;
}

declare module 'react-native-vector-icons/Ionicons' {
  import * as React from 'react';
  import {TextStyle} from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  const Ionicons: React.FC<IconProps>;
  export default Ionicons;
}

declare module 'react-native-vector-icons/Foundation' {
  import * as React from 'react';
  import {TextStyle} from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  const Icon: React.FC<IconProps>;
  export default Icon;
}

declare module 'react-native-vector-icons/Feather' {
  import * as React from 'react';
  import {TextStyle} from 'react-native';

  export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle;
  }

  const Icon: React.FC<IconProps>;
  export default Icon;
}
