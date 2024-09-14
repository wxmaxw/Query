import { SvgXml } from 'react-native-svg';
import icon from "../assets/icon-svg-strings.json";

export default function Icon({name, size =16}){
    return <SvgXml xml={icon[name]} width={size} height={size}/>
}
/*
SvgXml, React Native'de SVG (Scalable Vector Graphics) dosyalarını XML formatında kullanmanıza olanak sağlayan bir bileşendir. 
Bu bileşen, genellikle react-native-svg kütüphanesi ile birlikte kullanılır ve SVG içeriğini doğrudan bir XML string olarak kabul eder.
*/