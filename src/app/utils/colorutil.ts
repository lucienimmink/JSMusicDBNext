import { tinycolor } from "@thebespokepixel/es-tinycolor";
import { set, get } from "idb-keyval";

const convertToStrict = (color): any => {
  color.r = Math.floor(color.r);
  color.g = Math.floor(color.g);
  color.b = Math.floor(color.b);
  // don't round down the alpha channel, silly :)
  return color;
};

export default (rgbstring: string): any => {
  const rgba = new tinycolor(rgbstring);
  const lighten = convertToStrict(new tinycolor(rgba).lighten().toRgb());
  const darken = convertToStrict(new tinycolor(rgba).darken().toRgb());
  return {
    rgba: convertToStrict(rgba.toRgb()),
    lighten,
    darken
  };
};
export function getColorsFromRGB(rgba: any): any {
  const lighten = convertToStrict(new tinycolor(rgba).lighten().toRgb());
  const darken = convertToStrict(new tinycolor(rgba).darken().toRgb());
  return {
    rgba,
    lighten,
    darken
  };
}
export function saveColors(colors: any): void {
  const { rgba, darken, lighten } = colors;
  set("customColor", rgba);
  set("customColor-light", lighten);
  set("customColor-dark", darken);
}
export function getAccentColor(): Promise<any> {
  return get("customColor");
}
export function convertRGBtoString(rgba: any): string {
  return new tinycolor(rgba).toRgbString();
}
export function addCustomCss(colors: any): void {
  const accentCSSOverrideNode: HTMLElement = document.createElement("style");
  const { rgba, darken, lighten } = colors;
  accentCSSOverrideNode.setAttribute("type", "text/css");
  accentCSSOverrideNode.textContent = `
      @charset "UTF-8";
      :root {
        --primary: rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a});
        --darken: rgba(${darken.r}, ${darken.g}, ${darken.b}, ${darken.a});
        --lighten: rgba(${lighten.r}, ${lighten.g}, ${lighten.b}, ${lighten.a});
      }`;
  document.querySelector("body").appendChild(accentCSSOverrideNode);
}
