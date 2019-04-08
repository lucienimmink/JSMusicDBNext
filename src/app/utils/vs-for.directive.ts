// tslint:disable-next-line:max-line-length
import { Directive, ElementRef, EmbeddedViewRef, NgZone, OnChanges, OnDestroy, OnInit, Renderer2, TemplateRef, ViewContainerRef } from "@angular/core";

const dde: any = document.documentElement;
const matchingFunction = dde.matches
  ? "matches"
  : dde.matchesSelector
    ? "matchesSelector"
    : dde.webkitMatches
      ? "webkitMatches"
      : dde.webkitMatchesSelector
        ? "webkitMatchesSelector"
        : dde.msMatches
          ? "msMatches"
          : dde.msMatchesSelector
            ? "msMatchesSelector"
            : dde.mozMatches
              ? "mozMatches"
              : dde.mozMatchesSelector
                ? "mozMatchesSelector"
                : null;

function closestElement(el: Node, selector: string): HTMLElement {
  while (el !== document.documentElement && el != null && !el[matchingFunction](selector)) {
    el = el.parentNode;
  }

  if (el && el[matchingFunction](selector)) {
    return el as HTMLElement;
  } else {
    return null;
  }
}

function getWindowScroll() {
  if ("pageYOffset" in window) {
    return {
      scrollTop: pageYOffset,
      scrollLeft: pageXOffset
    };
  } else {
    let sx: number;
    let sy: number;
    const d = document;
    const r = d.documentElement;
    const b = d.body;
    sx = r.scrollLeft || b.scrollLeft || 0;
    sy = r.scrollTop || b.scrollTop || 0;
    return {
      scrollTop: sy,
      scrollLeft: sx
    };
  }
}

function getClientSize(element: Node | Window, sizeProp: string): number {
  if (element === window || element === document.querySelector("body")) {
    return sizeProp === "clientWidth" ? window.innerWidth : window.innerHeight;
  } else {
    return element[sizeProp];
  }
}

function getScrollPos(element: Node | Window, scrollProp: string): number {
  return element === window ? getWindowScroll()[scrollProp] : element[scrollProp];
}

function getScrollOffset(vsElement: HTMLElement, scrollElement: HTMLElement | Window, isHorizontal: boolean): number {
  const vsPos = vsElement.getBoundingClientRect()[isHorizontal ? "left" : "top"];
  const scrollPos = scrollElement === window ? 0 : (scrollElement as HTMLElement).getBoundingClientRect()[isHorizontal ? "left" : "top"];
  const correction = vsPos - scrollPos + (scrollElement === window ? getWindowScroll() : scrollElement)[isHorizontal ? "scrollLeft" : "scrollTop"];
  return correction;
}

function nextElementSibling(el: any) {
  if (el.nextElementSibling) {
    return el.nextElementSibling;
  }

  do {
    el = el.nextSibling;
  } while (el && el.nodeType !== 1);

  return el;
}

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: "[vsFor]",
  // tslint:disable-next-line:use-input-property-decorator
  inputs: [
    "originalCollection: vsFor",
    "vsSize: vsForSize",
    "vsOffsetAfter: vsForOffsetAfter",
    "vsOffsetBefore: vsForOffsetBefore",
    "vsExcess: vsForExcess",
    "tagName: vsForTagName",
    "vsScrollParent: vsForScrollParent",
    "__horizontal: vsForHorizontal",
    "vsAutoresize: vsForAutoresize",
    "vsVisibleItems: vsForVisibleItems"
  ]
})
export class VsForDirective implements OnInit, OnDestroy, OnChanges {
  public _originalCollection: any[] = [];
  public _slicedCollection: any[] = [];
  public originalLength: number;
  public before: HTMLElement;
  public after: HTMLElement;
  public view: EmbeddedViewRef<any>;
  public parent: HTMLElement;
  public tagName = "div";
  public __horizontal = false;
  public __autoSize: boolean;
  public __options: any;
  public scrollParent: HTMLElement;
  public clientSize: string;
  public offsetSize: string;
  public scrollPos: string;
  public totalSize: number;
  public sizesCumulative: number[];
  public sizes: number[];
  public elementSize: number;
  public startIndex: number;
  public endIndex: number;
  public _prevStartIndex: number;
  public _prevEndIndex: number;
  public _minStartIndex: number;
  public _maxEndIndex: number;
  public onWindowResize: any;
  public onZone: any;

  public vsSize: any;
  public vsOffsetBefore = 0;
  public vsOffsetAfter = 0;
  public vsExcess = 2;
  public vsScrollParent: string;
  public vsAutoresize: boolean;

  set originalCollection(value: any[]) {
    this._originalCollection = value || [];
    if (this.scrollParent) {
      this.refresh();
    } else {
      this.postDigest(this.refresh.bind(this));
    }
  }
  get originalCollection() {
    return this._originalCollection;
  }
  set slicedCollection(value: any[]) {
    this._slicedCollection = value;
    this.view.context.vsCollection = this._slicedCollection;
  }
  get slicedCollection() {
    return this._slicedCollection;
  }
  constructor(
    private _element: ElementRef,
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<any>,
    private _renderer: Renderer2,
    private _ngZone: NgZone
  ) {
    let _prevClientSize: number;
    const reinitOnClientHeightChange = () => {
      if (!this.scrollParent) {
        return;
      }

      const ch = getClientSize(this.scrollParent, this.clientSize);
      if (ch !== _prevClientSize) {
        _prevClientSize = ch;
        this._ngZone.run(() => {
          this.refresh();
        });
      } else {
        _prevClientSize = ch;
      }
    };

    this.onZone = this._ngZone.onStable.subscribe(reinitOnClientHeightChange);
  }
  public ngOnChanges() {
    if (this.scrollParent) {
      this.refresh();
    } else {
      this.postDigest(this.refresh.bind(this));
    }
  }
  public postDigest(fn) {
    const subscription: any = this._ngZone.onStable.subscribe(() => {
      fn();
      subscription.unsubscribe();
    });
  }
  public initPlaceholders() {
    this.before = document.createElement(this.tagName);
    this.before.className = "vsFor-before";
    this.after = document.createElement(this.tagName);
    this.after.className = "vsFor-after";
    this.parent.insertBefore(this.before, this.parent.childNodes[0]);
    this.parent.appendChild(this.after);

    if (this.__horizontal) {
      this.before.style.height = "100%";
      this.after.style.height = "100%";
    } else {
      this.before.style.width = "100%";
      this.after.style.width = "100%";
    }
  }
  public ngOnInit() {
    this.view = this._viewContainer.createEmbeddedView(this._templateRef);
    this.parent = nextElementSibling(this._element.nativeElement);

    this.initPlaceholders();
    this.__horizontal = false;
    this.__autoSize = true;
    this.__options = {};
    this.clientSize = this.__horizontal ? "clientWidth" : "clientHeight";
    this.offsetSize = this.__horizontal ? "offsetWidth" : "offsetHeight";
    this.scrollPos = this.__horizontal ? "scrollLeft" : "scrollTop";

    this.scrollParent = this.vsScrollParent ? closestElement(this.parent, this.vsScrollParent) : this.parent;

    this.elementSize = getClientSize(this.scrollParent, this.clientSize) || 50;

    this.totalSize = 0;

    if (typeof this.vsSize !== "undefined") {
      this.sizesCumulative = [];
    }

    this.startIndex = 0;
    this.endIndex = 0;

    document.addEventListener("scroll", this.updateInnerCollection);

    this.onWindowResize = () => {
      if (this.vsAutoresize) {
        this.__autoSize = true;
        this._ngZone.run(() => {
          this.setAutoSize();
        });
      } else {
        this._ngZone.run(() => {
          this.updateInnerCollection();
        });
      }
    };

    window.addEventListener("resize", this.onWindowResize);
  }
  public ngOnDestroy() {
    window.removeEventListener("resize", this.onWindowResize);

    if (this.onZone) {
      this.onZone.unsubscribe();
    }

    document.removeEventListener("scroll", this.updateInnerCollection);
  }
  public refresh() {
    if (!this.originalCollection || this.originalCollection.length < 1) {
      this.slicedCollection = [];
      this.originalLength = 0;
      this.updateTotalSize(0);
      this.sizesCumulative = [0];
    } else {
      this.originalLength = this.originalCollection.length;
      if (typeof this.vsSize !== "undefined") {
        this.sizes = this.originalCollection.map((item, index) => {
          if (typeof this.vsSize === "function") {
            return this.vsSize(item, index);
          } else {
            return +this.vsSize; // number or string
          }
        });
        let sum = 0;
        this.sizesCumulative = this.sizes.map(size => {
          const res = sum;
          sum += size;
          return res;
        });
        this.sizesCumulative.push(sum);
      } else {
        this.__autoSize = true;
        this.postDigest(this.setAutoSize.bind(this));
      }
    }

    this.reinitialize();
  }
  public updateTotalSize(size: number) {
    this.totalSize = this.vsOffsetBefore + size + this.vsOffsetAfter;
  }
  public reinitialize() {
    this._prevStartIndex = void 0;
    this._prevEndIndex = void 0;
    this._minStartIndex = this.originalLength;
    this._maxEndIndex = 0;

    this.updateTotalSize(typeof this.vsSize !== "undefined" ? this.sizesCumulative[this.originalLength] : this.elementSize * this.originalLength);
    this.updateInnerCollection();
  }
  public setAutoSize() {
    if (typeof this.vsSize !== "undefined") {
      this._ngZone.run(() => {
        this.refresh();
      });
    } else if (this.__autoSize) {
      let gotSomething = false;
      if (this.parent.offsetHeight || this.parent.offsetWidth) {
        // element is visible
        const child = this.parent.children[1];

        if (child[this.offsetSize]) {
          gotSomething = true;
          this.elementSize = child[this.offsetSize];
        }
      }

      if (gotSomething) {
        this.__autoSize = false;
        this._ngZone.run(() => {
          this.reinitialize();
        });
      }
    }
  }
  public updateInnerCollection = () => {
    const $scrollPosition = getScrollPos(window, this.scrollPos);
    const $clientSize = getClientSize(this.scrollParent, this.clientSize);

    const scrollOffset = this.parent === this.scrollParent ? 0 : getScrollOffset(this.parent, this.scrollParent, this.__horizontal);

    let __startIndex = this.startIndex;
    let __endIndex = this.endIndex;
    if (typeof this.vsSize !== "undefined") {
      __startIndex = 0;

      while (this.sizesCumulative[__startIndex] < $scrollPosition - this.vsOffsetBefore) {
        __startIndex++;
      }
      if (__startIndex > 0) {
        __startIndex--;
      }

      // Adjust the start index according to the excess
      __startIndex = Math.max(Math.floor(__startIndex - this.vsExcess / 2), 0);

      __endIndex = __startIndex;
      while (this.sizesCumulative[__endIndex] < $scrollPosition - this.vsOffsetBefore + $clientSize) {
        __endIndex++;
      }

      // Adjust the end index according to the excess
      __endIndex = Math.min(Math.ceil(__endIndex + this.vsExcess / 2), this.originalLength);
    } else {
      __startIndex = Math.max(Math.floor(($scrollPosition - this.vsOffsetBefore - scrollOffset) / this.elementSize) - this.vsExcess / 2, 0);

      __endIndex = Math.min(__startIndex + Math.ceil($clientSize / this.elementSize) + this.vsExcess, this.originalLength);
    }

    this._minStartIndex = Math.min(__startIndex, this._minStartIndex);
    this._maxEndIndex = Math.max(__endIndex, this._maxEndIndex);

    this.startIndex = this.__options.latch ? this._minStartIndex : __startIndex;
    this.endIndex = this.__options.latch ? this._maxEndIndex : __endIndex;

    let digestRequired = false;
    if (this._prevStartIndex == null) {
      digestRequired = true;
    } else if (this._prevEndIndex == null) {
      digestRequired = true;
    }

    if (!digestRequired) {
      if (this.__options.hunked) {
        if (Math.abs(this.startIndex - this._prevStartIndex) >= this.vsExcess / 2 || (this.startIndex === 0 && this._prevStartIndex !== 0)) {
          digestRequired = true;
        } else if (
          Math.abs(this.endIndex - this._prevEndIndex) >= this.vsExcess / 2 ||
          (this.endIndex === this.originalLength && this._prevEndIndex !== this.originalLength)
        ) {
          digestRequired = true;
        }
      } else {
        digestRequired = this.startIndex !== this._prevStartIndex || this.endIndex !== this._prevEndIndex;
      }
    }

    // console.warn(this.startIndex, this.endIndex);

    if (digestRequired) {
      this.slicedCollection = this.originalCollection.slice(this.startIndex, this.endIndex);
      // this.view.setLocal('vsStartIndex', this.startIndex);
      this.view.context.vsStartIndex = this.startIndex;

      // TODO figure out these events
      // Emit the event
      // $scope.$emit('vsRepeatInnerCollectionUpdated', this.startIndex, this.endIndex, this._prevStartIndex, this._prevEndIndex);
      this._prevStartIndex = this.startIndex;
      this._prevEndIndex = this.endIndex;

      const o1 = this._getOffset(0);
      const o2 = this._getOffset(this.slicedCollection.length);
      const total = this.totalSize;
      const layoutProp = this.__horizontal ? "width" : "height";

      this.before.style[layoutProp] = o1 + "px";
      this.after.style[layoutProp] = total - o2 + "px";
    }

    return digestRequired;
  };
  public _getOffset(index: number) {
    if (typeof this.vsSize !== "undefined") {
      return this.sizesCumulative[index + this.startIndex] + this.vsOffsetBefore;
    }

    return (index + this.startIndex) * this.elementSize + this.vsOffsetBefore;
  }
}
