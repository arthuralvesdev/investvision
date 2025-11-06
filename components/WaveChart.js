import * as d3 from "d3-shape";
import { Dimensions, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";

const { width } = Dimensions.get("window");
const height = 200;

export default function WaveChart() {
  // Dados de exemplo (podem vir de uma API)
  const data = [10, 40, 20, 60, 30, 70, 50, 80, 60, 100, 70];

  // Escala X e Y para caber na tela
  const x = (i) => (i / (data.length - 1)) * width;
  const y = (value) => height - value * 1.5;

  // Cria a curva suave (onda)
  const line = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d))
    .curve(d3.curveNatural)(data);

  return (
    <View style={{ backgroundColor: "#000", padding: 10 }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#00BFFF" stopOpacity="0.8" />
            <Stop offset="1" stopColor="#000" stopOpacity="0.2" />
          </LinearGradient>
        </Defs>

        {/* Linha da onda */}
        <Path
          d={line}
          fill="none"
          stroke="#00BFFF"
          strokeWidth={3}
        />

        {/* Área preenchida abaixo da linha */}
        <Path
          d={`${line} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#grad)"
          opacity={0.6}
        />
      </Svg>
    </View>
  );
}
