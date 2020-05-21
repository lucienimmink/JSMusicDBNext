declare const window: any;

import { tinycolor } from "@thebespokepixel/es-tinycolor";
import FastAverageColor from "fast-average-color/dist/index.es6";

const convertToStrict = (color): any => {
  color.r = Math.floor(color.r);
  color.g = Math.floor(color.g);
  color.b = Math.floor(color.b);
  color.a = 1;
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

const getHighestContrast = (color): any => {
  return tinycolor.readability("#000", color) > tinycolor.readability("#fff", color) ? "#000" : "#fff";
};
const convertSwatchToRGB = (swatch): any => {
  if (swatch) {
    const arr = swatch._rgb;
    return {
      r: arr[0],
      g: arr[1],
      b: arr[2],
      a: 1,
    };
  }
  // if no swatch is found, use our default color
  return {
    r: 0,
    g: 110,
    b: 205,
    a: 1,
  };
};

export default (rgbstring: string): any => {
  const rgba = new tinycolor(rgbstring);
  return getColorsFromRGB(convertToStrict(rgba.toRgb()));
};
export function getDominantColor(img, cb, override): any {
  getDominantColorByURL(img.src, cb, override);
}
export function getDominantColorByURL(url, cb, override): any {
  if (window.runningInElectron && !override) {
    // send an event to download this image
    document.querySelector("mdb-player").dispatchEvent(
      new CustomEvent("external.mdbuntaint", {
        detail: { url },
      })
    );
  } else {
    // clone the img object
    const clone = new Image();
    clone.crossOrigin = "Anonymous";
    clone.addEventListener(
      "load",
      evt => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = clone.width;
        canvas.height = clone.height;
        context.drawImage(clone, 0, 0);

        const fac = new FastAverageColor();
        const rgb = fac.getColor(canvas).value;
        cb(
          convertToStrict({
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
          })
        );
      },
      false
    );
    clone.src = url;
  }
}
export function getColorsFromRGB(rgba: any): any {
  const textLight = getReadableColor(rgba, "#fff");
  const textDark = getReadableColor(rgba, "#000");
  const lighten = convertToStrict(new tinycolor(textLight).lighten().toRgb());
  const darken = convertToStrict(new tinycolor(textDark).darken().toRgb());
  return {
    rgba,
    textLight,
    textDark,
    lighten,
    darken,
    letterColor: getHighestContrast(new tinycolor(rgba)),
  };
}
export function getColorsFromRGBWithBGColor(rgba: any, bgColor: string): any {
  const textLight = getReadableColor(rgba, bgColor);
  const textDark = getReadableColor(rgba, bgColor);
  const lighten = convertToStrict(new tinycolor(textLight).lighten().toRgb());
  const darken = convertToStrict(new tinycolor(textDark).darken().toRgb());
  return {
    rgba,
    textLight,
    textDark,
    lighten,
    darken,
    letterColor: getHighestContrast(new tinycolor(rgba)),
  };
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
  removeCustomCss();
  document.querySelector("body").appendChild(accentCSSOverrideNode);
}
export function addCustomCssBasedOnRGBA(rgba: any): void {
  if (rgba) {
    const colors = getColorsFromRGB(rgba);
    addCustomCss(colors);
  }
}
export function removeCustomCss(): void {
  if (document.querySelector("#custom-css-node")) {
    document.querySelector("#custom-css-node").remove();
  }
}
