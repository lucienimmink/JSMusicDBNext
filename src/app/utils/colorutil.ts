import { tinycolor } from "@thebespokepixel/es-tinycolor";
import { set, get } from "idb-keyval";

const convertToStrict = (color): any => {
  color.r = Math.floor(color.r);
  color.g = Math.floor(color.g);
  color.b = Math.floor(color.b);
  // don't round down the alpha channel, silly :)
  return color;
};

const getReadableColor = (rgba, bgcolor): any => {
  if (!tinycolor.isReadable(rgba, bgcolor)) {
    if (bgcolor === "#000") {
      return getReadableColor(new tinycolor(rgba).lighten(3), bgcolor);
    }
    return getReadableColor(new tinycolor(rgba).darken(3), bgcolor);
  }
  return convertToStrict(new tinycolor(rgba).toRgb());
};

const isReadableIfUsedAsBackgroundWithWhiteForeground = (rgba): any => {
  return tinycolor.isReadable("#fff", rgba);
};
const convertSwatchToRGB = (swatch): any => {
  if (swatch) {
    const arr = swatch._rgb;
    return {
      r: arr[0],
      g: arr[1],
      b: arr[2],
      a: 1
    };
  }
  // if no swatch is found, use our default color
  return {
    r: 0,
    g: 120,
    b: 215,
    a: 1
  };
};

export default (rgbstring: string): any => {
  const rgba = new tinycolor(rgbstring);
  return getColorsFromRGB(convertToStrict(rgba.toRgb()));
};
export function getDominantColor(img, cb): any {
  img.crossOrigin = "anonymous";
  import("node-vibrant").then(vibrant => {
    vibrant
      .from(img)
      .quality(1)
      .getPalette()
      .then(palette => {
        // console.log(palette);
        cb(convertToStrict(convertSwatchToRGB(palette.Vibrant)));
      });
  });
  return {
    r: 255,
    g: 0,
    b: 128,
    a: 1
  };
  // TODO
}
export function getColorsFromRGB(rgba: any): any {
  const lighten = convertToStrict(new tinycolor(rgba).lighten().toRgb());
  // textcolor: has to be readable -> use contrast
  const textLight = getReadableColor(rgba, "#fff");
  const textDark = getReadableColor(rgba, "#000");
  const darken = convertToStrict(new tinycolor(rgba).darken().toRgb());
  return {
    rgba,
    textLight,
    textDark,
    lighten,
    darken,
    letterColor: isReadableIfUsedAsBackgroundWithWhiteForeground(rgba)
      ? "#fff"
      : "#000"
  };
}
export function saveColors(colors: any): void {
  set("customColors", colors);
}
export function getCustomColors(): Promise<any> {
  return get("customColors");
}
export function convertRGBtoString(rgba: any): string {
  return new tinycolor(rgba).toRgbString();
}
export function addCustomCss(colors: any): void {
  const accentCSSOverrideNode: HTMLElement = document.createElement("style");
  const { rgba, darken, lighten, textLight, textDark, letterColor } = colors;
  accentCSSOverrideNode.setAttribute("type", "text/css");
  accentCSSOverrideNode.id = "custom-css-node";
  accentCSSOverrideNode.textContent = `
      @charset "UTF-8";
      :root {
        --primary: rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, 1);
        --darken: rgba(${darken.r}, ${darken.g}, ${darken.b}, 1);
        --lighten: rgba(${lighten.r}, ${lighten.g}, ${lighten.b}, 1);
        --text-light: rgba(${textLight.r}, ${textLight.g}, ${textLight.b}, 1);
        --text-dark: rgba(${textDark.r}, ${textDark.g}, ${textDark.b}, 1);
        --letter-color: ${letterColor};
      }`;
  if (document.querySelector("#custom-css-node")) {
    document.querySelector("#custom-css-node").remove();
  }
  document.querySelector("body").appendChild(accentCSSOverrideNode);
}
