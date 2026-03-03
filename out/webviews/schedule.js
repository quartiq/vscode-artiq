var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from3, except, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal2(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal2(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal2(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/tabulator-tables/dist/js/tabulator_esm.mjs
var CoreFeature = class {
  constructor(table2) {
    this.table = table2;
  }
  //////////////////////////////////////////
  /////////////// DataLoad /////////////////
  //////////////////////////////////////////
  reloadData(data, silent, columnsChanged) {
    return this.table.dataLoader.load(data, void 0, void 0, void 0, silent, columnsChanged);
  }
  //////////////////////////////////////////
  ///////////// Localization ///////////////
  //////////////////////////////////////////
  langText() {
    return this.table.modules.localize.getText(...arguments);
  }
  langBind() {
    return this.table.modules.localize.bind(...arguments);
  }
  langLocale() {
    return this.table.modules.localize.getLocale(...arguments);
  }
  //////////////////////////////////////////
  ////////// Inter Table Comms /////////////
  //////////////////////////////////////////
  commsConnections() {
    return this.table.modules.comms.getConnections(...arguments);
  }
  commsSend() {
    return this.table.modules.comms.send(...arguments);
  }
  //////////////////////////////////////////
  //////////////// Layout  /////////////////
  //////////////////////////////////////////
  layoutMode() {
    return this.table.modules.layout.getMode();
  }
  layoutRefresh(force) {
    return this.table.modules.layout.layout(force);
  }
  //////////////////////////////////////////
  /////////////// Event Bus ////////////////
  //////////////////////////////////////////
  subscribe() {
    return this.table.eventBus.subscribe(...arguments);
  }
  unsubscribe() {
    return this.table.eventBus.unsubscribe(...arguments);
  }
  subscribed(key) {
    return this.table.eventBus.subscribed(key);
  }
  subscriptionChange() {
    return this.table.eventBus.subscriptionChange(...arguments);
  }
  dispatch() {
    return this.table.eventBus.dispatch(...arguments);
  }
  chain() {
    return this.table.eventBus.chain(...arguments);
  }
  confirm() {
    return this.table.eventBus.confirm(...arguments);
  }
  dispatchExternal() {
    return this.table.externalEvents.dispatch(...arguments);
  }
  subscribedExternal(key) {
    return this.table.externalEvents.subscribed(key);
  }
  subscriptionChangeExternal() {
    return this.table.externalEvents.subscriptionChange(...arguments);
  }
  //////////////////////////////////////////
  //////////////// Options /////////////////
  //////////////////////////////////////////
  options(key) {
    return this.table.options[key];
  }
  setOption(key, value) {
    if (typeof value !== "undefined") {
      this.table.options[key] = value;
    }
    return this.table.options[key];
  }
  //////////////////////////////////////////
  /////////// Deprecation Checks ///////////
  //////////////////////////////////////////
  deprecationCheck(oldOption, newOption, convert) {
    return this.table.deprecationAdvisor.check(oldOption, newOption, convert);
  }
  deprecationCheckMsg(oldOption, msg) {
    return this.table.deprecationAdvisor.checkMsg(oldOption, msg);
  }
  deprecationMsg(msg) {
    return this.table.deprecationAdvisor.msg(msg);
  }
  //////////////////////////////////////////
  //////////////// Modules /////////////////
  //////////////////////////////////////////
  module(key) {
    return this.table.module(key);
  }
};
var Helpers = class {
  static elVisible(el) {
    return !(el.offsetWidth <= 0 && el.offsetHeight <= 0);
  }
  static elOffset(el) {
    var box = el.getBoundingClientRect();
    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    };
  }
  static retrieveNestedData(separator, field, data) {
    var structure = separator ? field.split(separator) : [field], length = structure.length, output;
    for (let i = 0; i < length; i++) {
      data = data[structure[i]];
      output = data;
      if (!data) {
        break;
      }
    }
    return output;
  }
  static deepClone(obj, clone, list = []) {
    var objectProto = {}.__proto__, arrayProto = [].__proto__;
    if (!clone) {
      clone = Object.assign(Array.isArray(obj) ? [] : {}, obj);
    }
    for (var i in obj) {
      let subject = obj[i], match, copy10;
      if (subject != null && typeof subject === "object" && (subject.__proto__ === objectProto || subject.__proto__ === arrayProto)) {
        match = list.findIndex((item) => {
          return item.subject === subject;
        });
        if (match > -1) {
          clone[i] = list[match].copy;
        } else {
          copy10 = Object.assign(Array.isArray(subject) ? [] : {}, subject);
          list.unshift({ subject, copy: copy10 });
          clone[i] = this.deepClone(subject, copy10, list);
        }
      }
    }
    return clone;
  }
};
var Popup$1 = class Popup extends CoreFeature {
  constructor(table2, element, parent) {
    super(table2);
    this.element = element;
    this.container = this._lookupContainer();
    this.parent = parent;
    this.reversedX = false;
    this.childPopup = null;
    this.blurable = false;
    this.blurCallback = null;
    this.blurEventsBound = false;
    this.renderedCallback = null;
    this.visible = false;
    this.hideable = true;
    this.element.classList.add("tabulator-popup-container");
    this.blurEvent = this.hide.bind(this, false);
    this.escEvent = this._escapeCheck.bind(this);
    this.destroyBinding = this.tableDestroyed.bind(this);
    this.destroyed = false;
  }
  tableDestroyed() {
    this.destroyed = true;
    this.hide(true);
  }
  _lookupContainer() {
    var container = this.table.options.popupContainer;
    if (typeof container === "string") {
      container = document.querySelector(container);
      if (!container) {
        console.warn("Menu Error - no container element found matching selector:", this.table.options.popupContainer, "(defaulting to document body)");
      }
    } else if (container === true) {
      container = this.table.element;
    }
    if (container && !this._checkContainerIsParent(container)) {
      container = false;
      console.warn("Menu Error - container element does not contain this table:", this.table.options.popupContainer, "(defaulting to document body)");
    }
    if (!container) {
      container = document.body;
    }
    return container;
  }
  _checkContainerIsParent(container, element = this.table.element) {
    if (container === element) {
      return true;
    } else {
      return element.parentNode ? this._checkContainerIsParent(container, element.parentNode) : false;
    }
  }
  renderCallback(callback) {
    this.renderedCallback = callback;
  }
  containerEventCoords(e) {
    var touch = !(e instanceof MouseEvent);
    var x = touch ? e.touches[0].pageX : e.pageX;
    var y = touch ? e.touches[0].pageY : e.pageY;
    if (this.container !== document.body) {
      let parentOffset = Helpers.elOffset(this.container);
      x -= parentOffset.left;
      y -= parentOffset.top;
    }
    return { x, y };
  }
  elementPositionCoords(element, position = "right") {
    var offset = Helpers.elOffset(element), containerOffset, x, y;
    if (this.container !== document.body) {
      containerOffset = Helpers.elOffset(this.container);
      offset.left -= containerOffset.left;
      offset.top -= containerOffset.top;
    }
    switch (position) {
      case "right":
        x = offset.left + element.offsetWidth;
        y = offset.top - 1;
        break;
      case "bottom":
        x = offset.left;
        y = offset.top + element.offsetHeight;
        break;
      case "left":
        x = offset.left;
        y = offset.top - 1;
        break;
      case "top":
        x = offset.left;
        y = offset.top;
        break;
      case "center":
        x = offset.left + element.offsetWidth / 2;
        y = offset.top + element.offsetHeight / 2;
        break;
    }
    return { x, y, offset };
  }
  show(origin, position) {
    var x, y, parentEl, parentOffset, coords;
    if (this.destroyed || this.table.destroyed) {
      return this;
    }
    if (origin instanceof HTMLElement) {
      parentEl = origin;
      coords = this.elementPositionCoords(origin, position);
      parentOffset = coords.offset;
      x = coords.x;
      y = coords.y;
    } else if (typeof origin === "number") {
      parentOffset = { top: 0, left: 0 };
      x = origin;
      y = position;
    } else {
      coords = this.containerEventCoords(origin);
      x = coords.x;
      y = coords.y;
      this.reversedX = false;
    }
    this.element.style.top = y + "px";
    this.element.style.left = x + "px";
    this.container.appendChild(this.element);
    if (typeof this.renderedCallback === "function") {
      this.renderedCallback();
    }
    this._fitToScreen(x, y, parentEl, parentOffset, position);
    this.visible = true;
    this.subscribe("table-destroy", this.destroyBinding);
    this.element.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });
    return this;
  }
  _fitToScreen(x, y, parentEl, parentOffset, position) {
    var scrollTop = this.container === document.body ? document.documentElement.scrollTop : this.container.scrollTop;
    if (x + this.element.offsetWidth >= this.container.offsetWidth || this.reversedX) {
      this.element.style.left = "";
      if (parentEl) {
        this.element.style.right = this.container.offsetWidth - parentOffset.left + "px";
      } else {
        this.element.style.right = this.container.offsetWidth - x + "px";
      }
      this.reversedX = true;
    }
    let offsetHeight = Math.max(this.container.offsetHeight, scrollTop ? this.container.scrollHeight : 0);
    if (y + this.element.offsetHeight > offsetHeight) {
      if (parentEl) {
        switch (position) {
          case "bottom":
            this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight - parentEl.offsetHeight - 1 + "px";
            break;
          default:
            this.element.style.top = parseInt(this.element.style.top) - this.element.offsetHeight + parentEl.offsetHeight + 1 + "px";
        }
      } else {
        this.element.style.height = offsetHeight + "px";
      }
    }
  }
  isVisible() {
    return this.visible;
  }
  hideOnBlur(callback) {
    this.blurable = true;
    if (this.visible) {
      setTimeout(() => {
        if (this.visible) {
          this.table.rowManager.element.addEventListener("scroll", this.blurEvent);
          this.subscribe("cell-editing", this.blurEvent);
          document.body.addEventListener("click", this.blurEvent);
          document.body.addEventListener("contextmenu", this.blurEvent);
          document.body.addEventListener("mousedown", this.blurEvent);
          window.addEventListener("resize", this.blurEvent);
          document.body.addEventListener("keydown", this.escEvent);
          this.blurEventsBound = true;
        }
      }, 100);
      this.blurCallback = callback;
    }
    return this;
  }
  _escapeCheck(e) {
    if (e.keyCode == 27) {
      this.hide();
    }
  }
  blockHide() {
    this.hideable = false;
  }
  restoreHide() {
    this.hideable = true;
  }
  hide(silent = false) {
    if (this.visible && this.hideable) {
      if (this.blurable && this.blurEventsBound) {
        document.body.removeEventListener("keydown", this.escEvent);
        document.body.removeEventListener("click", this.blurEvent);
        document.body.removeEventListener("contextmenu", this.blurEvent);
        document.body.removeEventListener("mousedown", this.blurEvent);
        window.removeEventListener("resize", this.blurEvent);
        this.table.rowManager.element.removeEventListener("scroll", this.blurEvent);
        this.unsubscribe("cell-editing", this.blurEvent);
        this.blurEventsBound = false;
      }
      if (this.childPopup) {
        this.childPopup.hide();
      }
      if (this.parent) {
        this.parent.childPopup = null;
      }
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.visible = false;
      if (this.blurCallback && !silent) {
        this.blurCallback();
      }
      this.unsubscribe("table-destroy", this.destroyBinding);
    }
    return this;
  }
  child(element) {
    if (this.childPopup) {
      this.childPopup.hide();
    }
    this.childPopup = new Popup(this.table, element, this);
    return this.childPopup;
  }
};
var Module = class extends CoreFeature {
  constructor(table2, name) {
    super(table2);
    this._handler = null;
  }
  initialize() {
  }
  ///////////////////////////////////
  ////// Options Registration ///////
  ///////////////////////////////////
  registerTableOption(key, value) {
    this.table.optionsList.register(key, value);
  }
  registerColumnOption(key, value) {
    this.table.columnManager.optionsList.register(key, value);
  }
  ///////////////////////////////////
  /// Public Function Registration ///
  ///////////////////////////////////
  registerTableFunction(name, func) {
    if (typeof this.table[name] === "undefined") {
      this.table[name] = (...args) => {
        this.table.initGuard(name);
        return func(...args);
      };
    } else {
      console.warn("Unable to bind table function, name already in use", name);
    }
  }
  registerComponentFunction(component, func, handler) {
    return this.table.componentFunctionBinder.bind(component, func, handler);
  }
  ///////////////////////////////////
  ////////// Data Pipeline //////////
  ///////////////////////////////////
  registerDataHandler(handler, priority) {
    this.table.rowManager.registerDataPipelineHandler(handler, priority);
    this._handler = handler;
  }
  registerDisplayHandler(handler, priority) {
    this.table.rowManager.registerDisplayPipelineHandler(handler, priority);
    this._handler = handler;
  }
  displayRows(adjust) {
    var index = this.table.rowManager.displayRows.length - 1, lookupIndex;
    if (this._handler) {
      lookupIndex = this.table.rowManager.displayPipeline.findIndex((item) => {
        return item.handler === this._handler;
      });
      if (lookupIndex > -1) {
        index = lookupIndex;
      }
    }
    if (adjust) {
      index = index + adjust;
    }
    if (this._handler) {
      if (index > -1) {
        return this.table.rowManager.getDisplayRows(index);
      } else {
        return this.activeRows();
      }
    }
  }
  activeRows() {
    return this.table.rowManager.activeRows;
  }
  refreshData(renderInPosition, handler) {
    if (!handler) {
      handler = this._handler;
    }
    if (handler) {
      this.table.rowManager.refreshActiveData(handler, false, renderInPosition);
    }
  }
  ///////////////////////////////////
  //////// Footer Management ////////
  ///////////////////////////////////
  footerAppend(element) {
    return this.table.footerManager.append(element);
  }
  footerPrepend(element) {
    return this.table.footerManager.prepend(element);
  }
  footerRemove(element) {
    return this.table.footerManager.remove(element);
  }
  ///////////////////////////////////
  //////// Popups Management ////////
  ///////////////////////////////////
  popup(menuEl, menuContainer) {
    return new Popup$1(this.table, menuEl, menuContainer);
  }
  ///////////////////////////////////
  //////// Alert Management ////////
  ///////////////////////////////////
  alert(content, type) {
    return this.table.alertManager.alert(content, type);
  }
  clearAlert() {
    return this.table.alertManager.clear();
  }
};
var CellComponent = class {
  constructor(cell) {
    this._cell = cell;
    return new Proxy(this, {
      get: function(target, name, receiver) {
        if (typeof target[name] !== "undefined") {
          return target[name];
        } else {
          return target._cell.table.componentFunctionBinder.handle("cell", target._cell, name);
        }
      }
    });
  }
  getValue() {
    return this._cell.getValue();
  }
  getOldValue() {
    return this._cell.getOldValue();
  }
  getInitialValue() {
    return this._cell.initialValue;
  }
  getElement() {
    return this._cell.getElement();
  }
  getRow() {
    return this._cell.row.getComponent();
  }
  getData(transform) {
    return this._cell.row.getData(transform);
  }
  getType() {
    return "cell";
  }
  getField() {
    return this._cell.column.getField();
  }
  getColumn() {
    return this._cell.column.getComponent();
  }
  setValue(value, mutate) {
    if (typeof mutate == "undefined") {
      mutate = true;
    }
    this._cell.setValue(value, mutate);
  }
  restoreOldValue() {
    this._cell.setValueActual(this._cell.getOldValue());
  }
  restoreInitialValue() {
    this._cell.setValueActual(this._cell.initialValue);
  }
  checkHeight() {
    this._cell.checkHeight();
  }
  getTable() {
    return this._cell.table;
  }
  _getSelf() {
    return this._cell;
  }
};
var Cell = class extends CoreFeature {
  constructor(column, row) {
    super(column.table);
    this.table = column.table;
    this.column = column;
    this.row = row;
    this.element = null;
    this.value = null;
    this.initialValue;
    this.oldValue = null;
    this.modules = {};
    this.height = null;
    this.width = null;
    this.minWidth = null;
    this.component = null;
    this.loaded = false;
    this.build();
  }
  //////////////// Setup Functions /////////////////
  //generate element
  build() {
    this.generateElement();
    this.setWidth();
    this._configureCell();
    this.setValueActual(this.column.getFieldValue(this.row.data));
    this.initialValue = this.value;
  }
  generateElement() {
    this.element = document.createElement("div");
    this.element.className = "tabulator-cell";
    this.element.setAttribute("role", "gridcell");
    if (this.column.isRowHeader) {
      this.element.classList.add("tabulator-row-header");
    }
  }
  _configureCell() {
    var element = this.element, field = this.column.getField(), vertAligns = {
      top: "flex-start",
      bottom: "flex-end",
      middle: "center"
    }, hozAligns = {
      left: "flex-start",
      right: "flex-end",
      center: "center"
    };
    element.style.textAlign = this.column.hozAlign;
    if (this.column.vertAlign) {
      element.style.display = "inline-flex";
      element.style.alignItems = vertAligns[this.column.vertAlign] || "";
      if (this.column.hozAlign) {
        element.style.justifyContent = hozAligns[this.column.hozAlign] || "";
      }
    }
    if (field) {
      element.setAttribute("tabulator-field", field);
    }
    if (this.column.definition.cssClass) {
      var classNames = this.column.definition.cssClass.split(" ");
      classNames.forEach((className) => {
        element.classList.add(className);
      });
    }
    this.dispatch("cell-init", this);
    if (!this.column.visible) {
      this.hide();
    }
  }
  //generate cell contents
  _generateContents() {
    var val;
    val = this.chain("cell-format", this, null, () => {
      return this.element.innerHTML = this.value;
    });
    switch (typeof val) {
      case "object":
        if (val instanceof Node) {
          while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
          this.element.appendChild(val);
        } else {
          this.element.innerHTML = "";
          if (val != null) {
            console.warn("Format Error - Formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", val);
          }
        }
        break;
      case "undefined":
        this.element.innerHTML = "";
        break;
      default:
        this.element.innerHTML = val;
    }
  }
  cellRendered() {
    this.dispatch("cell-rendered", this);
  }
  //////////////////// Getters ////////////////////
  getElement(containerOnly) {
    if (!this.loaded) {
      this.loaded = true;
      if (!containerOnly) {
        this.layoutElement();
      }
    }
    return this.element;
  }
  getValue() {
    return this.value;
  }
  getOldValue() {
    return this.oldValue;
  }
  //////////////////// Actions ////////////////////
  setValue(value, mutate, force) {
    var changed = this.setValueProcessData(value, mutate, force);
    if (changed) {
      this.dispatch("cell-value-updated", this);
      this.cellRendered();
      if (this.column.definition.cellEdited) {
        this.column.definition.cellEdited.call(this.table, this.getComponent());
      }
      this.dispatchExternal("cellEdited", this.getComponent());
      if (this.subscribedExternal("dataChanged")) {
        this.dispatchExternal("dataChanged", this.table.rowManager.getData());
      }
    }
  }
  setValueProcessData(value, mutate, force) {
    var changed = false;
    if (this.value !== value || force) {
      changed = true;
      if (mutate) {
        value = this.chain("cell-value-changing", [this, value], null, value);
      }
    }
    this.setValueActual(value);
    if (changed) {
      this.dispatch("cell-value-changed", this);
    }
    return changed;
  }
  setValueActual(value) {
    this.oldValue = this.value;
    this.value = value;
    this.dispatch("cell-value-save-before", this);
    this.column.setFieldValue(this.row.data, value);
    this.dispatch("cell-value-save-after", this);
    if (this.loaded) {
      this.layoutElement();
    }
  }
  layoutElement() {
    this._generateContents();
    this.dispatch("cell-layout", this);
  }
  setWidth() {
    this.width = this.column.width;
    this.element.style.width = this.column.widthStyled;
  }
  clearWidth() {
    this.width = "";
    this.element.style.width = "";
  }
  getWidth() {
    return this.width || this.element.offsetWidth;
  }
  setMinWidth() {
    this.minWidth = this.column.minWidth;
    this.element.style.minWidth = this.column.minWidthStyled;
  }
  setMaxWidth() {
    this.maxWidth = this.column.maxWidth;
    this.element.style.maxWidth = this.column.maxWidthStyled;
  }
  checkHeight() {
    this.row.reinitializeHeight();
  }
  clearHeight() {
    this.element.style.height = "";
    this.height = null;
    this.dispatch("cell-height", this, "");
  }
  setHeight() {
    this.height = this.row.height;
    this.element.style.height = this.row.heightStyled;
    this.dispatch("cell-height", this, this.row.heightStyled);
  }
  getHeight() {
    return this.height || this.element.offsetHeight;
  }
  show() {
    this.element.style.display = this.column.vertAlign ? "inline-flex" : "";
  }
  hide() {
    this.element.style.display = "none";
  }
  delete() {
    this.dispatch("cell-delete", this);
    if (!this.table.rowManager.redrawBlock && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = false;
    this.column.deleteCell(this);
    this.row.deleteCell(this);
    this.calcs = {};
  }
  getIndex() {
    return this.row.getCellIndex(this);
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    if (!this.component) {
      this.component = new CellComponent(this);
    }
    return this.component;
  }
};
var ColumnComponent = class {
  constructor(column) {
    this._column = column;
    this.type = "ColumnComponent";
    return new Proxy(this, {
      get: function(target, name, receiver) {
        if (typeof target[name] !== "undefined") {
          return target[name];
        } else {
          return target._column.table.componentFunctionBinder.handle("column", target._column, name);
        }
      }
    });
  }
  getElement() {
    return this._column.getElement();
  }
  getDefinition() {
    return this._column.getDefinition();
  }
  getField() {
    return this._column.getField();
  }
  getTitleDownload() {
    return this._column.getTitleDownload();
  }
  getCells() {
    var cells = [];
    this._column.cells.forEach(function(cell) {
      cells.push(cell.getComponent());
    });
    return cells;
  }
  isVisible() {
    return this._column.visible;
  }
  show() {
    if (this._column.isGroup) {
      this._column.columns.forEach(function(column) {
        column.show();
      });
    } else {
      this._column.show();
    }
  }
  hide() {
    if (this._column.isGroup) {
      this._column.columns.forEach(function(column) {
        column.hide();
      });
    } else {
      this._column.hide();
    }
  }
  toggle() {
    if (this._column.visible) {
      this.hide();
    } else {
      this.show();
    }
  }
  delete() {
    return this._column.delete();
  }
  getSubColumns() {
    var output = [];
    if (this._column.columns.length) {
      this._column.columns.forEach(function(column) {
        output.push(column.getComponent());
      });
    }
    return output;
  }
  getParentColumn() {
    return this._column.getParentComponent();
  }
  _getSelf() {
    return this._column;
  }
  scrollTo(position, ifVisible) {
    return this._column.table.columnManager.scrollToColumn(this._column, position, ifVisible);
  }
  getTable() {
    return this._column.table;
  }
  move(to, after) {
    var toColumn = this._column.table.columnManager.findColumn(to);
    if (toColumn) {
      this._column.table.columnManager.moveColumn(this._column, toColumn, after);
    } else {
      console.warn("Move Error - No matching column found:", toColumn);
    }
  }
  getNextColumn() {
    var nextCol = this._column.nextColumn();
    return nextCol ? nextCol.getComponent() : false;
  }
  getPrevColumn() {
    var prevCol = this._column.prevColumn();
    return prevCol ? prevCol.getComponent() : false;
  }
  updateDefinition(updates) {
    return this._column.updateDefinition(updates);
  }
  getWidth() {
    return this._column.getWidth();
  }
  setWidth(width) {
    var result;
    if (width === true) {
      result = this._column.reinitializeWidth(true);
    } else {
      result = this._column.setWidth(width);
    }
    this._column.table.columnManager.rerenderColumns(true);
    return result;
  }
};
var defaultColumnOptions = {
  "title": void 0,
  "field": void 0,
  "columns": void 0,
  "visible": void 0,
  "hozAlign": void 0,
  "vertAlign": void 0,
  "width": void 0,
  "minWidth": 40,
  "maxWidth": void 0,
  "maxInitialWidth": void 0,
  "cssClass": void 0,
  "variableHeight": void 0,
  "headerVertical": void 0,
  "headerHozAlign": void 0,
  "headerWordWrap": false,
  "editableTitle": void 0
};
var Column = class _Column extends CoreFeature {
  static defaultOptionList = defaultColumnOptions;
  constructor(def, parent, rowHeader) {
    super(parent.table);
    this.definition = def;
    this.parent = parent;
    this.type = "column";
    this.columns = [];
    this.cells = [];
    this.isGroup = false;
    this.isRowHeader = rowHeader;
    this.element = this.createElement();
    this.contentElement = false;
    this.titleHolderElement = false;
    this.titleElement = false;
    this.groupElement = this.createGroupElement();
    this.hozAlign = "";
    this.vertAlign = "";
    this.field = "";
    this.fieldStructure = "";
    this.getFieldValue = "";
    this.setFieldValue = "";
    this.titleDownload = null;
    this.titleFormatterRendered = false;
    this.mapDefinitions();
    this.setField(this.definition.field);
    this.modules = {};
    this.width = null;
    this.widthStyled = "";
    this.maxWidth = null;
    this.maxWidthStyled = "";
    this.maxInitialWidth = null;
    this.minWidth = null;
    this.minWidthStyled = "";
    this.widthFixed = false;
    this.visible = true;
    this.component = null;
    if (this.definition.columns) {
      this.isGroup = true;
      this.definition.columns.forEach((def2, i) => {
        var newCol = new _Column(def2, this);
        this.attachColumn(newCol);
      });
      this.checkColumnVisibility();
    } else {
      parent.registerColumnField(this);
    }
    this._initialize();
  }
  createElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-col");
    el.setAttribute("role", "columnheader");
    el.setAttribute("aria-sort", "none");
    if (this.isRowHeader) {
      el.classList.add("tabulator-row-header");
    }
    switch (this.table.options.columnHeaderVertAlign) {
      case "middle":
        el.style.justifyContent = "center";
        break;
      case "bottom":
        el.style.justifyContent = "flex-end";
        break;
    }
    return el;
  }
  createGroupElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-col-group-cols");
    return el;
  }
  mapDefinitions() {
    var defaults = this.table.options.columnDefaults;
    if (defaults) {
      for (let key in defaults) {
        if (typeof this.definition[key] === "undefined") {
          this.definition[key] = defaults[key];
        }
      }
    }
    this.definition = this.table.columnManager.optionsList.generate(_Column.defaultOptionList, this.definition);
  }
  checkDefinition() {
    Object.keys(this.definition).forEach((key) => {
      if (_Column.defaultOptionList.indexOf(key) === -1) {
        console.warn("Invalid column definition option in '" + (this.field || this.definition.title) + "' column:", key);
      }
    });
  }
  setField(field) {
    this.field = field;
    this.fieldStructure = field ? this.table.options.nestedFieldSeparator ? field.split(this.table.options.nestedFieldSeparator) : [field] : [];
    this.getFieldValue = this.fieldStructure.length > 1 ? this._getNestedData : this._getFlatData;
    this.setFieldValue = this.fieldStructure.length > 1 ? this._setNestedData : this._setFlatData;
  }
  //register column position with column manager
  registerColumnPosition(column) {
    this.parent.registerColumnPosition(column);
  }
  //register column position with column manager
  registerColumnField(column) {
    this.parent.registerColumnField(column);
  }
  //trigger position registration
  reRegisterPosition() {
    if (this.isGroup) {
      this.columns.forEach(function(column) {
        column.reRegisterPosition();
      });
    } else {
      this.registerColumnPosition(this);
    }
  }
  //build header element
  _initialize() {
    var def = this.definition;
    while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
    if (def.headerVertical) {
      this.element.classList.add("tabulator-col-vertical");
      if (def.headerVertical === "flip") {
        this.element.classList.add("tabulator-col-vertical-flip");
      }
    }
    this.contentElement = this._buildColumnHeaderContent();
    this.element.appendChild(this.contentElement);
    if (this.isGroup) {
      this._buildGroupHeader();
    } else {
      this._buildColumnHeader();
    }
    this.dispatch("column-init", this);
  }
  //build header element for header
  _buildColumnHeader() {
    var def = this.definition;
    this.dispatch("column-layout", this);
    if (typeof def.visible != "undefined") {
      if (def.visible) {
        this.show(true);
      } else {
        this.hide(true);
      }
    }
    if (def.cssClass) {
      var classNames = def.cssClass.split(" ");
      classNames.forEach((className) => {
        this.element.classList.add(className);
      });
    }
    if (def.field) {
      this.element.setAttribute("tabulator-field", def.field);
    }
    this.setMinWidth(parseInt(def.minWidth));
    if (def.maxInitialWidth) {
      this.maxInitialWidth = parseInt(def.maxInitialWidth);
    }
    if (def.maxWidth) {
      this.setMaxWidth(parseInt(def.maxWidth));
    }
    this.reinitializeWidth();
    this.hozAlign = this.definition.hozAlign;
    this.vertAlign = this.definition.vertAlign;
    this.titleElement.style.textAlign = this.definition.headerHozAlign;
  }
  _buildColumnHeaderContent() {
    var contentElement = document.createElement("div");
    contentElement.classList.add("tabulator-col-content");
    this.titleHolderElement = document.createElement("div");
    this.titleHolderElement.classList.add("tabulator-col-title-holder");
    contentElement.appendChild(this.titleHolderElement);
    this.titleElement = this._buildColumnHeaderTitle();
    this.titleHolderElement.appendChild(this.titleElement);
    return contentElement;
  }
  //build title element of column
  _buildColumnHeaderTitle() {
    var def = this.definition;
    var titleHolderElement = document.createElement("div");
    titleHolderElement.classList.add("tabulator-col-title");
    if (def.headerWordWrap) {
      titleHolderElement.classList.add("tabulator-col-title-wrap");
    }
    if (def.editableTitle) {
      var titleElement = document.createElement("input");
      titleElement.classList.add("tabulator-title-editor");
      titleElement.addEventListener("click", (e) => {
        e.stopPropagation();
        titleElement.focus();
      });
      titleElement.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
      titleElement.addEventListener("change", () => {
        def.title = titleElement.value;
        this.dispatchExternal("columnTitleChanged", this.getComponent());
      });
      titleHolderElement.appendChild(titleElement);
      if (def.field) {
        this.langBind("columns|" + def.field, (text) => {
          titleElement.value = text || (def.title || "&nbsp;");
        });
      } else {
        titleElement.value = def.title || "&nbsp;";
      }
    } else {
      if (def.field) {
        this.langBind("columns|" + def.field, (text) => {
          this._formatColumnHeaderTitle(titleHolderElement, text || (def.title || "&nbsp;"));
        });
      } else {
        this._formatColumnHeaderTitle(titleHolderElement, def.title || "&nbsp;");
      }
    }
    return titleHolderElement;
  }
  _formatColumnHeaderTitle(el, title) {
    var contents = this.chain("column-format", [this, title, el], null, () => {
      return title;
    });
    switch (typeof contents) {
      case "object":
        if (contents instanceof Node) {
          el.appendChild(contents);
        } else {
          el.innerHTML = "";
          console.warn("Format Error - Title formatter has returned a type of object, the only valid formatter object return is an instance of Node, the formatter returned:", contents);
        }
        break;
      case "undefined":
        el.innerHTML = "";
        break;
      default:
        el.innerHTML = contents;
    }
  }
  //build header element for column group
  _buildGroupHeader() {
    this.element.classList.add("tabulator-col-group");
    this.element.setAttribute("role", "columngroup");
    this.element.setAttribute("aria-title", this.definition.title);
    if (this.definition.cssClass) {
      var classNames = this.definition.cssClass.split(" ");
      classNames.forEach((className) => {
        this.element.classList.add(className);
      });
    }
    this.titleElement.style.textAlign = this.definition.headerHozAlign;
    this.element.appendChild(this.groupElement);
  }
  //flat field lookup
  _getFlatData(data) {
    return data[this.field];
  }
  //nested field lookup
  _getNestedData(data) {
    var dataObj = data, structure = this.fieldStructure, length = structure.length, output;
    for (let i = 0; i < length; i++) {
      dataObj = dataObj[structure[i]];
      output = dataObj;
      if (!dataObj) {
        break;
      }
    }
    return output;
  }
  //flat field set
  _setFlatData(data, value) {
    if (this.field) {
      data[this.field] = value;
    }
  }
  //nested field set
  _setNestedData(data, value) {
    var dataObj = data, structure = this.fieldStructure, length = structure.length;
    for (let i = 0; i < length; i++) {
      if (i == length - 1) {
        dataObj[structure[i]] = value;
      } else {
        if (!dataObj[structure[i]]) {
          if (typeof value !== "undefined") {
            dataObj[structure[i]] = {};
          } else {
            break;
          }
        }
        dataObj = dataObj[structure[i]];
      }
    }
  }
  //attach column to this group
  attachColumn(column) {
    if (this.groupElement) {
      this.columns.push(column);
      this.groupElement.appendChild(column.getElement());
      column.columnRendered();
    } else {
      console.warn("Column Warning - Column being attached to another column instead of column group");
    }
  }
  //vertically align header in column
  verticalAlign(alignment, height) {
    var parentHeight = this.parent.isGroup ? this.parent.getGroupElement().clientHeight : height || this.parent.getHeadersElement().clientHeight;
    this.element.style.height = parentHeight + "px";
    this.dispatch("column-height", this, this.element.style.height);
    if (this.isGroup) {
      this.groupElement.style.minHeight = parentHeight - this.contentElement.offsetHeight + "px";
    }
    this.columns.forEach(function(column) {
      column.verticalAlign(alignment);
    });
  }
  //clear vertical alignment
  clearVerticalAlign() {
    this.element.style.paddingTop = "";
    this.element.style.height = "";
    this.element.style.minHeight = "";
    this.groupElement.style.minHeight = "";
    this.columns.forEach(function(column) {
      column.clearVerticalAlign();
    });
    this.dispatch("column-height", this, "");
  }
  //// Retrieve Column Information ////
  //return column header element
  getElement() {
    return this.element;
  }
  //return column group element
  getGroupElement() {
    return this.groupElement;
  }
  //return field name
  getField() {
    return this.field;
  }
  getTitleDownload() {
    return this.titleDownload;
  }
  //return the first column in a group
  getFirstColumn() {
    if (!this.isGroup) {
      return this;
    } else {
      if (this.columns.length) {
        return this.columns[0].getFirstColumn();
      } else {
        return false;
      }
    }
  }
  //return the last column in a group
  getLastColumn() {
    if (!this.isGroup) {
      return this;
    } else {
      if (this.columns.length) {
        return this.columns[this.columns.length - 1].getLastColumn();
      } else {
        return false;
      }
    }
  }
  //return all columns in a group
  getColumns(traverse) {
    var columns = [];
    if (traverse) {
      this.columns.forEach((column) => {
        columns.push(column);
        columns = columns.concat(column.getColumns(true));
      });
    } else {
      columns = this.columns;
    }
    return columns;
  }
  //return all columns in a group
  getCells() {
    return this.cells;
  }
  //retrieve the top column in a group of columns
  getTopColumn() {
    if (this.parent.isGroup) {
      return this.parent.getTopColumn();
    } else {
      return this;
    }
  }
  //return column definition object
  getDefinition(updateBranches) {
    var colDefs = [];
    if (this.isGroup && updateBranches) {
      this.columns.forEach(function(column) {
        colDefs.push(column.getDefinition(true));
      });
      this.definition.columns = colDefs;
    }
    return this.definition;
  }
  //////////////////// Actions ////////////////////
  checkColumnVisibility() {
    var visible = false;
    this.columns.forEach(function(column) {
      if (column.visible) {
        visible = true;
      }
    });
    if (visible) {
      this.show();
      this.dispatchExternal("columnVisibilityChanged", this.getComponent(), false);
    } else {
      this.hide();
    }
  }
  //show column
  show(silent, responsiveToggle) {
    if (!this.visible) {
      this.visible = true;
      this.element.style.display = "";
      if (this.parent.isGroup) {
        this.parent.checkColumnVisibility();
      }
      this.cells.forEach(function(cell) {
        cell.show();
      });
      if (!this.isGroup && this.width === null) {
        this.reinitializeWidth();
      }
      this.table.columnManager.verticalAlignHeaders();
      this.dispatch("column-show", this, responsiveToggle);
      if (!silent) {
        this.dispatchExternal("columnVisibilityChanged", this.getComponent(), true);
      }
      if (this.parent.isGroup) {
        this.parent.matchChildWidths();
      }
      if (!this.silent) {
        this.table.columnManager.rerenderColumns();
      }
    }
  }
  //hide column
  hide(silent, responsiveToggle) {
    if (this.visible) {
      this.visible = false;
      this.element.style.display = "none";
      this.table.columnManager.verticalAlignHeaders();
      if (this.parent.isGroup) {
        this.parent.checkColumnVisibility();
      }
      this.cells.forEach(function(cell) {
        cell.hide();
      });
      this.dispatch("column-hide", this, responsiveToggle);
      if (!silent) {
        this.dispatchExternal("columnVisibilityChanged", this.getComponent(), false);
      }
      if (this.parent.isGroup) {
        this.parent.matchChildWidths();
      }
      if (!this.silent) {
        this.table.columnManager.rerenderColumns();
      }
    }
  }
  matchChildWidths() {
    var childWidth = 0;
    if (this.contentElement && this.columns.length) {
      this.columns.forEach(function(column) {
        if (column.visible) {
          childWidth += column.getWidth();
        }
      });
      this.contentElement.style.maxWidth = childWidth - 1 + "px";
      if (this.table.initialized) {
        this.element.style.width = childWidth + "px";
      }
      if (this.parent.isGroup) {
        this.parent.matchChildWidths();
      }
    }
  }
  removeChild(child) {
    var index = this.columns.indexOf(child);
    if (index > -1) {
      this.columns.splice(index, 1);
    }
    if (!this.columns.length) {
      this.delete();
    }
  }
  setWidth(width) {
    this.widthFixed = true;
    this.setWidthActual(width);
  }
  setWidthActual(width) {
    if (isNaN(width)) {
      width = Math.floor(this.table.element.clientWidth / 100 * parseInt(width));
    }
    width = Math.max(this.minWidth, width);
    if (this.maxWidth) {
      width = Math.min(this.maxWidth, width);
    }
    this.width = width;
    this.widthStyled = width ? width + "px" : "";
    this.element.style.width = this.widthStyled;
    if (!this.isGroup) {
      this.cells.forEach(function(cell) {
        cell.setWidth();
      });
    }
    if (this.parent.isGroup) {
      this.parent.matchChildWidths();
    }
    this.dispatch("column-width", this);
    if (this.subscribedExternal("columnWidth")) {
      this.dispatchExternal("columnWidth", this.getComponent());
    }
  }
  checkCellHeights() {
    var rows2 = [];
    this.cells.forEach(function(cell) {
      if (cell.row.heightInitialized) {
        if (cell.row.getElement().offsetParent !== null) {
          rows2.push(cell.row);
          cell.row.clearCellHeight();
        } else {
          cell.row.heightInitialized = false;
        }
      }
    });
    rows2.forEach(function(row) {
      row.calcHeight();
    });
    rows2.forEach(function(row) {
      row.setCellHeight();
    });
  }
  getWidth() {
    var width = 0;
    if (this.isGroup) {
      this.columns.forEach(function(column) {
        if (column.visible) {
          width += column.getWidth();
        }
      });
    } else {
      width = this.width;
    }
    return width;
  }
  getLeftOffset() {
    var offset = this.element.offsetLeft;
    if (this.parent.isGroup) {
      offset += this.parent.getLeftOffset();
    }
    return offset;
  }
  getHeight() {
    return Math.ceil(this.element.getBoundingClientRect().height);
  }
  setMinWidth(minWidth) {
    if (this.maxWidth && minWidth > this.maxWidth) {
      minWidth = this.maxWidth;
      console.warn("the minWidth (" + minWidth + "px) for column '" + this.field + "' cannot be bigger that its maxWidth (" + this.maxWidthStyled + ")");
    }
    this.minWidth = minWidth;
    this.minWidthStyled = minWidth ? minWidth + "px" : "";
    this.element.style.minWidth = this.minWidthStyled;
    this.cells.forEach(function(cell) {
      cell.setMinWidth();
    });
  }
  setMaxWidth(maxWidth) {
    if (this.minWidth && maxWidth < this.minWidth) {
      maxWidth = this.minWidth;
      console.warn("the maxWidth (" + maxWidth + "px) for column '" + this.field + "' cannot be smaller that its minWidth (" + this.minWidthStyled + ")");
    }
    this.maxWidth = maxWidth;
    this.maxWidthStyled = maxWidth ? maxWidth + "px" : "";
    this.element.style.maxWidth = this.maxWidthStyled;
    this.cells.forEach(function(cell) {
      cell.setMaxWidth();
    });
  }
  delete() {
    return new Promise((resolve, reject) => {
      if (this.isGroup) {
        this.columns.forEach(function(column) {
          column.delete();
        });
      }
      this.dispatch("column-delete", this);
      var cellCount = this.cells.length;
      for (let i = 0; i < cellCount; i++) {
        this.cells[0].delete();
      }
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = false;
      this.contentElement = false;
      this.titleElement = false;
      this.groupElement = false;
      if (this.parent.isGroup) {
        this.parent.removeChild(this);
      }
      this.table.columnManager.deregisterColumn(this);
      this.table.columnManager.rerenderColumns(true);
      this.dispatch("column-deleted", this);
      resolve();
    });
  }
  columnRendered() {
    if (this.titleFormatterRendered) {
      this.titleFormatterRendered();
    }
    this.dispatch("column-rendered", this);
  }
  //////////////// Cell Management /////////////////
  //generate cell for this column
  generateCell(row) {
    var cell = new Cell(this, row);
    this.cells.push(cell);
    return cell;
  }
  nextColumn() {
    var index = this.table.columnManager.findColumnIndex(this);
    return index > -1 ? this._nextVisibleColumn(index + 1) : false;
  }
  _nextVisibleColumn(index) {
    var column = this.table.columnManager.getColumnByIndex(index);
    return !column || column.visible ? column : this._nextVisibleColumn(index + 1);
  }
  prevColumn() {
    var index = this.table.columnManager.findColumnIndex(this);
    return index > -1 ? this._prevVisibleColumn(index - 1) : false;
  }
  _prevVisibleColumn(index) {
    var column = this.table.columnManager.getColumnByIndex(index);
    return !column || column.visible ? column : this._prevVisibleColumn(index - 1);
  }
  reinitializeWidth(force) {
    this.widthFixed = false;
    if (typeof this.definition.width !== "undefined" && !force) {
      this.setWidth(this.definition.width);
    }
    this.dispatch("column-width-fit-before", this);
    this.fitToData(force);
    this.dispatch("column-width-fit-after", this);
  }
  //set column width to maximum cell width for non group columns
  fitToData(force) {
    if (this.isGroup) {
      return;
    }
    if (!this.widthFixed) {
      this.element.style.width = "";
      this.cells.forEach((cell) => {
        cell.clearWidth();
      });
    }
    var maxWidth = this.element.offsetWidth;
    if (!this.width || !this.widthFixed) {
      this.cells.forEach((cell) => {
        var width = cell.getWidth();
        if (width > maxWidth) {
          maxWidth = width;
        }
      });
      if (maxWidth) {
        var setTo = maxWidth + 1;
        if (force) {
          this.setWidth(setTo);
        } else {
          if (this.maxInitialWidth && !force) {
            setTo = Math.min(setTo, this.maxInitialWidth);
          }
          this.setWidthActual(setTo);
        }
      }
    }
  }
  updateDefinition(updates) {
    var definition;
    if (!this.isGroup) {
      if (!this.parent.isGroup) {
        definition = Object.assign({}, this.getDefinition());
        definition = Object.assign(definition, updates);
        return this.table.columnManager.addColumn(definition, false, this).then((column) => {
          if (definition.field == this.field) {
            this.field = false;
          }
          return this.delete().then(() => {
            return column.getComponent();
          });
        });
      } else {
        console.error("Column Update Error - The updateDefinition function is only available on ungrouped columns");
        return Promise.reject("Column Update Error - The updateDefinition function is only available on columns, not column groups");
      }
    } else {
      console.error("Column Update Error - The updateDefinition function is only available on ungrouped columns");
      return Promise.reject("Column Update Error - The updateDefinition function is only available on columns, not column groups");
    }
  }
  deleteCell(cell) {
    var index = this.cells.indexOf(cell);
    if (index > -1) {
      this.cells.splice(index, 1);
    }
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    if (!this.component) {
      this.component = new ColumnComponent(this);
    }
    return this.component;
  }
  getPosition() {
    return this.table.columnManager.getVisibleColumnsByIndex().indexOf(this) + 1;
  }
  getParentComponent() {
    return this.parent instanceof _Column ? this.parent.getComponent() : false;
  }
};
var RowComponent = class {
  constructor(row) {
    this._row = row;
    return new Proxy(this, {
      get: function(target, name, receiver) {
        if (typeof target[name] !== "undefined") {
          return target[name];
        } else {
          return target._row.table.componentFunctionBinder.handle("row", target._row, name);
        }
      }
    });
  }
  getData(transform) {
    return this._row.getData(transform);
  }
  getElement() {
    return this._row.getElement();
  }
  getCells() {
    var cells = [];
    this._row.getCells().forEach(function(cell) {
      cells.push(cell.getComponent());
    });
    return cells;
  }
  getCell(column) {
    var cell = this._row.getCell(column);
    return cell ? cell.getComponent() : false;
  }
  getIndex() {
    return this._row.getData("data")[this._row.table.options.index];
  }
  getPosition() {
    return this._row.getPosition();
  }
  watchPosition(callback) {
    return this._row.watchPosition(callback);
  }
  delete() {
    return this._row.delete();
  }
  scrollTo(position, ifVisible) {
    return this._row.table.rowManager.scrollToRow(this._row, position, ifVisible);
  }
  move(to, after) {
    this._row.moveToRow(to, after);
  }
  update(data) {
    return this._row.updateData(data);
  }
  normalizeHeight() {
    this._row.normalizeHeight(true);
  }
  _getSelf() {
    return this._row;
  }
  reformat() {
    return this._row.reinitialize();
  }
  getTable() {
    return this._row.table;
  }
  getNextRow() {
    var row = this._row.nextRow();
    return row ? row.getComponent() : row;
  }
  getPrevRow() {
    var row = this._row.prevRow();
    return row ? row.getComponent() : row;
  }
};
var Row = class extends CoreFeature {
  constructor(data, parent, type = "row") {
    super(parent.table);
    this.parent = parent;
    this.data = {};
    this.type = type;
    this.element = false;
    this.modules = {};
    this.cells = [];
    this.height = 0;
    this.heightStyled = "";
    this.manualHeight = false;
    this.outerHeight = 0;
    this.initialized = false;
    this.heightInitialized = false;
    this.position = 0;
    this.positionWatchers = [];
    this.component = null;
    this.created = false;
    this.setData(data);
  }
  create() {
    if (!this.created) {
      this.created = true;
      this.generateElement();
    }
  }
  createElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-row");
    el.setAttribute("role", "row");
    this.element = el;
  }
  getElement() {
    this.create();
    return this.element;
  }
  detachElement() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
  generateElement() {
    this.createElement();
    this.dispatch("row-init", this);
  }
  generateCells() {
    this.cells = this.table.columnManager.generateCells(this);
  }
  //functions to setup on first render
  initialize(force, inFragment) {
    this.create();
    if (!this.initialized || force) {
      this.deleteCells();
      while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
      this.dispatch("row-layout-before", this);
      this.generateCells();
      this.initialized = true;
      this.table.columnManager.renderer.renderRowCells(this, inFragment);
      if (force) {
        this.normalizeHeight();
      }
      this.dispatch("row-layout", this);
      if (this.table.options.rowFormatter) {
        this.table.options.rowFormatter(this.getComponent());
      }
      this.dispatch("row-layout-after", this);
    } else {
      this.table.columnManager.renderer.rerenderRowCells(this, inFragment);
    }
  }
  rendered() {
    this.cells.forEach((cell) => {
      cell.cellRendered();
    });
  }
  reinitializeHeight() {
    this.heightInitialized = false;
    if (this.element && this.element.offsetParent !== null) {
      this.normalizeHeight(true);
    }
  }
  deinitialize() {
    this.initialized = false;
  }
  deinitializeHeight() {
    this.heightInitialized = false;
  }
  reinitialize(children) {
    this.initialized = false;
    this.heightInitialized = false;
    if (!this.manualHeight) {
      this.height = 0;
      this.heightStyled = "";
    }
    if (this.element && this.element.offsetParent !== null) {
      this.initialize(true);
    }
    this.dispatch("row-relayout", this);
  }
  //get heights when doing bulk row style calcs in virtual DOM
  calcHeight(force) {
    var maxHeight = 0, minHeight = 0;
    if (this.table.options.rowHeight) {
      this.height = this.table.options.rowHeight;
    } else {
      minHeight = this.calcMinHeight();
      maxHeight = this.calcMaxHeight();
      if (force) {
        this.height = Math.max(maxHeight, minHeight);
      } else {
        this.height = this.manualHeight ? this.height : Math.max(maxHeight, minHeight);
      }
    }
    this.heightStyled = this.height ? this.height + "px" : "";
    this.outerHeight = this.element.offsetHeight;
  }
  calcMinHeight() {
    return this.table.options.resizableRows ? this.element.clientHeight : 0;
  }
  calcMaxHeight() {
    var maxHeight = 0;
    this.cells.forEach(function(cell) {
      var height = cell.getHeight();
      if (height > maxHeight) {
        maxHeight = height;
      }
    });
    return maxHeight;
  }
  //set of cells
  setCellHeight() {
    this.cells.forEach(function(cell) {
      cell.setHeight();
    });
    this.heightInitialized = true;
  }
  clearCellHeight() {
    this.cells.forEach(function(cell) {
      cell.clearHeight();
    });
  }
  //normalize the height of elements in the row
  normalizeHeight(force) {
    if (force && !this.table.options.rowHeight) {
      this.clearCellHeight();
    }
    this.calcHeight(force);
    this.setCellHeight();
  }
  //set height of rows
  setHeight(height, force) {
    if (this.height != height || force) {
      this.manualHeight = true;
      this.height = height;
      this.heightStyled = height ? height + "px" : "";
      this.setCellHeight();
      this.outerHeight = this.element.offsetHeight;
      if (this.subscribedExternal("rowHeight")) {
        this.dispatchExternal("rowHeight", this.getComponent());
      }
    }
  }
  //return rows outer height
  getHeight() {
    return this.outerHeight;
  }
  //return rows outer Width
  getWidth() {
    return this.element.offsetWidth;
  }
  //////////////// Cell Management /////////////////
  deleteCell(cell) {
    var index = this.cells.indexOf(cell);
    if (index > -1) {
      this.cells.splice(index, 1);
    }
  }
  //////////////// Data Management /////////////////
  setData(data) {
    this.data = this.chain("row-data-init-before", [this, data], void 0, data);
    this.dispatch("row-data-init-after", this);
  }
  //update the rows data
  updateData(updatedData) {
    var visible = this.element && Helpers.elVisible(this.element), tempData = {}, newRowData;
    return new Promise((resolve, reject) => {
      if (typeof updatedData === "string") {
        updatedData = JSON.parse(updatedData);
      }
      this.dispatch("row-data-save-before", this);
      if (this.subscribed("row-data-changing")) {
        tempData = Object.assign(tempData, this.data);
        tempData = Object.assign(tempData, updatedData);
      }
      newRowData = this.chain("row-data-changing", [this, tempData, updatedData], null, updatedData);
      for (let attrname in newRowData) {
        this.data[attrname] = newRowData[attrname];
      }
      this.dispatch("row-data-save-after", this);
      for (let attrname in updatedData) {
        let columns = this.table.columnManager.getColumnsByFieldRoot(attrname);
        columns.forEach((column) => {
          let cell = this.getCell(column.getField());
          if (cell) {
            let value = column.getFieldValue(newRowData);
            if (cell.getValue() !== value) {
              cell.setValueProcessData(value);
              if (visible) {
                cell.cellRendered();
              }
            }
          }
        });
      }
      if (visible) {
        this.normalizeHeight(true);
        if (this.table.options.rowFormatter) {
          this.table.options.rowFormatter(this.getComponent());
        }
      } else {
        this.initialized = false;
        this.height = 0;
        this.heightStyled = "";
      }
      this.dispatch("row-data-changed", this, visible, updatedData);
      this.dispatchExternal("rowUpdated", this.getComponent());
      if (this.subscribedExternal("dataChanged")) {
        this.dispatchExternal("dataChanged", this.table.rowManager.getData());
      }
      resolve();
    });
  }
  getData(transform) {
    if (transform) {
      return this.chain("row-data-retrieve", [this, transform], null, this.data);
    }
    return this.data;
  }
  getCell(column) {
    var match = false;
    column = this.table.columnManager.findColumn(column);
    if (!this.initialized && this.cells.length === 0) {
      this.generateCells();
    }
    match = this.cells.find(function(cell) {
      return cell.column === column;
    });
    return match;
  }
  getCellIndex(findCell) {
    return this.cells.findIndex(function(cell) {
      return cell === findCell;
    });
  }
  findCell(subject) {
    return this.cells.find((cell) => {
      return cell.element === subject;
    });
  }
  getCells() {
    if (!this.initialized && this.cells.length === 0) {
      this.generateCells();
    }
    return this.cells;
  }
  nextRow() {
    var row = this.table.rowManager.nextDisplayRow(this, true);
    return row || false;
  }
  prevRow() {
    var row = this.table.rowManager.prevDisplayRow(this, true);
    return row || false;
  }
  moveToRow(to, before) {
    var toRow = this.table.rowManager.findRow(to);
    if (toRow) {
      this.table.rowManager.moveRowActual(this, toRow, !before);
      this.table.rowManager.refreshActiveData("display", false, true);
    } else {
      console.warn("Move Error - No matching row found:", to);
    }
  }
  ///////////////////// Actions  /////////////////////
  delete() {
    this.dispatch("row-delete", this);
    this.deleteActual();
    return Promise.resolve();
  }
  deleteActual(blockRedraw) {
    this.detachModules();
    this.table.rowManager.deleteRow(this, blockRedraw);
    this.deleteCells();
    this.initialized = false;
    this.heightInitialized = false;
    this.element = false;
    this.dispatch("row-deleted", this);
  }
  detachModules() {
    this.dispatch("row-deleting", this);
  }
  deleteCells() {
    var cellCount = this.cells.length;
    for (let i = 0; i < cellCount; i++) {
      this.cells[0].delete();
    }
  }
  wipe() {
    this.detachModules();
    this.deleteCells();
    if (this.element) {
      while (this.element.firstChild) this.element.removeChild(this.element.firstChild);
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
    }
    this.element = false;
    this.modules = {};
  }
  isDisplayed() {
    return this.table.rowManager.getDisplayRows().includes(this);
  }
  getPosition() {
    return this.isDisplayed() ? this.position : false;
  }
  setPosition(position) {
    if (position != this.position) {
      this.position = position;
      this.positionWatchers.forEach((callback) => {
        callback(this.position);
      });
    }
  }
  watchPosition(callback) {
    this.positionWatchers.push(callback);
    callback(this.position);
  }
  getGroup() {
    return this.modules.group || false;
  }
  //////////////// Object Generation /////////////////
  getComponent() {
    if (!this.component) {
      this.component = new RowComponent(this);
    }
    return this.component;
  }
};
var defaultOptions = {
  debugEventsExternal: false,
  //flag to console log events
  debugEventsInternal: false,
  //flag to console log events
  debugInvalidOptions: true,
  //allow toggling of invalid option warnings
  debugInvalidComponentFuncs: true,
  //allow toggling of invalid component warnings
  debugInitialization: true,
  //allow toggling of pre initialization function call warnings
  debugDeprecation: true,
  //allow toggling of deprecation warnings
  height: false,
  //height of tabulator
  minHeight: false,
  //minimum height of tabulator
  maxHeight: false,
  //maximum height of tabulator
  columnHeaderVertAlign: "top",
  //vertical alignment of column headers
  popupContainer: false,
  columns: [],
  //store for colum header info
  columnDefaults: {},
  //store column default props
  rowHeader: false,
  data: false,
  //default starting data
  autoColumns: false,
  //build columns from data row structure
  autoColumnsDefinitions: false,
  nestedFieldSeparator: ".",
  //separator for nested data
  footerElement: false,
  //hold footer element
  index: "id",
  //filed for row index
  textDirection: "auto",
  addRowPos: "bottom",
  //position to insert blank rows, top|bottom
  headerVisible: true,
  //hide header
  renderVertical: "virtual",
  renderHorizontal: "basic",
  renderVerticalBuffer: 0,
  // set virtual DOM buffer size
  scrollToRowPosition: "top",
  scrollToRowIfVisible: true,
  scrollToColumnPosition: "left",
  scrollToColumnIfVisible: true,
  rowFormatter: false,
  rowFormatterPrint: null,
  rowFormatterClipboard: null,
  rowFormatterHtmlOutput: null,
  rowHeight: null,
  placeholder: false,
  dataLoader: true,
  dataLoaderLoading: false,
  dataLoaderError: false,
  dataLoaderErrorTimeout: 3e3,
  dataSendParams: {},
  dataReceiveParams: {},
  dependencies: {}
};
var OptionsList = class {
  constructor(table2, msgType, defaults = {}) {
    this.table = table2;
    this.msgType = msgType;
    this.registeredDefaults = Object.assign({}, defaults);
  }
  register(option, value) {
    this.registeredDefaults[option] = value;
  }
  generate(defaultOptions2, userOptions = {}) {
    var output = Object.assign({}, this.registeredDefaults), warn = this.table.options.debugInvalidOptions || userOptions.debugInvalidOptions === true;
    Object.assign(output, defaultOptions2);
    for (let key in userOptions) {
      if (!output.hasOwnProperty(key)) {
        if (warn) {
          console.warn("Invalid " + this.msgType + " option:", key);
        }
        output[key] = userOptions.key;
      }
    }
    for (let key in output) {
      if (key in userOptions) {
        output[key] = userOptions[key];
      } else {
        if (Array.isArray(output[key])) {
          output[key] = Object.assign([], output[key]);
        } else if (typeof output[key] === "object" && output[key] !== null) {
          output[key] = Object.assign({}, output[key]);
        } else if (typeof output[key] === "undefined") {
          delete output[key];
        }
      }
    }
    return output;
  }
};
var Renderer = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.elementVertical = table2.rowManager.element;
    this.elementHorizontal = table2.columnManager.element;
    this.tableElement = table2.rowManager.tableElement;
    this.verticalFillMode = "fit";
  }
  ///////////////////////////////////
  /////// Internal Bindings /////////
  ///////////////////////////////////
  initialize() {
  }
  clearRows() {
  }
  clearColumns() {
  }
  reinitializeColumnWidths(columns) {
  }
  renderRows() {
  }
  renderColumns() {
  }
  rerenderRows(callback) {
    if (callback) {
      callback();
    }
  }
  rerenderColumns(update, blockRedraw) {
  }
  renderRowCells(row) {
  }
  rerenderRowCells(row, force) {
  }
  scrollColumns(left, dir) {
  }
  scrollRows(top, dir) {
  }
  resize() {
  }
  scrollToRow(row) {
  }
  scrollToRowNearestTop(row) {
  }
  visibleRows(includingBuffer) {
    return [];
  }
  ///////////////////////////////////
  //////// Helper Functions /////////
  ///////////////////////////////////
  rows() {
    return this.table.rowManager.getDisplayRows();
  }
  styleRow(row, index) {
    var rowEl = row.getElement();
    if (index % 2) {
      rowEl.classList.add("tabulator-row-even");
      rowEl.classList.remove("tabulator-row-odd");
    } else {
      rowEl.classList.add("tabulator-row-odd");
      rowEl.classList.remove("tabulator-row-even");
    }
  }
  ///////////////////////////////////
  /////// External Triggers /////////
  /////// (DO NOT OVERRIDE) /////////
  ///////////////////////////////////
  clear() {
    this.clearRows();
    this.clearColumns();
  }
  render() {
    this.renderRows();
    this.renderColumns();
  }
  rerender(callback) {
    this.rerenderRows();
    this.rerenderColumns();
  }
  scrollToRowPosition(row, position, ifVisible) {
    var rowIndex = this.rows().indexOf(row), rowEl = row.getElement(), offset = 0;
    return new Promise((resolve, reject) => {
      if (rowIndex > -1) {
        if (typeof ifVisible === "undefined") {
          ifVisible = this.table.options.scrollToRowIfVisible;
        }
        if (!ifVisible) {
          if (Helpers.elVisible(rowEl)) {
            offset = Helpers.elOffset(rowEl).top - Helpers.elOffset(this.elementVertical).top;
            if (offset > 0 && offset < this.elementVertical.clientHeight - rowEl.offsetHeight) {
              resolve();
              return false;
            }
          }
        }
        if (typeof position === "undefined") {
          position = this.table.options.scrollToRowPosition;
        }
        if (position === "nearest") {
          position = this.scrollToRowNearestTop(row) ? "top" : "bottom";
        }
        this.scrollToRow(row);
        switch (position) {
          case "middle":
          case "center":
            if (this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight) {
              this.elementVertical.scrollTop = this.elementVertical.scrollTop + (rowEl.offsetTop - this.elementVertical.scrollTop) - (this.elementVertical.scrollHeight - rowEl.offsetTop) / 2;
            } else {
              this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight / 2;
            }
            break;
          case "bottom":
            if (this.elementVertical.scrollHeight - this.elementVertical.scrollTop == this.elementVertical.clientHeight) {
              this.elementVertical.scrollTop = this.elementVertical.scrollTop - (this.elementVertical.scrollHeight - rowEl.offsetTop) + rowEl.offsetHeight;
            } else {
              this.elementVertical.scrollTop = this.elementVertical.scrollTop - this.elementVertical.clientHeight + rowEl.offsetHeight;
            }
            break;
          case "top":
            this.elementVertical.scrollTop = rowEl.offsetTop;
            break;
        }
        resolve();
      } else {
        console.warn("Scroll Error - Row not visible");
        reject("Scroll Error - Row not visible");
      }
    });
  }
};
var BasicHorizontal = class extends Renderer {
  constructor(table2) {
    super(table2);
  }
  renderRowCells(row, inFragment) {
    const rowFrag = document.createDocumentFragment();
    row.cells.forEach((cell) => {
      rowFrag.appendChild(cell.getElement());
    });
    row.element.appendChild(rowFrag);
    if (!inFragment) {
      row.cells.forEach((cell) => {
        cell.cellRendered();
      });
    }
  }
  reinitializeColumnWidths(columns) {
    columns.forEach(function(column) {
      column.reinitializeWidth();
    });
  }
};
var VirtualDomHorizontal = class extends Renderer {
  constructor(table2) {
    super(table2);
    this.leftCol = 0;
    this.rightCol = 0;
    this.scrollLeft = 0;
    this.vDomScrollPosLeft = 0;
    this.vDomScrollPosRight = 0;
    this.vDomPadLeft = 0;
    this.vDomPadRight = 0;
    this.fitDataColAvg = 0;
    this.windowBuffer = 200;
    this.visibleRows = null;
    this.initialized = false;
    this.isFitData = false;
    this.columns = [];
  }
  initialize() {
    this.compatibilityCheck();
    this.layoutCheck();
    this.vertScrollListen();
  }
  compatibilityCheck() {
    if (this.options("layout") == "fitDataTable") {
      console.warn("Horizontal Virtual DOM is not compatible with fitDataTable layout mode");
    }
    if (this.options("responsiveLayout")) {
      console.warn("Horizontal Virtual DOM is not compatible with responsive columns");
    }
    if (this.options("rtl")) {
      console.warn("Horizontal Virtual DOM is not currently compatible with RTL text direction");
    }
  }
  layoutCheck() {
    this.isFitData = this.options("layout").startsWith("fitData");
  }
  vertScrollListen() {
    this.subscribe("scroll-vertical", this.clearVisRowCache.bind(this));
    this.subscribe("data-refreshed", this.clearVisRowCache.bind(this));
  }
  clearVisRowCache() {
    this.visibleRows = null;
  }
  //////////////////////////////////////
  ///////// Public Functions ///////////
  //////////////////////////////////////
  renderColumns(row, force) {
    this.dataChange();
  }
  scrollColumns(left, dir) {
    if (this.scrollLeft != left) {
      this.scrollLeft = left;
      this.scroll(left - (this.vDomScrollPosLeft + this.windowBuffer));
    }
  }
  calcWindowBuffer() {
    var buffer = this.elementVertical.clientWidth;
    this.table.columnManager.columnsByIndex.forEach((column) => {
      if (column.visible) {
        var width = column.getWidth();
        if (width > buffer) {
          buffer = width;
        }
      }
    });
    this.windowBuffer = buffer * 2;
  }
  rerenderColumns(update, blockRedraw) {
    var old = {
      cols: this.columns,
      leftCol: this.leftCol,
      rightCol: this.rightCol
    }, colPos = 0;
    if (update && !this.initialized) {
      return;
    }
    this.clear();
    this.calcWindowBuffer();
    this.scrollLeft = this.elementVertical.scrollLeft;
    this.vDomScrollPosLeft = this.scrollLeft - this.windowBuffer;
    this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer;
    this.table.columnManager.columnsByIndex.forEach((column) => {
      var config = {}, width;
      if (column.visible) {
        if (!column.modules.frozen) {
          width = column.getWidth();
          config.leftPos = colPos;
          config.rightPos = colPos + width;
          config.width = width;
          if (this.isFitData) {
            config.fitDataCheck = column.modules.vdomHoz ? column.modules.vdomHoz.fitDataCheck : true;
          }
          if (colPos + width > this.vDomScrollPosLeft && colPos < this.vDomScrollPosRight) {
            if (this.leftCol == -1) {
              this.leftCol = this.columns.length;
              this.vDomPadLeft = colPos;
            }
            this.rightCol = this.columns.length;
          } else {
            if (this.leftCol !== -1) {
              this.vDomPadRight += width;
            }
          }
          this.columns.push(column);
          column.modules.vdomHoz = config;
          colPos += width;
        }
      }
    });
    this.tableElement.style.paddingLeft = this.vDomPadLeft + "px";
    this.tableElement.style.paddingRight = this.vDomPadRight + "px";
    this.initialized = true;
    if (!blockRedraw) {
      if (!update || this.reinitChanged(old)) {
        this.reinitializeRows();
      }
    }
    this.elementVertical.scrollLeft = this.scrollLeft;
  }
  renderRowCells(row) {
    if (this.initialized) {
      this.initializeRow(row);
    } else {
      const rowFrag = document.createDocumentFragment();
      row.cells.forEach((cell) => {
        rowFrag.appendChild(cell.getElement());
      });
      row.element.appendChild(rowFrag);
      row.cells.forEach((cell) => {
        cell.cellRendered();
      });
    }
  }
  rerenderRowCells(row, force) {
    this.reinitializeRow(row, force);
  }
  reinitializeColumnWidths(columns) {
    for (let i = this.leftCol; i <= this.rightCol; i++) {
      let col = this.columns[i];
      if (col) {
        col.reinitializeWidth();
      }
    }
  }
  //////////////////////////////////////
  //////// Internal Rendering //////////
  //////////////////////////////////////
  deinitialize() {
    this.initialized = false;
  }
  clear() {
    this.columns = [];
    this.leftCol = -1;
    this.rightCol = 0;
    this.vDomScrollPosLeft = 0;
    this.vDomScrollPosRight = 0;
    this.vDomPadLeft = 0;
    this.vDomPadRight = 0;
  }
  dataChange() {
    var change = false, row, rowEl;
    if (this.isFitData) {
      this.table.columnManager.columnsByIndex.forEach((column) => {
        if (!column.definition.width && column.visible) {
          change = true;
        }
      });
      if (change && this.table.rowManager.getDisplayRows().length) {
        this.vDomScrollPosRight = this.scrollLeft + this.elementVertical.clientWidth + this.windowBuffer;
        row = this.chain("rows-sample", [1], [], () => {
          return this.table.rowManager.getDisplayRows();
        })[0];
        if (row) {
          rowEl = row.getElement();
          row.generateCells();
          this.tableElement.appendChild(rowEl);
          for (let colEnd = 0; colEnd < row.cells.length; colEnd++) {
            let cell = row.cells[colEnd];
            rowEl.appendChild(cell.getElement());
            cell.column.reinitializeWidth();
          }
          rowEl.parentNode.removeChild(rowEl);
          this.rerenderColumns(false, true);
        }
      }
    } else {
      if (this.options("layout") === "fitColumns") {
        this.layoutRefresh();
        this.rerenderColumns(false, true);
      }
    }
  }
  reinitChanged(old) {
    var match = true;
    if (old.cols.length !== this.columns.length || old.leftCol !== this.leftCol || old.rightCol !== this.rightCol) {
      return true;
    }
    old.cols.forEach((col, i) => {
      if (col !== this.columns[i]) {
        match = false;
      }
    });
    return !match;
  }
  reinitializeRows() {
    var visibleRows = this.getVisibleRows(), otherRows = this.table.rowManager.getRows().filter((row) => !visibleRows.includes(row));
    visibleRows.forEach((row) => {
      this.reinitializeRow(row, true);
    });
    otherRows.forEach((row) => {
      row.deinitialize();
    });
  }
  getVisibleRows() {
    if (!this.visibleRows) {
      this.visibleRows = this.table.rowManager.getVisibleRows();
    }
    return this.visibleRows;
  }
  scroll(diff) {
    this.vDomScrollPosLeft += diff;
    this.vDomScrollPosRight += diff;
    if (Math.abs(diff) > this.windowBuffer / 2) {
      this.rerenderColumns();
    } else {
      if (diff > 0) {
        this.addColRight();
        this.removeColLeft();
      } else {
        this.addColLeft();
        this.removeColRight();
      }
    }
  }
  colPositionAdjust(start, end, diff) {
    for (let i = start; i < end; i++) {
      let column = this.columns[i];
      column.modules.vdomHoz.leftPos += diff;
      column.modules.vdomHoz.rightPos += diff;
    }
  }
  addColRight() {
    var changes = false, working = true;
    while (working) {
      let column = this.columns[this.rightCol + 1];
      if (column) {
        if (column.modules.vdomHoz.leftPos <= this.vDomScrollPosRight) {
          changes = true;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              var cell = row.getCell(column);
              row.getElement().insertBefore(cell.getElement(), row.getCell(this.columns[this.rightCol]).getElement().nextSibling);
              cell.cellRendered();
            }
          });
          this.fitDataColActualWidthCheck(column);
          this.rightCol++;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              row.modules.vdomHoz.rightCol = this.rightCol;
            }
          });
          if (this.rightCol >= this.columns.length - 1) {
            this.vDomPadRight = 0;
          } else {
            this.vDomPadRight -= column.getWidth();
          }
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    if (changes) {
      this.tableElement.style.paddingRight = this.vDomPadRight + "px";
    }
  }
  addColLeft() {
    var changes = false, working = true;
    while (working) {
      let column = this.columns[this.leftCol - 1];
      if (column) {
        if (column.modules.vdomHoz.rightPos >= this.vDomScrollPosLeft) {
          changes = true;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              var cell = row.getCell(column);
              row.getElement().insertBefore(cell.getElement(), row.getCell(this.columns[this.leftCol]).getElement());
              cell.cellRendered();
            }
          });
          this.leftCol--;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              row.modules.vdomHoz.leftCol = this.leftCol;
            }
          });
          if (this.leftCol <= 0) {
            this.vDomPadLeft = 0;
          } else {
            this.vDomPadLeft -= column.getWidth();
          }
          let diff = this.fitDataColActualWidthCheck(column);
          if (diff) {
            this.scrollLeft = this.elementVertical.scrollLeft = this.elementVertical.scrollLeft + diff;
            this.vDomPadRight -= diff;
          }
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    if (changes) {
      this.tableElement.style.paddingLeft = this.vDomPadLeft + "px";
    }
  }
  removeColRight() {
    var changes = false, working = true;
    while (working) {
      let column = this.columns[this.rightCol];
      if (column) {
        if (column.modules.vdomHoz.leftPos > this.vDomScrollPosRight) {
          changes = true;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              var cell = row.getCell(column);
              try {
                row.getElement().removeChild(cell.getElement());
              } catch (ex) {
                console.warn("Could not removeColRight", ex.message);
              }
            }
          });
          this.vDomPadRight += column.getWidth();
          this.rightCol--;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              row.modules.vdomHoz.rightCol = this.rightCol;
            }
          });
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    if (changes) {
      this.tableElement.style.paddingRight = this.vDomPadRight + "px";
    }
  }
  removeColLeft() {
    var changes = false, working = true;
    while (working) {
      let column = this.columns[this.leftCol];
      if (column) {
        if (column.modules.vdomHoz.rightPos < this.vDomScrollPosLeft) {
          changes = true;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              var cell = row.getCell(column);
              try {
                row.getElement().removeChild(cell.getElement());
              } catch (ex) {
                console.warn("Could not removeColLeft", ex.message);
              }
            }
          });
          this.vDomPadLeft += column.getWidth();
          this.leftCol++;
          this.getVisibleRows().forEach((row) => {
            if (row.type !== "group") {
              row.modules.vdomHoz.leftCol = this.leftCol;
            }
          });
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    if (changes) {
      this.tableElement.style.paddingLeft = this.vDomPadLeft + "px";
    }
  }
  fitDataColActualWidthCheck(column) {
    var newWidth, widthDiff;
    if (column.modules.vdomHoz.fitDataCheck) {
      column.reinitializeWidth();
      newWidth = column.getWidth();
      widthDiff = newWidth - column.modules.vdomHoz.width;
      if (widthDiff) {
        column.modules.vdomHoz.rightPos += widthDiff;
        column.modules.vdomHoz.width = newWidth;
        this.colPositionAdjust(this.columns.indexOf(column) + 1, this.columns.length, widthDiff);
      }
      column.modules.vdomHoz.fitDataCheck = false;
    }
    return widthDiff;
  }
  initializeRow(row) {
    if (row.type !== "group") {
      row.modules.vdomHoz = {
        leftCol: this.leftCol,
        rightCol: this.rightCol
      };
      if (this.table.modules.frozenColumns) {
        this.table.modules.frozenColumns.leftColumns.forEach((column) => {
          this.appendCell(row, column);
        });
      }
      for (let i = this.leftCol; i <= this.rightCol; i++) {
        this.appendCell(row, this.columns[i]);
      }
      if (this.table.modules.frozenColumns) {
        this.table.modules.frozenColumns.rightColumns.forEach((column) => {
          this.appendCell(row, column);
        });
      }
    }
  }
  appendCell(row, column) {
    if (column && column.visible) {
      let cell = row.getCell(column);
      row.getElement().appendChild(cell.getElement());
      cell.cellRendered();
    }
  }
  reinitializeRow(row, force) {
    if (row.type !== "group") {
      if (force || !row.modules.vdomHoz || row.modules.vdomHoz.leftCol !== this.leftCol || row.modules.vdomHoz.rightCol !== this.rightCol) {
        var rowEl = row.getElement();
        while (rowEl.firstChild) rowEl.removeChild(rowEl.firstChild);
        this.initializeRow(row);
      }
    }
  }
};
var ColumnManager = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.blockHozScrollEvent = false;
    this.headersElement = null;
    this.contentsElement = null;
    this.rowHeader = null;
    this.element = null;
    this.columns = [];
    this.columnsByIndex = [];
    this.columnsByField = {};
    this.scrollLeft = 0;
    this.optionsList = new OptionsList(this.table, "column definition", defaultColumnOptions);
    this.redrawBlock = false;
    this.redrawBlockUpdate = null;
    this.renderer = null;
  }
  ////////////// Setup Functions /////////////////
  initialize() {
    this.initializeRenderer();
    this.headersElement = this.createHeadersElement();
    this.contentsElement = this.createHeaderContentsElement();
    this.element = this.createHeaderElement();
    this.contentsElement.insertBefore(this.headersElement, this.contentsElement.firstChild);
    this.element.insertBefore(this.contentsElement, this.element.firstChild);
    this.initializeScrollWheelWatcher();
    this.subscribe("scroll-horizontal", this.scrollHorizontal.bind(this));
    this.subscribe("scrollbar-vertical", this.padVerticalScrollbar.bind(this));
  }
  padVerticalScrollbar(width) {
    if (this.table.rtl) {
      this.headersElement.style.marginLeft = width + "px";
    } else {
      this.headersElement.style.marginRight = width + "px";
    }
  }
  initializeRenderer() {
    var renderClass;
    var renderers = {
      "virtual": VirtualDomHorizontal,
      "basic": BasicHorizontal
    };
    if (typeof this.table.options.renderHorizontal === "string") {
      renderClass = renderers[this.table.options.renderHorizontal];
    } else {
      renderClass = this.table.options.renderHorizontal;
    }
    if (renderClass) {
      this.renderer = new renderClass(this.table, this.element, this.tableElement);
      this.renderer.initialize();
    } else {
      console.error("Unable to find matching renderer:", this.table.options.renderHorizontal);
    }
  }
  createHeadersElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-headers");
    el.setAttribute("role", "row");
    return el;
  }
  createHeaderContentsElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-header-contents");
    el.setAttribute("role", "rowgroup");
    return el;
  }
  createHeaderElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-header");
    el.setAttribute("role", "rowgroup");
    if (!this.table.options.headerVisible) {
      el.classList.add("tabulator-header-hidden");
    }
    return el;
  }
  //return containing element
  getElement() {
    return this.element;
  }
  //return containing contents element
  getContentsElement() {
    return this.contentsElement;
  }
  //return header containing element
  getHeadersElement() {
    return this.headersElement;
  }
  //scroll horizontally to match table body
  scrollHorizontal(left) {
    this.contentsElement.scrollLeft = left;
    this.scrollLeft = left;
    this.renderer.scrollColumns(left);
  }
  initializeScrollWheelWatcher() {
    this.contentsElement.addEventListener("wheel", (e) => {
      var left;
      if (e.deltaX) {
        left = this.contentsElement.scrollLeft + e.deltaX;
        this.table.rowManager.scrollHorizontal(left);
        this.table.columnManager.scrollHorizontal(left);
      }
    });
  }
  ///////////// Column Setup Functions /////////////
  generateColumnsFromRowData(data) {
    var cols = [], collProgress = {}, rowSample = this.table.options.autoColumns === "full" ? data : [data[0]], definitions = this.table.options.autoColumnsDefinitions;
    if (data && data.length) {
      rowSample.forEach((row) => {
        Object.keys(row).forEach((key, index) => {
          let value = row[key], col;
          if (!collProgress[key]) {
            col = {
              field: key,
              title: key,
              sorter: this.calculateSorterFromValue(value)
            };
            cols.splice(index, 0, col);
            collProgress[key] = typeof value === "undefined" ? col : true;
          } else if (collProgress[key] !== true) {
            if (typeof value !== "undefined") {
              collProgress[key].sorter = this.calculateSorterFromValue(value);
              collProgress[key] = true;
            }
          }
        });
      });
      if (definitions) {
        switch (typeof definitions) {
          case "function":
            this.table.options.columns = definitions.call(this.table, cols);
            break;
          case "object":
            if (Array.isArray(definitions)) {
              cols.forEach((col) => {
                var match = definitions.find((def) => {
                  return def.field === col.field;
                });
                if (match) {
                  Object.assign(col, match);
                }
              });
            } else {
              cols.forEach((col) => {
                if (definitions[col.field]) {
                  Object.assign(col, definitions[col.field]);
                }
              });
            }
            this.table.options.columns = cols;
            break;
        }
      } else {
        this.table.options.columns = cols;
      }
      this.setColumns(this.table.options.columns);
    }
  }
  calculateSorterFromValue(value) {
    var sorter;
    switch (typeof value) {
      case "undefined":
        sorter = "string";
        break;
      case "boolean":
        sorter = "boolean";
        break;
      case "number":
        sorter = "number";
        break;
      case "object":
        if (Array.isArray(value)) {
          sorter = "array";
        } else {
          sorter = "string";
        }
        break;
      default:
        if (!isNaN(value) && value !== "") {
          sorter = "number";
        } else {
          if (value.match(/((^[0-9]+[a-z]+)|(^[a-z]+[0-9]+))+$/i)) {
            sorter = "alphanum";
          } else {
            sorter = "string";
          }
        }
        break;
    }
    return sorter;
  }
  setColumns(cols, row) {
    while (this.headersElement.firstChild) this.headersElement.removeChild(this.headersElement.firstChild);
    this.columns = [];
    this.columnsByIndex = [];
    this.columnsByField = {};
    this.dispatch("columns-loading");
    this.dispatchExternal("columnsLoading");
    if (this.table.options.rowHeader) {
      this.rowHeader = new Column(this.table.options.rowHeader === true ? {} : this.table.options.rowHeader, this, true);
      this.columns.push(this.rowHeader);
      this.headersElement.appendChild(this.rowHeader.getElement());
      this.rowHeader.columnRendered();
    }
    cols.forEach((def, i) => {
      this._addColumn(def);
    });
    this._reIndexColumns();
    this.dispatch("columns-loaded");
    if (this.subscribedExternal("columnsLoaded")) {
      this.dispatchExternal("columnsLoaded", this.getComponents());
    }
    this.rerenderColumns(false, true);
    this.redraw(true);
  }
  _addColumn(definition, before, nextToColumn) {
    var column = new Column(definition, this), colEl = column.getElement(), index = nextToColumn ? this.findColumnIndex(nextToColumn) : nextToColumn;
    if (before && this.rowHeader && (!nextToColumn || nextToColumn === this.rowHeader)) {
      before = false;
      nextToColumn = this.rowHeader;
      index = 0;
    }
    if (nextToColumn && index > -1) {
      var topColumn = nextToColumn.getTopColumn();
      var parentIndex = this.columns.indexOf(topColumn);
      var nextEl = topColumn.getElement();
      if (before) {
        this.columns.splice(parentIndex, 0, column);
        nextEl.parentNode.insertBefore(colEl, nextEl);
      } else {
        this.columns.splice(parentIndex + 1, 0, column);
        nextEl.parentNode.insertBefore(colEl, nextEl.nextSibling);
      }
    } else {
      if (before) {
        this.columns.unshift(column);
        this.headersElement.insertBefore(column.getElement(), this.headersElement.firstChild);
      } else {
        this.columns.push(column);
        this.headersElement.appendChild(column.getElement());
      }
    }
    column.columnRendered();
    return column;
  }
  registerColumnField(col) {
    if (col.definition.field) {
      this.columnsByField[col.definition.field] = col;
    }
  }
  registerColumnPosition(col) {
    this.columnsByIndex.push(col);
  }
  _reIndexColumns() {
    this.columnsByIndex = [];
    this.columns.forEach(function(column) {
      column.reRegisterPosition();
    });
  }
  //ensure column headers take up the correct amount of space in column groups
  verticalAlignHeaders() {
    var minHeight = 0;
    if (!this.redrawBlock) {
      this.headersElement.style.height = "";
      this.columns.forEach((column) => {
        column.clearVerticalAlign();
      });
      this.columns.forEach((column) => {
        var height = column.getHeight();
        if (height > minHeight) {
          minHeight = height;
        }
      });
      this.headersElement.style.height = minHeight + "px";
      this.columns.forEach((column) => {
        column.verticalAlign(this.table.options.columnHeaderVertAlign, minHeight);
      });
      this.table.rowManager.adjustTableSize();
    }
  }
  //////////////// Column Details /////////////////
  findColumn(subject) {
    var columns;
    if (typeof subject == "object") {
      if (subject instanceof Column) {
        return subject;
      } else if (subject instanceof ColumnComponent) {
        return subject._getSelf() || false;
      } else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {
        columns = [];
        this.columns.forEach((column) => {
          columns.push(column);
          columns = columns.concat(column.getColumns(true));
        });
        let match = columns.find((column) => {
          return column.element === subject;
        });
        return match || false;
      }
    } else {
      return this.columnsByField[subject] || false;
    }
    return false;
  }
  getColumnByField(field) {
    return this.columnsByField[field];
  }
  getColumnsByFieldRoot(root) {
    var matches = [];
    Object.keys(this.columnsByField).forEach((field) => {
      var fieldRoot = this.table.options.nestedFieldSeparator ? field.split(this.table.options.nestedFieldSeparator)[0] : field;
      if (fieldRoot === root) {
        matches.push(this.columnsByField[field]);
      }
    });
    return matches;
  }
  getColumnByIndex(index) {
    return this.columnsByIndex[index];
  }
  getFirstVisibleColumn() {
    var index = this.columnsByIndex.findIndex((col) => {
      return col.visible;
    });
    return index > -1 ? this.columnsByIndex[index] : false;
  }
  getVisibleColumnsByIndex() {
    return this.columnsByIndex.filter((col) => col.visible);
  }
  getColumns() {
    return this.columns;
  }
  findColumnIndex(column) {
    return this.columnsByIndex.findIndex((col) => {
      return column === col;
    });
  }
  //return all columns that are not groups
  getRealColumns() {
    return this.columnsByIndex;
  }
  //traverse across columns and call action
  traverse(callback) {
    this.columnsByIndex.forEach((column, i) => {
      callback(column, i);
    });
  }
  //get definitions of actual columns
  getDefinitions(active) {
    var output = [];
    this.columnsByIndex.forEach((column) => {
      if (!active || active && column.visible) {
        output.push(column.getDefinition());
      }
    });
    return output;
  }
  //get full nested definition tree
  getDefinitionTree() {
    var output = [];
    this.columns.forEach((column) => {
      output.push(column.getDefinition(true));
    });
    return output;
  }
  getComponents(structured) {
    var output = [], columns = structured ? this.columns : this.columnsByIndex;
    columns.forEach((column) => {
      output.push(column.getComponent());
    });
    return output;
  }
  getWidth() {
    var width = 0;
    this.columnsByIndex.forEach((column) => {
      if (column.visible) {
        width += column.getWidth();
      }
    });
    return width;
  }
  moveColumn(from3, to, after) {
    to.element.parentNode.insertBefore(from3.element, to.element);
    if (after) {
      to.element.parentNode.insertBefore(to.element, from3.element);
    }
    this.moveColumnActual(from3, to, after);
    this.verticalAlignHeaders();
    this.table.rowManager.reinitialize();
  }
  moveColumnActual(from3, to, after) {
    if (from3.parent.isGroup) {
      this._moveColumnInArray(from3.parent.columns, from3, to, after);
    } else {
      this._moveColumnInArray(this.columns, from3, to, after);
    }
    this._moveColumnInArray(this.columnsByIndex, from3, to, after, true);
    this.rerenderColumns(true);
    this.dispatch("column-moved", from3, to, after);
    if (this.subscribedExternal("columnMoved")) {
      this.dispatchExternal("columnMoved", from3.getComponent(), this.table.columnManager.getComponents());
    }
  }
  _moveColumnInArray(columns, from3, to, after, updateRows) {
    var fromIndex = columns.indexOf(from3), toIndex, rows2 = [];
    if (fromIndex > -1) {
      columns.splice(fromIndex, 1);
      toIndex = columns.indexOf(to);
      if (toIndex > -1) {
        if (after) {
          toIndex = toIndex + 1;
        }
      } else {
        toIndex = fromIndex;
      }
      columns.splice(toIndex, 0, from3);
      if (updateRows) {
        rows2 = this.chain("column-moving-rows", [from3, to, after], null, []) || [];
        rows2 = rows2.concat(this.table.rowManager.rows);
        rows2.forEach(function(row) {
          if (row.cells.length) {
            var cell = row.cells.splice(fromIndex, 1)[0];
            row.cells.splice(toIndex, 0, cell);
          }
        });
      }
    }
  }
  scrollToColumn(column, position, ifVisible) {
    var left = 0, offset = column.getLeftOffset(), adjust = 0, colEl = column.getElement();
    return new Promise((resolve, reject) => {
      if (typeof position === "undefined") {
        position = this.table.options.scrollToColumnPosition;
      }
      if (typeof ifVisible === "undefined") {
        ifVisible = this.table.options.scrollToColumnIfVisible;
      }
      if (column.visible) {
        switch (position) {
          case "middle":
          case "center":
            adjust = -this.element.clientWidth / 2;
            break;
          case "right":
            adjust = colEl.clientWidth - this.headersElement.clientWidth;
            break;
        }
        if (!ifVisible) {
          if (offset > 0 && offset + colEl.offsetWidth < this.element.clientWidth) {
            return false;
          }
        }
        left = offset + adjust;
        left = Math.max(Math.min(left, this.table.rowManager.element.scrollWidth - this.table.rowManager.element.clientWidth), 0);
        this.table.rowManager.scrollHorizontal(left);
        this.scrollHorizontal(left);
        resolve();
      } else {
        console.warn("Scroll Error - Column not visible");
        reject("Scroll Error - Column not visible");
      }
    });
  }
  //////////////// Cell Management /////////////////
  generateCells(row) {
    var cells = [];
    this.columnsByIndex.forEach((column) => {
      cells.push(column.generateCell(row));
    });
    return cells;
  }
  //////////////// Column Management /////////////////
  getFlexBaseWidth() {
    var totalWidth = this.table.element.clientWidth, fixedWidth = 0;
    if (this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight) {
      totalWidth -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth;
    }
    this.columnsByIndex.forEach(function(column) {
      var width, minWidth, colWidth;
      if (column.visible) {
        width = column.definition.width || 0;
        minWidth = parseInt(column.minWidth);
        if (typeof width == "string") {
          if (width.indexOf("%") > -1) {
            colWidth = totalWidth / 100 * parseInt(width);
          } else {
            colWidth = parseInt(width);
          }
        } else {
          colWidth = width;
        }
        fixedWidth += colWidth > minWidth ? colWidth : minWidth;
      }
    });
    return fixedWidth;
  }
  addColumn(definition, before, nextToColumn) {
    return new Promise((resolve, reject) => {
      var column = this._addColumn(definition, before, nextToColumn);
      this._reIndexColumns();
      this.dispatch("column-add", definition, before, nextToColumn);
      if (this.layoutMode() != "fitColumns") {
        column.reinitializeWidth();
      }
      this.redraw(true);
      this.table.rowManager.reinitialize();
      this.rerenderColumns();
      resolve(column);
    });
  }
  //remove column from system
  deregisterColumn(column) {
    var field = column.getField(), index;
    if (field) {
      delete this.columnsByField[field];
    }
    index = this.columnsByIndex.indexOf(column);
    if (index > -1) {
      this.columnsByIndex.splice(index, 1);
    }
    index = this.columns.indexOf(column);
    if (index > -1) {
      this.columns.splice(index, 1);
    }
    this.verticalAlignHeaders();
    this.redraw();
  }
  rerenderColumns(update, silent) {
    if (!this.redrawBlock) {
      this.renderer.rerenderColumns(update, silent);
    } else {
      if (update === false || update === true && this.redrawBlockUpdate === null) {
        this.redrawBlockUpdate = update;
      }
    }
  }
  blockRedraw() {
    this.redrawBlock = true;
    this.redrawBlockUpdate = null;
  }
  restoreRedraw() {
    this.redrawBlock = false;
    this.verticalAlignHeaders();
    this.renderer.rerenderColumns(this.redrawBlockUpdate);
  }
  //redraw columns
  redraw(force) {
    if (Helpers.elVisible(this.element)) {
      this.verticalAlignHeaders();
    }
    if (force) {
      this.table.rowManager.resetScroll();
      this.table.rowManager.reinitialize();
    }
    if (!this.confirm("table-redrawing", force)) {
      this.layoutRefresh(force);
    }
    this.dispatch("table-redraw", force);
    this.table.footerManager.redraw();
  }
};
var BasicVertical = class extends Renderer {
  constructor(table2) {
    super(table2);
    this.verticalFillMode = "fill";
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }
  clearRows() {
    var element = this.tableElement;
    while (element.firstChild) element.removeChild(element.firstChild);
    element.scrollTop = 0;
    element.scrollLeft = 0;
    element.style.minWidth = "";
    element.style.minHeight = "";
    element.style.display = "";
    element.style.visibility = "";
  }
  renderRows() {
    var element = this.tableElement, onlyGroupHeaders = true, tableFrag = document.createDocumentFragment(), rows2 = this.rows();
    rows2.forEach((row, index) => {
      this.styleRow(row, index);
      row.initialize(false, true);
      if (row.type !== "group") {
        onlyGroupHeaders = false;
      }
      tableFrag.appendChild(row.getElement());
    });
    element.appendChild(tableFrag);
    rows2.forEach((row) => {
      row.rendered();
      if (!row.heightInitialized) {
        row.calcHeight(true);
      }
    });
    rows2.forEach((row) => {
      if (!row.heightInitialized) {
        row.setCellHeight();
      }
    });
    if (onlyGroupHeaders) {
      element.style.minWidth = this.table.columnManager.getWidth() + "px";
    } else {
      element.style.minWidth = "";
    }
  }
  rerenderRows(callback) {
    this.clearRows();
    if (callback) {
      callback();
    }
    this.renderRows();
    if (!this.rows().length) {
      this.table.rowManager.tableEmpty();
    }
  }
  scrollToRowNearestTop(row) {
    var rowTop = Helpers.elOffset(row.getElement()).top;
    return !(Math.abs(this.elementVertical.scrollTop - rowTop) > Math.abs(this.elementVertical.scrollTop + this.elementVertical.clientHeight - rowTop));
  }
  scrollToRow(row) {
    var rowEl = row.getElement();
    this.elementVertical.scrollTop = Helpers.elOffset(rowEl).top - Helpers.elOffset(this.elementVertical).top + this.elementVertical.scrollTop;
  }
  visibleRows(includingBuffer) {
    return this.rows();
  }
};
var VirtualDomVertical = class extends Renderer {
  constructor(table2) {
    super(table2);
    this.verticalFillMode = "fill";
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.vDomRowHeight = 20;
    this.vDomTop = 0;
    this.vDomBottom = 0;
    this.vDomScrollPosTop = 0;
    this.vDomScrollPosBottom = 0;
    this.vDomTopPad = 0;
    this.vDomBottomPad = 0;
    this.vDomMaxRenderChain = 90;
    this.vDomWindowBuffer = 0;
    this.vDomWindowMinTotalRows = 20;
    this.vDomWindowMinMarginRows = 5;
    this.vDomTopNewRows = [];
    this.vDomBottomNewRows = [];
  }
  //////////////////////////////////////
  ///////// Public Functions ///////////
  //////////////////////////////////////
  clearRows() {
    var element = this.tableElement;
    while (element.firstChild) element.removeChild(element.firstChild);
    element.style.paddingTop = "";
    element.style.paddingBottom = "";
    element.style.minHeight = "";
    element.style.display = "";
    element.style.visibility = "";
    this.elementVertical.scrollTop = 0;
    this.elementVertical.scrollLeft = 0;
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.vDomTop = 0;
    this.vDomBottom = 0;
    this.vDomTopPad = 0;
    this.vDomBottomPad = 0;
    this.vDomScrollPosTop = 0;
    this.vDomScrollPosBottom = 0;
  }
  renderRows() {
    this._virtualRenderFill();
  }
  rerenderRows(callback) {
    var scrollTop = this.elementVertical.scrollTop;
    var topRow = false;
    var topOffset = false;
    var left = this.table.rowManager.scrollLeft;
    var rows2 = this.rows();
    for (var i = this.vDomTop; i <= this.vDomBottom; i++) {
      if (rows2[i]) {
        var diff = scrollTop - rows2[i].getElement().offsetTop;
        if (topOffset === false || Math.abs(diff) < topOffset) {
          topOffset = diff;
          topRow = i;
        } else {
          break;
        }
      }
    }
    rows2.forEach((row) => {
      row.deinitializeHeight();
    });
    if (callback) {
      callback();
    }
    if (this.rows().length) {
      this._virtualRenderFill(topRow === false ? this.rows.length - 1 : topRow, true, topOffset || 0);
    } else {
      this.clear();
      this.table.rowManager.tableEmpty();
    }
    this.scrollColumns(left);
  }
  scrollColumns(left) {
    this.table.rowManager.scrollHorizontal(left);
  }
  scrollRows(top, dir) {
    var topDiff = top - this.vDomScrollPosTop;
    var bottomDiff = top - this.vDomScrollPosBottom;
    var margin = this.vDomWindowBuffer * 2;
    var rows2 = this.rows();
    this.scrollTop = top;
    if (-topDiff > margin || bottomDiff > margin) {
      var left = this.table.rowManager.scrollLeft;
      this._virtualRenderFill(Math.floor(this.elementVertical.scrollTop / this.elementVertical.scrollHeight * rows2.length));
      this.scrollColumns(left);
    } else {
      if (dir) {
        if (topDiff < 0) {
          this._addTopRow(rows2, -topDiff);
        }
        if (bottomDiff < 0) {
          if (this.vDomScrollHeight - this.scrollTop > this.vDomWindowBuffer) {
            this._removeBottomRow(rows2, -bottomDiff);
          } else {
            this.vDomScrollPosBottom = this.scrollTop;
          }
        }
      } else {
        if (bottomDiff >= 0) {
          this._addBottomRow(rows2, bottomDiff);
        }
        if (topDiff >= 0) {
          if (this.scrollTop > this.vDomWindowBuffer) {
            this._removeTopRow(rows2, topDiff);
          } else {
            this.vDomScrollPosTop = this.scrollTop;
          }
        }
      }
    }
  }
  resize() {
    this.vDomWindowBuffer = this.table.options.renderVerticalBuffer || this.elementVertical.clientHeight;
  }
  scrollToRowNearestTop(row) {
    var rowIndex = this.rows().indexOf(row);
    return !(Math.abs(this.vDomTop - rowIndex) > Math.abs(this.vDomBottom - rowIndex));
  }
  scrollToRow(row) {
    var index = this.rows().indexOf(row);
    if (index > -1) {
      this._virtualRenderFill(index, true);
    }
  }
  visibleRows(includingBuffer) {
    var topEdge = this.elementVertical.scrollTop, bottomEdge = this.elementVertical.clientHeight + topEdge, topFound = false, topRow = 0, bottomRow = 0, rows2 = this.rows();
    if (includingBuffer) {
      topRow = this.vDomTop;
      bottomRow = this.vDomBottom;
    } else {
      for (var i = this.vDomTop; i <= this.vDomBottom; i++) {
        if (rows2[i]) {
          if (!topFound) {
            if (topEdge - rows2[i].getElement().offsetTop >= 0) {
              topRow = i;
            } else {
              topFound = true;
              if (bottomEdge - rows2[i].getElement().offsetTop >= 0) {
                bottomRow = i;
              } else {
                break;
              }
            }
          } else {
            if (bottomEdge - rows2[i].getElement().offsetTop >= 0) {
              bottomRow = i;
            } else {
              break;
            }
          }
        }
      }
    }
    return rows2.slice(topRow, bottomRow + 1);
  }
  //////////////////////////////////////
  //////// Internal Rendering //////////
  //////////////////////////////////////
  //full virtual render
  _virtualRenderFill(position, forceMove, offset) {
    var element = this.tableElement, holder = this.elementVertical, topPad = 0, rowsHeight = 0, rowHeight = 0, heightOccupied = 0, topPadHeight = 0, i = 0, rows2 = this.rows(), rowsCount = rows2.length, index = 0, row, rowFragment, renderedRows = [], totalRowsRendered = 0, rowsToRender = 0, fixedHeight = this.table.rowManager.fixedHeight, containerHeight = this.elementVertical.clientHeight, avgRowHeight = this.table.options.rowHeight, resized = true;
    position = position || 0;
    offset = offset || 0;
    if (!position) {
      this.clear();
    } else {
      while (element.firstChild) element.removeChild(element.firstChild);
      heightOccupied = (rowsCount - position + 1) * this.vDomRowHeight;
      if (heightOccupied < containerHeight) {
        position -= Math.ceil((containerHeight - heightOccupied) / this.vDomRowHeight);
        if (position < 0) {
          position = 0;
        }
      }
      topPad = Math.min(Math.max(Math.floor(this.vDomWindowBuffer / this.vDomRowHeight), this.vDomWindowMinMarginRows), position);
      position -= topPad;
    }
    if (rowsCount && Helpers.elVisible(this.elementVertical)) {
      this.vDomTop = position;
      this.vDomBottom = position - 1;
      if (fixedHeight || this.table.options.maxHeight) {
        if (avgRowHeight) {
          rowsToRender = containerHeight / avgRowHeight + this.vDomWindowBuffer / avgRowHeight;
        }
        rowsToRender = Math.max(this.vDomWindowMinTotalRows, Math.ceil(rowsToRender));
      } else {
        rowsToRender = rowsCount;
      }
      while ((rowsToRender == rowsCount || rowsHeight <= containerHeight + this.vDomWindowBuffer || totalRowsRendered < this.vDomWindowMinTotalRows) && this.vDomBottom < rowsCount - 1) {
        renderedRows = [];
        rowFragment = document.createDocumentFragment();
        i = 0;
        while (i < rowsToRender && this.vDomBottom < rowsCount - 1) {
          index = this.vDomBottom + 1, row = rows2[index];
          this.styleRow(row, index);
          row.initialize(false, true);
          if (!row.heightInitialized && !this.table.options.rowHeight) {
            row.clearCellHeight();
          }
          rowFragment.appendChild(row.getElement());
          renderedRows.push(row);
          this.vDomBottom++;
          i++;
        }
        if (!renderedRows.length) {
          break;
        }
        element.appendChild(rowFragment);
        renderedRows.forEach((row2) => {
          row2.rendered();
          if (!row2.heightInitialized) {
            row2.calcHeight(true);
          }
        });
        renderedRows.forEach((row2) => {
          if (!row2.heightInitialized) {
            row2.setCellHeight();
          }
        });
        renderedRows.forEach((row2) => {
          rowHeight = row2.getHeight();
          if (totalRowsRendered < topPad) {
            topPadHeight += rowHeight;
          } else {
            rowsHeight += rowHeight;
          }
          if (rowHeight > this.vDomWindowBuffer) {
            this.vDomWindowBuffer = rowHeight * 2;
          }
          totalRowsRendered++;
        });
        resized = this.table.rowManager.adjustTableSize();
        containerHeight = this.elementVertical.clientHeight;
        if (resized && (fixedHeight || this.table.options.maxHeight)) {
          avgRowHeight = rowsHeight / totalRowsRendered;
          rowsToRender = Math.max(this.vDomWindowMinTotalRows, Math.ceil(containerHeight / avgRowHeight + this.vDomWindowBuffer / avgRowHeight));
        }
      }
      if (!position) {
        this.vDomTopPad = 0;
        this.vDomRowHeight = Math.floor((rowsHeight + topPadHeight) / totalRowsRendered);
        this.vDomBottomPad = this.vDomRowHeight * (rowsCount - this.vDomBottom - 1);
        this.vDomScrollHeight = topPadHeight + rowsHeight + this.vDomBottomPad - containerHeight;
      } else {
        this.vDomTopPad = !forceMove ? this.scrollTop - topPadHeight : this.vDomRowHeight * this.vDomTop + offset;
        this.vDomBottomPad = this.vDomBottom == rowsCount - 1 ? 0 : Math.max(this.vDomScrollHeight - this.vDomTopPad - rowsHeight - topPadHeight, 0);
      }
      element.style.paddingTop = this.vDomTopPad + "px";
      element.style.paddingBottom = this.vDomBottomPad + "px";
      if (forceMove) {
        this.scrollTop = this.vDomTopPad + topPadHeight + offset - (this.elementVertical.scrollWidth > this.elementVertical.clientWidth ? this.elementVertical.offsetHeight - containerHeight : 0);
      }
      this.scrollTop = Math.min(this.scrollTop, this.elementVertical.scrollHeight - containerHeight);
      if (this.elementVertical.scrollWidth > this.elementVertical.clientWidth && forceMove) {
        this.scrollTop += this.elementVertical.offsetHeight - containerHeight;
      }
      this.vDomScrollPosTop = this.scrollTop;
      this.vDomScrollPosBottom = this.scrollTop;
      holder.scrollTop = this.scrollTop;
      this.dispatch("render-virtual-fill");
    }
  }
  _addTopRow(rows2, fillableSpace) {
    var table2 = this.tableElement, addedRows = [], paddingAdjust = 0, index = this.vDomTop - 1, i = 0, working = true;
    while (working) {
      if (this.vDomTop) {
        let row = rows2[index], rowHeight, initialized;
        if (row && i < this.vDomMaxRenderChain) {
          rowHeight = row.getHeight() || this.vDomRowHeight;
          initialized = row.initialized;
          if (fillableSpace >= rowHeight) {
            this.styleRow(row, index);
            table2.insertBefore(row.getElement(), table2.firstChild);
            if (!row.initialized || !row.heightInitialized) {
              addedRows.push(row);
            }
            row.initialize();
            if (!initialized) {
              rowHeight = row.getElement().offsetHeight;
              if (rowHeight > this.vDomWindowBuffer) {
                this.vDomWindowBuffer = rowHeight * 2;
              }
            }
            fillableSpace -= rowHeight;
            paddingAdjust += rowHeight;
            this.vDomTop--;
            index--;
            i++;
          } else {
            working = false;
          }
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    for (let row of addedRows) {
      row.clearCellHeight();
    }
    this._quickNormalizeRowHeight(addedRows);
    if (paddingAdjust) {
      this.vDomTopPad -= paddingAdjust;
      if (this.vDomTopPad < 0) {
        this.vDomTopPad = index * this.vDomRowHeight;
      }
      if (index < 1) {
        this.vDomTopPad = 0;
      }
      table2.style.paddingTop = this.vDomTopPad + "px";
      this.vDomScrollPosTop -= paddingAdjust;
    }
  }
  _removeTopRow(rows2, fillableSpace) {
    var removableRows = [], paddingAdjust = 0, i = 0, working = true;
    while (working) {
      let row = rows2[this.vDomTop], rowHeight;
      if (row && i < this.vDomMaxRenderChain) {
        rowHeight = row.getHeight() || this.vDomRowHeight;
        if (fillableSpace >= rowHeight) {
          this.vDomTop++;
          fillableSpace -= rowHeight;
          paddingAdjust += rowHeight;
          removableRows.push(row);
          i++;
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    for (let row of removableRows) {
      let rowEl = row.getElement();
      if (rowEl.parentNode) {
        rowEl.parentNode.removeChild(rowEl);
      }
    }
    if (paddingAdjust) {
      this.vDomTopPad += paddingAdjust;
      this.tableElement.style.paddingTop = this.vDomTopPad + "px";
      this.vDomScrollPosTop += this.vDomTop ? paddingAdjust : paddingAdjust + this.vDomWindowBuffer;
    }
  }
  _addBottomRow(rows2, fillableSpace) {
    var table2 = this.tableElement, addedRows = [], paddingAdjust = 0, index = this.vDomBottom + 1, i = 0, working = true;
    while (working) {
      let row = rows2[index], rowHeight, initialized;
      if (row && i < this.vDomMaxRenderChain) {
        rowHeight = row.getHeight() || this.vDomRowHeight;
        initialized = row.initialized;
        if (fillableSpace >= rowHeight) {
          this.styleRow(row, index);
          table2.appendChild(row.getElement());
          if (!row.initialized || !row.heightInitialized) {
            addedRows.push(row);
          }
          row.initialize();
          if (!initialized) {
            rowHeight = row.getElement().offsetHeight;
            if (rowHeight > this.vDomWindowBuffer) {
              this.vDomWindowBuffer = rowHeight * 2;
            }
          }
          fillableSpace -= rowHeight;
          paddingAdjust += rowHeight;
          this.vDomBottom++;
          index++;
          i++;
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    for (let row of addedRows) {
      row.clearCellHeight();
    }
    this._quickNormalizeRowHeight(addedRows);
    if (paddingAdjust) {
      this.vDomBottomPad -= paddingAdjust;
      if (this.vDomBottomPad < 0 || index == rows2.length - 1) {
        this.vDomBottomPad = 0;
      }
      table2.style.paddingBottom = this.vDomBottomPad + "px";
      this.vDomScrollPosBottom += paddingAdjust;
    }
  }
  _removeBottomRow(rows2, fillableSpace) {
    var removableRows = [], paddingAdjust = 0, i = 0, working = true;
    while (working) {
      let row = rows2[this.vDomBottom], rowHeight;
      if (row && i < this.vDomMaxRenderChain) {
        rowHeight = row.getHeight() || this.vDomRowHeight;
        if (fillableSpace >= rowHeight) {
          this.vDomBottom--;
          fillableSpace -= rowHeight;
          paddingAdjust += rowHeight;
          removableRows.push(row);
          i++;
        } else {
          working = false;
        }
      } else {
        working = false;
      }
    }
    for (let row of removableRows) {
      let rowEl = row.getElement();
      if (rowEl.parentNode) {
        rowEl.parentNode.removeChild(rowEl);
      }
    }
    if (paddingAdjust) {
      this.vDomBottomPad += paddingAdjust;
      if (this.vDomBottomPad < 0) {
        this.vDomBottomPad = 0;
      }
      this.tableElement.style.paddingBottom = this.vDomBottomPad + "px";
      this.vDomScrollPosBottom -= paddingAdjust;
    }
  }
  _quickNormalizeRowHeight(rows2) {
    for (let row of rows2) {
      row.calcHeight();
    }
    for (let row of rows2) {
      row.setCellHeight();
    }
  }
};
var RowManager = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.element = this.createHolderElement();
    this.tableElement = this.createTableElement();
    this.heightFixer = this.createTableElement();
    this.placeholder = null;
    this.placeholderContents = null;
    this.firstRender = false;
    this.renderMode = "virtual";
    this.fixedHeight = false;
    this.rows = [];
    this.activeRowsPipeline = [];
    this.activeRows = [];
    this.activeRowsCount = 0;
    this.displayRows = [];
    this.displayRowsCount = 0;
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.redrawBlock = false;
    this.redrawBlockRestoreConfig = false;
    this.redrawBlockRenderInPosition = false;
    this.dataPipeline = [];
    this.displayPipeline = [];
    this.scrollbarWidth = 0;
    this.renderer = null;
  }
  //////////////// Setup Functions /////////////////
  createHolderElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-tableholder");
    el.setAttribute("tabindex", 0);
    return el;
  }
  createTableElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-table");
    el.setAttribute("role", "rowgroup");
    return el;
  }
  initializePlaceholder() {
    var placeholder = this.table.options.placeholder;
    if (typeof placeholder === "function") {
      placeholder = placeholder.call(this.table);
    }
    placeholder = this.chain("placeholder", [placeholder], placeholder, placeholder) || placeholder;
    if (placeholder) {
      let el = document.createElement("div");
      el.classList.add("tabulator-placeholder");
      if (typeof placeholder == "string") {
        let contents = document.createElement("div");
        contents.classList.add("tabulator-placeholder-contents");
        contents.innerHTML = placeholder;
        el.appendChild(contents);
        this.placeholderContents = contents;
      } else if (typeof HTMLElement !== "undefined" && placeholder instanceof HTMLElement) {
        el.appendChild(placeholder);
        this.placeholderContents = placeholder;
      } else {
        console.warn("Invalid placeholder provided, must be string or HTML Element", placeholder);
        this.el = null;
      }
      this.placeholder = el;
    }
  }
  //return containing element
  getElement() {
    return this.element;
  }
  //return table element
  getTableElement() {
    return this.tableElement;
  }
  initialize() {
    this.initializePlaceholder();
    this.initializeRenderer();
    this.element.appendChild(this.tableElement);
    this.firstRender = true;
    this.element.addEventListener("scroll", () => {
      var left = this.element.scrollLeft, leftDir = this.scrollLeft > left, top = this.element.scrollTop, topDir = this.scrollTop > top;
      if (this.scrollLeft != left) {
        this.scrollLeft = left;
        this.dispatch("scroll-horizontal", left, leftDir);
        this.dispatchExternal("scrollHorizontal", left, leftDir);
        this._positionPlaceholder();
      }
      if (this.scrollTop != top) {
        this.scrollTop = top;
        this.renderer.scrollRows(top, topDir);
        this.dispatch("scroll-vertical", top, topDir);
        this.dispatchExternal("scrollVertical", top, topDir);
      }
    });
  }
  ////////////////// Row Manipulation //////////////////
  findRow(subject) {
    if (typeof subject == "object") {
      if (subject instanceof Row) {
        return subject;
      } else if (subject instanceof RowComponent) {
        return subject._getSelf() || false;
      } else if (typeof HTMLElement !== "undefined" && subject instanceof HTMLElement) {
        let match = this.rows.find((row) => {
          return row.getElement() === subject;
        });
        return match || false;
      } else if (subject === null) {
        return false;
      }
    } else if (typeof subject == "undefined") {
      return false;
    } else {
      let match = this.rows.find((row) => {
        return row.data[this.table.options.index] == subject;
      });
      return match || false;
    }
    return false;
  }
  getRowFromDataObject(data) {
    var match = this.rows.find((row) => {
      return row.data === data;
    });
    return match || false;
  }
  getRowFromPosition(position) {
    return this.getDisplayRows().find((row) => {
      return row.type === "row" && row.getPosition() === position && row.isDisplayed();
    });
  }
  scrollToRow(row, position, ifVisible) {
    return this.renderer.scrollToRowPosition(row, position, ifVisible);
  }
  ////////////////// Data Handling //////////////////
  setData(data, renderInPosition, columnsChanged) {
    return new Promise((resolve, reject) => {
      if (renderInPosition && this.getDisplayRows().length) {
        if (this.table.options.pagination) {
          this._setDataActual(data, true);
        } else {
          this.reRenderInPosition(() => {
            this._setDataActual(data);
          });
        }
      } else {
        if (this.table.options.autoColumns && columnsChanged && this.table.initialized) {
          this.table.columnManager.generateColumnsFromRowData(data);
        }
        this.resetScroll();
        this._setDataActual(data);
      }
      resolve();
    });
  }
  _setDataActual(data, renderInPosition) {
    this.dispatchExternal("dataProcessing", data);
    this._wipeElements();
    if (Array.isArray(data)) {
      this.dispatch("data-processing", data);
      data.forEach((def, i) => {
        if (def && typeof def === "object") {
          var row = new Row(def, this);
          this.rows.push(row);
        } else {
          console.warn("Data Loading Warning - Invalid row data detected and ignored, expecting object but received:", def);
        }
      });
      this.refreshActiveData(false, false, renderInPosition);
      this.dispatch("data-processed", data);
      this.dispatchExternal("dataProcessed", data);
    } else {
      console.error("Data Loading Error - Unable to process data due to invalid data type \nExpecting: array \nReceived: ", typeof data, "\nData:     ", data);
    }
  }
  _wipeElements() {
    this.dispatch("rows-wipe");
    this.destroy();
    this.adjustTableSize();
    this.dispatch("rows-wiped");
  }
  destroy() {
    this.rows.forEach((row) => {
      row.wipe();
    });
    this.rows = [];
    this.activeRows = [];
    this.activeRowsPipeline = [];
    this.activeRowsCount = 0;
    this.displayRows = [];
    this.displayRowsCount = 0;
  }
  deleteRow(row, blockRedraw) {
    var allIndex = this.rows.indexOf(row), activeIndex = this.activeRows.indexOf(row);
    if (activeIndex > -1) {
      this.activeRows.splice(activeIndex, 1);
    }
    if (allIndex > -1) {
      this.rows.splice(allIndex, 1);
    }
    this.setActiveRows(this.activeRows);
    this.displayRowIterator((rows2) => {
      var displayIndex = rows2.indexOf(row);
      if (displayIndex > -1) {
        rows2.splice(displayIndex, 1);
      }
    });
    if (!blockRedraw) {
      this.reRenderInPosition();
    }
    this.regenerateRowPositions();
    this.dispatchExternal("rowDeleted", row.getComponent());
    if (!this.displayRowsCount) {
      this.tableEmpty();
    }
    if (this.subscribedExternal("dataChanged")) {
      this.dispatchExternal("dataChanged", this.getData());
    }
  }
  addRow(data, pos, index, blockRedraw) {
    var row = this.addRowActual(data, pos, index, blockRedraw);
    return row;
  }
  //add multiple rows
  addRows(data, pos, index, refreshDisplayOnly) {
    var rows2 = [];
    return new Promise((resolve, reject) => {
      pos = this.findAddRowPos(pos);
      if (!Array.isArray(data)) {
        data = [data];
      }
      if (typeof index == "undefined" && pos || typeof index !== "undefined" && !pos) {
        data.reverse();
      }
      data.forEach((item, i) => {
        var row = this.addRow(item, pos, index, true);
        rows2.push(row);
        this.dispatch("row-added", row, item, pos, index);
      });
      this.refreshActiveData(refreshDisplayOnly ? "displayPipeline" : false, false, true);
      this.regenerateRowPositions();
      if (this.displayRowsCount) {
        this._clearPlaceholder();
      }
      resolve(rows2);
    });
  }
  findAddRowPos(pos) {
    if (typeof pos === "undefined") {
      pos = this.table.options.addRowPos;
    }
    if (pos === "pos") {
      pos = true;
    }
    if (pos === "bottom") {
      pos = false;
    }
    return pos;
  }
  addRowActual(data, pos, index, blockRedraw) {
    var row = data instanceof Row ? data : new Row(data || {}, this), top = this.findAddRowPos(pos), allIndex = -1, activeIndex, chainResult;
    if (!index) {
      chainResult = this.chain("row-adding-position", [row, top], null, { index, top });
      index = chainResult.index;
      top = chainResult.top;
    }
    if (typeof index !== "undefined") {
      index = this.findRow(index);
    }
    index = this.chain("row-adding-index", [row, index, top], null, index);
    if (index) {
      allIndex = this.rows.indexOf(index);
    }
    if (index && allIndex > -1) {
      activeIndex = this.activeRows.indexOf(index);
      this.displayRowIterator(function(rows2) {
        var displayIndex = rows2.indexOf(index);
        if (displayIndex > -1) {
          rows2.splice(top ? displayIndex : displayIndex + 1, 0, row);
        }
      });
      if (activeIndex > -1) {
        this.activeRows.splice(top ? activeIndex : activeIndex + 1, 0, row);
      }
      this.rows.splice(top ? allIndex : allIndex + 1, 0, row);
    } else {
      if (top) {
        this.displayRowIterator(function(rows2) {
          rows2.unshift(row);
        });
        this.activeRows.unshift(row);
        this.rows.unshift(row);
      } else {
        this.displayRowIterator(function(rows2) {
          rows2.push(row);
        });
        this.activeRows.push(row);
        this.rows.push(row);
      }
    }
    this.setActiveRows(this.activeRows);
    this.dispatchExternal("rowAdded", row.getComponent());
    if (this.subscribedExternal("dataChanged")) {
      this.dispatchExternal("dataChanged", this.table.rowManager.getData());
    }
    if (!blockRedraw) {
      this.reRenderInPosition();
    }
    return row;
  }
  moveRow(from3, to, after) {
    this.dispatch("row-move", from3, to, after);
    this.moveRowActual(from3, to, after);
    this.regenerateRowPositions();
    this.dispatch("row-moved", from3, to, after);
    this.dispatchExternal("rowMoved", from3.getComponent());
  }
  moveRowActual(from3, to, after) {
    this.moveRowInArray(this.rows, from3, to, after);
    this.moveRowInArray(this.activeRows, from3, to, after);
    this.displayRowIterator((rows2) => {
      this.moveRowInArray(rows2, from3, to, after);
    });
    this.dispatch("row-moving", from3, to, after);
  }
  moveRowInArray(rows2, from3, to, after) {
    var fromIndex, toIndex, start, end;
    if (from3 !== to) {
      fromIndex = rows2.indexOf(from3);
      if (fromIndex > -1) {
        rows2.splice(fromIndex, 1);
        toIndex = rows2.indexOf(to);
        if (toIndex > -1) {
          if (after) {
            rows2.splice(toIndex + 1, 0, from3);
          } else {
            rows2.splice(toIndex, 0, from3);
          }
        } else {
          rows2.splice(fromIndex, 0, from3);
        }
      }
      if (rows2 === this.getDisplayRows()) {
        start = fromIndex < toIndex ? fromIndex : toIndex;
        end = toIndex > fromIndex ? toIndex : fromIndex + 1;
        for (let i = start; i <= end; i++) {
          if (rows2[i]) {
            this.styleRow(rows2[i], i);
          }
        }
      }
    }
  }
  clearData() {
    this.setData([]);
  }
  getRowIndex(row) {
    return this.findRowIndex(row, this.rows);
  }
  getDisplayRowIndex(row) {
    var index = this.getDisplayRows().indexOf(row);
    return index > -1 ? index : false;
  }
  nextDisplayRow(row, rowOnly) {
    var index = this.getDisplayRowIndex(row), nextRow = false;
    if (index !== false && index < this.displayRowsCount - 1) {
      nextRow = this.getDisplayRows()[index + 1];
    }
    if (nextRow && (!(nextRow instanceof Row) || nextRow.type != "row")) {
      return this.nextDisplayRow(nextRow, rowOnly);
    }
    return nextRow;
  }
  prevDisplayRow(row, rowOnly) {
    var index = this.getDisplayRowIndex(row), prevRow = false;
    if (index) {
      prevRow = this.getDisplayRows()[index - 1];
    }
    if (rowOnly && prevRow && (!(prevRow instanceof Row) || prevRow.type != "row")) {
      return this.prevDisplayRow(prevRow, rowOnly);
    }
    return prevRow;
  }
  findRowIndex(row, list) {
    var rowIndex;
    row = this.findRow(row);
    if (row) {
      rowIndex = list.indexOf(row);
      if (rowIndex > -1) {
        return rowIndex;
      }
    }
    return false;
  }
  getData(active, transform) {
    var output = [], rows2 = this.getRows(active);
    rows2.forEach(function(row) {
      if (row.type == "row") {
        output.push(row.getData(transform || "data"));
      }
    });
    return output;
  }
  getComponents(active) {
    var output = [], rows2 = this.getRows(active);
    rows2.forEach(function(row) {
      output.push(row.getComponent());
    });
    return output;
  }
  getDataCount(active) {
    var rows2 = this.getRows(active);
    return rows2.length;
  }
  scrollHorizontal(left) {
    this.scrollLeft = left;
    this.element.scrollLeft = left;
    this.dispatch("scroll-horizontal", left);
  }
  registerDataPipelineHandler(handler, priority) {
    if (typeof priority !== "undefined") {
      this.dataPipeline.push({ handler, priority });
      this.dataPipeline.sort((a, b) => {
        return a.priority - b.priority;
      });
    } else {
      console.error("Data pipeline handlers must have a priority in order to be registered");
    }
  }
  registerDisplayPipelineHandler(handler, priority) {
    if (typeof priority !== "undefined") {
      this.displayPipeline.push({ handler, priority });
      this.displayPipeline.sort((a, b) => {
        return a.priority - b.priority;
      });
    } else {
      console.error("Display pipeline handlers must have a priority in order to be registered");
    }
  }
  //set active data set
  refreshActiveData(handler, skipStage, renderInPosition) {
    var table2 = this.table, stage = "", index = 0, cascadeOrder = ["all", "dataPipeline", "display", "displayPipeline", "end"];
    if (!this.table.destroyed) {
      if (typeof handler === "function") {
        index = this.dataPipeline.findIndex((item) => {
          return item.handler === handler;
        });
        if (index > -1) {
          stage = "dataPipeline";
          if (skipStage) {
            if (index == this.dataPipeline.length - 1) {
              stage = "display";
            } else {
              index++;
            }
          }
        } else {
          index = this.displayPipeline.findIndex((item) => {
            return item.handler === handler;
          });
          if (index > -1) {
            stage = "displayPipeline";
            if (skipStage) {
              if (index == this.displayPipeline.length - 1) {
                stage = "end";
              } else {
                index++;
              }
            }
          } else {
            console.error("Unable to refresh data, invalid handler provided", handler);
            return;
          }
        }
      } else {
        stage = handler || "all";
        index = 0;
      }
      if (this.redrawBlock) {
        if (!this.redrawBlockRestoreConfig || this.redrawBlockRestoreConfig && (this.redrawBlockRestoreConfig.stage === stage && index < this.redrawBlockRestoreConfig.index || cascadeOrder.indexOf(stage) < cascadeOrder.indexOf(this.redrawBlockRestoreConfig.stage))) {
          this.redrawBlockRestoreConfig = {
            handler,
            skipStage,
            renderInPosition,
            stage,
            index
          };
        }
        return;
      } else {
        if (Helpers.elVisible(this.element)) {
          if (renderInPosition) {
            this.reRenderInPosition(this.refreshPipelines.bind(this, handler, stage, index, renderInPosition));
          } else {
            this.refreshPipelines(handler, stage, index, renderInPosition);
            if (!handler) {
              this.table.columnManager.renderer.renderColumns();
            }
            this.renderTable();
            if (table2.options.layoutColumnsOnNewData) {
              this.table.columnManager.redraw(true);
            }
          }
        } else {
          this.refreshPipelines(handler, stage, index, renderInPosition);
        }
        this.dispatch("data-refreshed");
      }
    }
  }
  refreshPipelines(handler, stage, index, renderInPosition) {
    this.dispatch("data-refreshing");
    if (!handler || !this.activeRowsPipeline[0]) {
      this.activeRowsPipeline[0] = this.rows.slice(0);
    }
    switch (stage) {
      case "all":
      //handle case where all data needs refreshing
      case "dataPipeline":
        for (let i = index; i < this.dataPipeline.length; i++) {
          let result = this.dataPipeline[i].handler(this.activeRowsPipeline[i].slice(0));
          this.activeRowsPipeline[i + 1] = result || this.activeRowsPipeline[i].slice(0);
        }
        this.setActiveRows(this.activeRowsPipeline[this.dataPipeline.length]);
      case "display":
        index = 0;
        this.resetDisplayRows();
      case "displayPipeline":
        for (let i = index; i < this.displayPipeline.length; i++) {
          let result = this.displayPipeline[i].handler((i ? this.getDisplayRows(i - 1) : this.activeRows).slice(0), renderInPosition);
          this.setDisplayRows(result || this.getDisplayRows(i - 1).slice(0), i);
        }
      case "end":
        this.regenerateRowPositions();
    }
    if (this.getDisplayRows().length) {
      this._clearPlaceholder();
    }
  }
  //regenerate row positions
  regenerateRowPositions() {
    var rows2 = this.getDisplayRows();
    var index = 1;
    rows2.forEach((row) => {
      if (row.type === "row") {
        row.setPosition(index);
        index++;
      }
    });
  }
  setActiveRows(activeRows) {
    this.activeRows = this.activeRows = Object.assign([], activeRows);
    this.activeRowsCount = this.activeRows.length;
  }
  //reset display rows array
  resetDisplayRows() {
    this.displayRows = [];
    this.displayRows.push(this.activeRows.slice(0));
    this.displayRowsCount = this.displayRows[0].length;
  }
  //set display row pipeline data
  setDisplayRows(displayRows, index) {
    this.displayRows[index] = displayRows;
    if (index == this.displayRows.length - 1) {
      this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
    }
  }
  getDisplayRows(index) {
    if (typeof index == "undefined") {
      return this.displayRows.length ? this.displayRows[this.displayRows.length - 1] : [];
    } else {
      return this.displayRows[index] || [];
    }
  }
  getVisibleRows(chain, viewable) {
    var rows2 = Object.assign([], this.renderer.visibleRows(!viewable));
    if (chain) {
      rows2 = this.chain("rows-visible", [viewable], rows2, rows2);
    }
    return rows2;
  }
  //repeat action across display rows
  displayRowIterator(callback) {
    this.activeRowsPipeline.forEach(callback);
    this.displayRows.forEach(callback);
    this.displayRowsCount = this.displayRows[this.displayRows.length - 1].length;
  }
  //return only actual rows (not group headers etc)
  getRows(type) {
    var rows2 = [];
    switch (type) {
      case "active":
        rows2 = this.activeRows;
        break;
      case "display":
        rows2 = this.table.rowManager.getDisplayRows();
        break;
      case "visible":
        rows2 = this.getVisibleRows(false, true);
        break;
      default:
        rows2 = this.chain("rows-retrieve", type, null, this.rows) || this.rows;
    }
    return rows2;
  }
  ///////////////// Table Rendering /////////////////
  //trigger rerender of table in current position
  reRenderInPosition(callback) {
    if (this.redrawBlock) {
      if (callback) {
        callback();
      } else {
        this.redrawBlockRenderInPosition = true;
      }
    } else {
      this.dispatchExternal("renderStarted");
      this.renderer.rerenderRows(callback);
      if (!this.fixedHeight) {
        this.adjustTableSize();
      }
      this.scrollBarCheck();
      this.dispatchExternal("renderComplete");
    }
  }
  scrollBarCheck() {
    var scrollbarWidth = 0;
    if (this.element.scrollHeight > this.element.clientHeight) {
      scrollbarWidth = this.element.offsetWidth - this.element.clientWidth;
    }
    if (scrollbarWidth !== this.scrollbarWidth) {
      this.scrollbarWidth = scrollbarWidth;
      this.dispatch("scrollbar-vertical", scrollbarWidth);
    }
  }
  initializeRenderer() {
    var renderClass;
    var renderers = {
      "virtual": VirtualDomVertical,
      "basic": BasicVertical
    };
    if (typeof this.table.options.renderVertical === "string") {
      renderClass = renderers[this.table.options.renderVertical];
    } else {
      renderClass = this.table.options.renderVertical;
    }
    if (renderClass) {
      this.renderMode = this.table.options.renderVertical;
      this.renderer = new renderClass(this.table, this.element, this.tableElement);
      this.renderer.initialize();
      if ((this.table.element.clientHeight || this.table.options.height) && !(this.table.options.minHeight && this.table.options.maxHeight)) {
        this.fixedHeight = true;
      } else {
        this.fixedHeight = false;
      }
    } else {
      console.error("Unable to find matching renderer:", this.table.options.renderVertical);
    }
  }
  getRenderMode() {
    return this.renderMode;
  }
  renderTable() {
    this.dispatchExternal("renderStarted");
    this.element.scrollTop = 0;
    this._clearTable();
    if (this.displayRowsCount) {
      this.renderer.renderRows();
      if (this.firstRender) {
        this.firstRender = false;
        if (!this.fixedHeight) {
          this.adjustTableSize();
        }
        this.layoutRefresh(true);
      }
    } else {
      this.renderEmptyScroll();
    }
    if (!this.fixedHeight) {
      this.adjustTableSize();
    }
    this.dispatch("table-layout");
    if (!this.displayRowsCount) {
      this._showPlaceholder();
    }
    this.scrollBarCheck();
    this.dispatchExternal("renderComplete");
  }
  //show scrollbars on empty table div
  renderEmptyScroll() {
    if (this.placeholder) {
      this.tableElement.style.display = "none";
    } else {
      this.tableElement.style.minWidth = this.table.columnManager.getWidth() + "px";
    }
  }
  _clearTable() {
    this._clearPlaceholder();
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.renderer.clearRows();
  }
  tableEmpty() {
    this.renderEmptyScroll();
    this._showPlaceholder();
  }
  checkPlaceholder() {
    if (this.displayRowsCount) {
      this._clearPlaceholder();
    } else {
      this.tableEmpty();
    }
  }
  _showPlaceholder() {
    if (this.placeholder) {
      if (this.placeholder && this.placeholder.parentNode) {
        this.placeholder.parentNode.removeChild(this.placeholder);
      }
      this.initializePlaceholder();
      this.placeholder.setAttribute("tabulator-render-mode", this.renderMode);
      this.getElement().appendChild(this.placeholder);
      this._positionPlaceholder();
      this.adjustTableSize();
    }
  }
  _clearPlaceholder() {
    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.removeChild(this.placeholder);
    }
    this.tableElement.style.minWidth = "";
    this.tableElement.style.display = "";
  }
  _positionPlaceholder() {
    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.style.width = this.table.columnManager.getWidth() + "px";
      this.placeholderContents.style.width = this.table.rowManager.element.clientWidth + "px";
      this.placeholderContents.style.marginLeft = this.scrollLeft + "px";
    }
  }
  styleRow(row, index) {
    var rowEl = row.getElement();
    if (index % 2) {
      rowEl.classList.add("tabulator-row-even");
      rowEl.classList.remove("tabulator-row-odd");
    } else {
      rowEl.classList.add("tabulator-row-odd");
      rowEl.classList.remove("tabulator-row-even");
    }
  }
  //normalize height of active rows
  normalizeHeight(force) {
    this.activeRows.forEach(function(row) {
      row.normalizeHeight(force);
    });
  }
  //adjust the height of the table holder to fit in the Tabulator element
  adjustTableSize() {
    let initialHeight = this.element.clientHeight, minHeight;
    let resized = false;
    if (this.renderer.verticalFillMode === "fill") {
      let otherHeight = Math.floor(this.table.columnManager.getElement().getBoundingClientRect().height + (this.table.footerManager && this.table.footerManager.active && !this.table.footerManager.external ? this.table.footerManager.getElement().getBoundingClientRect().height : 0));
      if (this.fixedHeight) {
        minHeight = isNaN(this.table.options.minHeight) ? this.table.options.minHeight : this.table.options.minHeight + "px";
        const height = "calc(100% - " + otherHeight + "px)";
        this.element.style.minHeight = minHeight || "calc(100% - " + otherHeight + "px)";
        this.element.style.height = height;
        this.element.style.maxHeight = height;
      } else {
        this.element.style.height = "";
        this.element.style.height = this.table.element.clientHeight - otherHeight + "px";
        this.element.scrollTop = this.scrollTop;
      }
      this.renderer.resize();
      if (!this.fixedHeight && initialHeight != this.element.clientHeight) {
        resized = true;
        if (this.subscribed("table-resize")) {
          this.dispatch("table-resize");
        } else {
          this.redraw();
        }
      }
      this.scrollBarCheck();
    }
    this._positionPlaceholder();
    return resized;
  }
  //reinitialize all rows
  reinitialize() {
    this.rows.forEach(function(row) {
      row.reinitialize(true);
    });
  }
  //prevent table from being redrawn
  blockRedraw() {
    this.redrawBlock = true;
    this.redrawBlockRestoreConfig = false;
  }
  //restore table redrawing
  restoreRedraw() {
    this.redrawBlock = false;
    if (this.redrawBlockRestoreConfig) {
      this.refreshActiveData(this.redrawBlockRestoreConfig.handler, this.redrawBlockRestoreConfig.skipStage, this.redrawBlockRestoreConfig.renderInPosition);
      this.redrawBlockRestoreConfig = false;
    } else {
      if (this.redrawBlockRenderInPosition) {
        this.reRenderInPosition();
      }
    }
    this.redrawBlockRenderInPosition = false;
  }
  //redraw table
  redraw(force) {
    this.adjustTableSize();
    this.table.tableWidth = this.table.element.clientWidth;
    if (!force) {
      this.reRenderInPosition();
      this.scrollHorizontal(this.scrollLeft);
    } else {
      this.renderTable();
    }
  }
  resetScroll() {
    this.element.scrollLeft = 0;
    this.element.scrollTop = 0;
    if (this.table.browser === "ie") {
      var event = document.createEvent("Event");
      event.initEvent("scroll", false, true);
      this.element.dispatchEvent(event);
    } else {
      this.element.dispatchEvent(new Event("scroll"));
    }
  }
};
var FooterManager = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.active = false;
    this.element = this.createElement();
    this.containerElement = this.createContainerElement();
    this.external = false;
  }
  initialize() {
    this.initializeElement();
  }
  createElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-footer");
    return el;
  }
  createContainerElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-footer-contents");
    this.element.appendChild(el);
    return el;
  }
  initializeElement() {
    if (this.table.options.footerElement) {
      switch (typeof this.table.options.footerElement) {
        case "string":
          if (this.table.options.footerElement[0] === "<") {
            this.containerElement.innerHTML = this.table.options.footerElement;
          } else {
            this.external = true;
            this.containerElement = document.querySelector(this.table.options.footerElement);
          }
          break;
        default:
          this.element = this.table.options.footerElement;
          break;
      }
    }
  }
  getElement() {
    return this.element;
  }
  append(element) {
    this.activate();
    this.containerElement.appendChild(element);
    this.table.rowManager.adjustTableSize();
  }
  prepend(element) {
    this.activate();
    this.element.insertBefore(element, this.element.firstChild);
    this.table.rowManager.adjustTableSize();
  }
  remove(element) {
    element.parentNode.removeChild(element);
    this.deactivate();
  }
  deactivate(force) {
    if (!this.element.firstChild || force) {
      if (!this.external) {
        this.element.parentNode.removeChild(this.element);
      }
      this.active = false;
    }
  }
  activate() {
    if (!this.active) {
      this.active = true;
      if (!this.external) {
        this.table.element.appendChild(this.getElement());
        this.table.element.style.display = "";
      }
    }
  }
  redraw() {
    this.dispatch("footer-redraw");
  }
};
var InteractionManager = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.el = null;
    this.abortClasses = ["tabulator-headers", "tabulator-table"];
    this.previousTargets = {};
    this.listeners = [
      "click",
      "dblclick",
      "contextmenu",
      "mouseenter",
      "mouseleave",
      "mouseover",
      "mouseout",
      "mousemove",
      "mouseup",
      "mousedown",
      "touchstart",
      "touchend"
    ];
    this.componentMap = {
      "tabulator-cell": "cell",
      "tabulator-row": "row",
      "tabulator-group": "group",
      "tabulator-col": "column"
    };
    this.pseudoTrackers = {
      "row": {
        subscriber: null,
        target: null
      },
      "cell": {
        subscriber: null,
        target: null
      },
      "group": {
        subscriber: null,
        target: null
      },
      "column": {
        subscriber: null,
        target: null
      }
    };
    this.pseudoTracking = false;
  }
  initialize() {
    this.el = this.table.element;
    this.buildListenerMap();
    this.bindSubscriptionWatchers();
  }
  buildListenerMap() {
    var listenerMap = {};
    this.listeners.forEach((listener) => {
      listenerMap[listener] = {
        handler: null,
        components: []
      };
    });
    this.listeners = listenerMap;
  }
  bindPseudoEvents() {
    Object.keys(this.pseudoTrackers).forEach((key) => {
      this.pseudoTrackers[key].subscriber = this.pseudoMouseEnter.bind(this, key);
      this.subscribe(key + "-mouseover", this.pseudoTrackers[key].subscriber);
    });
    this.pseudoTracking = true;
  }
  pseudoMouseEnter(key, e, target) {
    if (this.pseudoTrackers[key].target !== target) {
      if (this.pseudoTrackers[key].target) {
        this.dispatch(key + "-mouseleave", e, this.pseudoTrackers[key].target);
      }
      this.pseudoMouseLeave(key, e);
      this.pseudoTrackers[key].target = target;
      this.dispatch(key + "-mouseenter", e, target);
    }
  }
  pseudoMouseLeave(key, e) {
    var leaveList = Object.keys(this.pseudoTrackers), linkedKeys = {
      "row": ["cell"],
      "cell": ["row"]
    };
    leaveList = leaveList.filter((item) => {
      var links = linkedKeys[key];
      return item !== key && (!links || links && !links.includes(item));
    });
    leaveList.forEach((key2) => {
      var target = this.pseudoTrackers[key2].target;
      if (this.pseudoTrackers[key2].target) {
        this.dispatch(key2 + "-mouseleave", e, target);
        this.pseudoTrackers[key2].target = null;
      }
    });
  }
  bindSubscriptionWatchers() {
    var listeners = Object.keys(this.listeners), components = Object.values(this.componentMap);
    for (let comp of components) {
      for (let listener of listeners) {
        let key = comp + "-" + listener;
        this.subscriptionChange(key, this.subscriptionChanged.bind(this, comp, listener));
      }
    }
    this.subscribe("table-destroy", this.clearWatchers.bind(this));
  }
  subscriptionChanged(component, key, added) {
    var listener = this.listeners[key].components, index = listener.indexOf(component), changed = false;
    if (added) {
      if (index === -1) {
        listener.push(component);
        changed = true;
      }
    } else {
      if (!this.subscribed(component + "-" + key)) {
        if (index > -1) {
          listener.splice(index, 1);
          changed = true;
        }
      }
    }
    if ((key === "mouseenter" || key === "mouseleave") && !this.pseudoTracking) {
      this.bindPseudoEvents();
    }
    if (changed) {
      this.updateEventListeners();
    }
  }
  updateEventListeners() {
    for (let key in this.listeners) {
      let listener = this.listeners[key];
      if (listener.components.length) {
        if (!listener.handler) {
          listener.handler = this.track.bind(this, key);
          this.el.addEventListener(key, listener.handler);
        }
      } else {
        if (listener.handler) {
          this.el.removeEventListener(key, listener.handler);
          listener.handler = null;
        }
      }
    }
  }
  track(type, e) {
    var path = e.composedPath && e.composedPath() || e.path;
    var targets = this.findTargets(path);
    targets = this.bindComponents(type, targets);
    this.triggerEvents(type, e, targets);
    if (this.pseudoTracking && (type == "mouseover" || type == "mouseleave") && !Object.keys(targets).length) {
      this.pseudoMouseLeave("none", e);
    }
  }
  findTargets(path) {
    var targets = {};
    let componentMap = Object.keys(this.componentMap);
    for (let el of path) {
      let classList = el.classList ? [...el.classList] : [];
      let abort = classList.filter((item) => {
        return this.abortClasses.includes(item);
      });
      if (abort.length) {
        break;
      }
      let elTargets = classList.filter((item) => {
        return componentMap.includes(item);
      });
      for (let target of elTargets) {
        if (!targets[this.componentMap[target]]) {
          targets[this.componentMap[target]] = el;
        }
      }
    }
    if (targets.group && targets.group === targets.row) {
      delete targets.row;
    }
    return targets;
  }
  bindComponents(type, targets) {
    var keys = Object.keys(targets).reverse(), listener = this.listeners[type], matches = {}, output = {}, targetMatches = {};
    for (let key of keys) {
      let component, target = targets[key], previousTarget = this.previousTargets[key];
      if (previousTarget && previousTarget.target === target) {
        component = previousTarget.component;
      } else {
        switch (key) {
          case "row":
          case "group":
            if (listener.components.includes("row") || listener.components.includes("cell") || listener.components.includes("group")) {
              let rows2 = this.table.rowManager.getVisibleRows(true);
              component = rows2.find((row) => {
                return row.getElement() === target;
              });
              if (targets["row"] && targets["row"].parentNode && targets["row"].parentNode.closest(".tabulator-row")) {
                targets[key] = false;
              }
            }
            break;
          case "column":
            if (listener.components.includes("column")) {
              component = this.table.columnManager.findColumn(target);
            }
            break;
          case "cell":
            if (listener.components.includes("cell")) {
              if (matches["row"] instanceof Row) {
                component = matches["row"].findCell(target);
              } else {
                if (targets["row"]) {
                  console.warn("Event Target Lookup Error - The row this cell is attached to cannot be found, has the table been reinitialized without being destroyed first?");
                }
              }
            }
            break;
        }
      }
      if (component) {
        matches[key] = component;
        targetMatches[key] = {
          target,
          component
        };
      }
    }
    this.previousTargets = targetMatches;
    Object.keys(targets).forEach((key) => {
      let value = matches[key];
      output[key] = value;
    });
    return output;
  }
  triggerEvents(type, e, targets) {
    var listener = this.listeners[type];
    for (let key in targets) {
      if (targets[key] && listener.components.includes(key)) {
        this.dispatch(key + "-" + type, e, targets[key]);
      }
    }
  }
  clearWatchers() {
    for (let key in this.listeners) {
      let listener = this.listeners[key];
      if (listener.handler) {
        this.el.removeEventListener(key, listener.handler);
        listener.handler = null;
      }
    }
  }
};
var ComponentFunctionBinder = class {
  constructor(table2) {
    this.table = table2;
    this.bindings = {};
  }
  bind(type, funcName, handler) {
    if (!this.bindings[type]) {
      this.bindings[type] = {};
    }
    if (this.bindings[type][funcName]) {
      console.warn("Unable to bind component handler, a matching function name is already bound", type, funcName, handler);
    } else {
      this.bindings[type][funcName] = handler;
    }
  }
  handle(type, component, name) {
    if (this.bindings[type] && this.bindings[type][name] && typeof this.bindings[type][name].bind === "function") {
      return this.bindings[type][name].bind(null, component);
    } else {
      if (name !== "then" && typeof name === "string" && !name.startsWith("_")) {
        if (this.table.options.debugInvalidComponentFuncs) {
          console.error("The " + type + " component does not have a " + name + " function, have you checked that you have the correct Tabulator module installed?");
        }
      }
    }
  }
};
var DataLoader = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.requestOrder = 0;
    this.loading = false;
  }
  initialize() {
  }
  load(data, params, config, replace, silent, columnsChanged) {
    var requestNo = ++this.requestOrder;
    if (this.table.destroyed) {
      return Promise.resolve();
    }
    this.dispatchExternal("dataLoading", data);
    if (data && (data.indexOf("{") == 0 || data.indexOf("[") == 0)) {
      data = JSON.parse(data);
    }
    if (this.confirm("data-loading", [data, params, config, silent])) {
      this.loading = true;
      if (!silent) {
        this.alertLoader();
      }
      params = this.chain("data-params", [data, config, silent], params || {}, params || {});
      params = this.mapParams(params, this.table.options.dataSendParams);
      var result = this.chain("data-load", [data, params, config, silent], false, Promise.resolve([]));
      return result.then((response) => {
        if (!this.table.destroyed) {
          if (!Array.isArray(response) && typeof response == "object") {
            response = this.mapParams(response, this.objectInvert(this.table.options.dataReceiveParams));
          }
          var rowData = this.chain("data-loaded", [response], null, response);
          if (requestNo == this.requestOrder) {
            this.clearAlert();
            if (rowData !== false) {
              this.dispatchExternal("dataLoaded", rowData);
              this.table.rowManager.setData(rowData, replace, typeof columnsChanged === "undefined" ? !replace : columnsChanged);
            }
          } else {
            console.warn("Data Load Response Blocked - An active data load request was blocked by an attempt to change table data while the request was being made");
          }
        } else {
          console.warn("Data Load Response Blocked - Table has been destroyed");
        }
      }).catch((error) => {
        console.error("Data Load Error: ", error);
        this.dispatchExternal("dataLoadError", error);
        if (!silent) {
          this.alertError();
        }
        setTimeout(() => {
          this.clearAlert();
        }, this.table.options.dataLoaderErrorTimeout);
      }).finally(() => {
        this.loading = false;
      });
    } else {
      this.dispatchExternal("dataLoaded", data);
      if (!data) {
        data = [];
      }
      this.table.rowManager.setData(data, replace, typeof columnsChanged === "undefined" ? !replace : columnsChanged);
      return Promise.resolve();
    }
  }
  mapParams(params, map) {
    var output = {};
    for (let key in params) {
      output[map.hasOwnProperty(key) ? map[key] : key] = params[key];
    }
    return output;
  }
  objectInvert(obj) {
    var output = {};
    for (let key in obj) {
      output[obj[key]] = key;
    }
    return output;
  }
  blockActiveLoad() {
    this.requestOrder++;
  }
  alertLoader() {
    var shouldLoad = typeof this.table.options.dataLoader === "function" ? this.table.options.dataLoader() : this.table.options.dataLoader;
    if (shouldLoad) {
      this.table.alertManager.alert(this.table.options.dataLoaderLoading || this.langText("data|loading"));
    }
  }
  alertError() {
    this.table.alertManager.alert(this.table.options.dataLoaderError || this.langText("data|error"), "error");
  }
  clearAlert() {
    this.table.alertManager.clear();
  }
};
var ExternalEventBus = class {
  constructor(table2, optionsList, debug) {
    this.table = table2;
    this.events = {};
    this.optionsList = optionsList || {};
    this.subscriptionNotifiers = {};
    this.dispatch = debug ? this._debugDispatch.bind(this) : this._dispatch.bind(this);
    this.debug = debug;
  }
  subscriptionChange(key, callback) {
    if (!this.subscriptionNotifiers[key]) {
      this.subscriptionNotifiers[key] = [];
    }
    this.subscriptionNotifiers[key].push(callback);
    if (this.subscribed(key)) {
      this._notifySubscriptionChange(key, true);
    }
  }
  subscribe(key, callback) {
    if (!this.events[key]) {
      this.events[key] = [];
    }
    this.events[key].push(callback);
    this._notifySubscriptionChange(key, true);
  }
  unsubscribe(key, callback) {
    var index;
    if (this.events[key]) {
      if (callback) {
        index = this.events[key].findIndex((item) => {
          return item === callback;
        });
        if (index > -1) {
          this.events[key].splice(index, 1);
        } else {
          console.warn("Cannot remove event, no matching event found:", key, callback);
          return;
        }
      } else {
        delete this.events[key];
      }
    } else {
      console.warn("Cannot remove event, no events set on:", key);
      return;
    }
    this._notifySubscriptionChange(key, false);
  }
  subscribed(key) {
    return this.events[key] && this.events[key].length;
  }
  _notifySubscriptionChange(key, subscribed) {
    var notifiers = this.subscriptionNotifiers[key];
    if (notifiers) {
      notifiers.forEach((callback) => {
        callback(subscribed);
      });
    }
  }
  _dispatch() {
    var args = Array.from(arguments), key = args.shift(), result;
    if (this.events[key]) {
      this.events[key].forEach((callback, i) => {
        let callResult = callback.apply(this.table, args);
        if (!i) {
          result = callResult;
        }
      });
    }
    return result;
  }
  _debugDispatch() {
    var args = Array.from(arguments), key = args[0];
    args[0] = "ExternalEvent:" + args[0];
    if (this.debug === true || this.debug.includes(key)) {
      console.log(...args);
    }
    return this._dispatch(...arguments);
  }
};
var InternalEventBus = class {
  constructor(debug) {
    this.events = {};
    this.subscriptionNotifiers = {};
    this.dispatch = debug ? this._debugDispatch.bind(this) : this._dispatch.bind(this);
    this.chain = debug ? this._debugChain.bind(this) : this._chain.bind(this);
    this.confirm = debug ? this._debugConfirm.bind(this) : this._confirm.bind(this);
    this.debug = debug;
  }
  subscriptionChange(key, callback) {
    if (!this.subscriptionNotifiers[key]) {
      this.subscriptionNotifiers[key] = [];
    }
    this.subscriptionNotifiers[key].push(callback);
    if (this.subscribed(key)) {
      this._notifySubscriptionChange(key, true);
    }
  }
  subscribe(key, callback, priority = 1e4) {
    if (!this.events[key]) {
      this.events[key] = [];
    }
    this.events[key].push({ callback, priority });
    this.events[key].sort((a, b) => {
      return a.priority - b.priority;
    });
    this._notifySubscriptionChange(key, true);
  }
  unsubscribe(key, callback) {
    var index;
    if (this.events[key]) {
      if (callback) {
        index = this.events[key].findIndex((item) => {
          return item.callback === callback;
        });
        if (index > -1) {
          this.events[key].splice(index, 1);
        } else {
          console.warn("Cannot remove event, no matching event found:", key, callback);
          return;
        }
      }
    } else {
      console.warn("Cannot remove event, no events set on:", key);
      return;
    }
    this._notifySubscriptionChange(key, false);
  }
  subscribed(key) {
    return this.events[key] && this.events[key].length;
  }
  _chain(key, args, initialValue, fallback) {
    var value = initialValue;
    if (!Array.isArray(args)) {
      args = [args];
    }
    if (this.subscribed(key)) {
      this.events[key].forEach((subscriber, i) => {
        value = subscriber.callback.apply(this, args.concat([value]));
      });
      return value;
    } else {
      return typeof fallback === "function" ? fallback() : fallback;
    }
  }
  _confirm(key, args) {
    var confirmed = false;
    if (!Array.isArray(args)) {
      args = [args];
    }
    if (this.subscribed(key)) {
      this.events[key].forEach((subscriber, i) => {
        if (subscriber.callback.apply(this, args)) {
          confirmed = true;
        }
      });
    }
    return confirmed;
  }
  _notifySubscriptionChange(key, subscribed) {
    var notifiers = this.subscriptionNotifiers[key];
    if (notifiers) {
      notifiers.forEach((callback) => {
        callback(subscribed);
      });
    }
  }
  _dispatch() {
    var args = Array.from(arguments), key = args.shift();
    if (this.events[key]) {
      this.events[key].forEach((subscriber) => {
        subscriber.callback.apply(this, args);
      });
    }
  }
  _debugDispatch() {
    var args = Array.from(arguments), key = args[0];
    args[0] = "InternalEvent:" + key;
    if (this.debug === true || this.debug.includes(key)) {
      console.log(...args);
    }
    return this._dispatch(...arguments);
  }
  _debugChain() {
    var args = Array.from(arguments), key = args[0];
    args[0] = "InternalEvent:" + key;
    if (this.debug === true || this.debug.includes(key)) {
      console.log(...args);
    }
    return this._chain(...arguments);
  }
  _debugConfirm() {
    var args = Array.from(arguments), key = args[0];
    args[0] = "InternalEvent:" + key;
    if (this.debug === true || this.debug.includes(key)) {
      console.log(...args);
    }
    return this._confirm(...arguments);
  }
};
var DeprecationAdvisor = class extends CoreFeature {
  constructor(table2) {
    super(table2);
  }
  _warnUser() {
    if (this.options("debugDeprecation")) {
      console.warn(...arguments);
    }
  }
  check(oldOption, newOption, convert) {
    var msg = "";
    if (typeof this.options(oldOption) !== "undefined") {
      msg = "Deprecated Setup Option - Use of the %c" + oldOption + "%c option is now deprecated";
      if (newOption) {
        msg = msg + ", Please use the %c" + newOption + "%c option instead";
        this._warnUser(msg, "font-weight: bold;", "font-weight: normal;", "font-weight: bold;", "font-weight: normal;");
        if (convert) {
          this.table.options[newOption] = this.table.options[oldOption];
        }
      } else {
        this._warnUser(msg, "font-weight: bold;", "font-weight: normal;");
      }
      return false;
    } else {
      return true;
    }
  }
  checkMsg(oldOption, msg) {
    if (typeof this.options(oldOption) !== "undefined") {
      this._warnUser("%cDeprecated Setup Option - Use of the %c" + oldOption + " %c option is now deprecated, " + msg, "font-weight: normal;", "font-weight: bold;", "font-weight: normal;");
      return false;
    } else {
      return true;
    }
  }
  msg(msg) {
    this._warnUser(msg);
  }
};
var DependencyRegistry = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.deps = {};
    this.props = {};
  }
  initialize() {
    this.deps = Object.assign({}, this.options("dependencies"));
  }
  lookup(key, prop, silent) {
    if (Array.isArray(key)) {
      for (const item of key) {
        var match = this.lookup(item, prop, true);
        if (match) {
          break;
        }
      }
      if (match) {
        return match;
      } else {
        this.error(key);
      }
    } else {
      if (prop) {
        return this.lookupProp(key, prop, silent);
      } else {
        return this.lookupKey(key, silent);
      }
    }
  }
  lookupProp(key, prop, silent) {
    var dependency;
    if (this.props[key] && this.props[key][prop]) {
      return this.props[key][prop];
    } else {
      dependency = this.lookupKey(key, silent);
      if (dependency) {
        if (!this.props[key]) {
          this.props[key] = {};
        }
        this.props[key][prop] = dependency[prop] || dependency;
        return this.props[key][prop];
      }
    }
  }
  lookupKey(key, silent) {
    var dependency;
    if (this.deps[key]) {
      dependency = this.deps[key];
    } else if (window[key]) {
      this.deps[key] = window[key];
      dependency = this.deps[key];
    } else {
      if (!silent) {
        this.error(key);
      }
    }
    return dependency;
  }
  error(key) {
    console.error("Unable to find dependency", key, "Please check documentation and ensure you have imported the required library into your project");
  }
};
function fitData(columns, forced) {
  if (forced) {
    this.table.columnManager.renderer.reinitializeColumnWidths(columns);
  }
  if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
    this.table.modules.responsiveLayout.update();
  }
}
function fitDataGeneral(columns, forced) {
  columns.forEach(function(column) {
    column.reinitializeWidth();
  });
  if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
    this.table.modules.responsiveLayout.update();
  }
}
function fitDataStretch(columns, forced) {
  var colsWidth = 0, tableWidth = this.table.rowManager.element.clientWidth, gap = 0, lastCol = false;
  columns.forEach((column, i) => {
    if (!column.widthFixed) {
      column.reinitializeWidth();
    }
    if (this.table.options.responsiveLayout ? column.modules.responsive.visible : column.visible) {
      lastCol = column;
    }
    if (column.visible) {
      colsWidth += column.getWidth();
    }
  });
  if (lastCol) {
    gap = tableWidth - colsWidth + lastCol.getWidth();
    if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
      lastCol.setWidth(0);
      this.table.modules.responsiveLayout.update();
    }
    if (gap > 0) {
      lastCol.setWidth(gap);
    } else {
      lastCol.reinitializeWidth();
    }
  } else {
    if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
      this.table.modules.responsiveLayout.update();
    }
  }
}
function fitColumns(columns, forced) {
  var totalWidth = this.table.rowManager.element.getBoundingClientRect().width;
  var fixedWidth = 0;
  var flexWidth = 0;
  var flexGrowUnits = 0;
  var flexColWidth = 0;
  var flexColumns = [];
  var fixedShrinkColumns = [];
  var flexShrinkUnits = 0;
  var overflowWidth = 0;
  var gapFill = 0;
  function calcWidth(width) {
    var colWidth;
    if (typeof width == "string") {
      if (width.indexOf("%") > -1) {
        colWidth = totalWidth / 100 * parseInt(width);
      } else {
        colWidth = parseInt(width);
      }
    } else {
      colWidth = width;
    }
    return colWidth;
  }
  function scaleColumns(columns2, freeSpace, colWidth, shrinkCols) {
    var oversizeCols = [], oversizeSpace = 0, remainingSpace = 0, nextColWidth = 0, remainingFlexGrowUnits = flexGrowUnits, gap = 0, changeUnits = 0, undersizeCols = [];
    function calcGrow(col) {
      return colWidth * (col.column.definition.widthGrow || 1);
    }
    function calcShrink(col) {
      return calcWidth(col.width) - colWidth * (col.column.definition.widthShrink || 0);
    }
    columns2.forEach(function(col, i) {
      var width = shrinkCols ? calcShrink(col) : calcGrow(col);
      if (col.column.minWidth >= width) {
        oversizeCols.push(col);
      } else {
        if (col.column.maxWidth && col.column.maxWidth < width) {
          col.width = col.column.maxWidth;
          freeSpace -= col.column.maxWidth;
          remainingFlexGrowUnits -= shrinkCols ? col.column.definition.widthShrink || 1 : col.column.definition.widthGrow || 1;
          if (remainingFlexGrowUnits) {
            colWidth = Math.floor(freeSpace / remainingFlexGrowUnits);
          }
        } else {
          undersizeCols.push(col);
          changeUnits += shrinkCols ? col.column.definition.widthShrink || 1 : col.column.definition.widthGrow || 1;
        }
      }
    });
    if (oversizeCols.length) {
      oversizeCols.forEach(function(col) {
        oversizeSpace += shrinkCols ? col.width - col.column.minWidth : col.column.minWidth;
        col.width = col.column.minWidth;
      });
      remainingSpace = freeSpace - oversizeSpace;
      nextColWidth = changeUnits ? Math.floor(remainingSpace / changeUnits) : remainingSpace;
      gap = scaleColumns(undersizeCols, remainingSpace, nextColWidth, shrinkCols);
    } else {
      gap = changeUnits ? freeSpace - Math.floor(freeSpace / changeUnits) * changeUnits : freeSpace;
      undersizeCols.forEach(function(column) {
        column.width = shrinkCols ? calcShrink(column) : calcGrow(column);
      });
    }
    return gap;
  }
  if (this.table.options.responsiveLayout && this.table.modExists("responsiveLayout", true)) {
    this.table.modules.responsiveLayout.update();
  }
  if (this.table.rowManager.element.scrollHeight > this.table.rowManager.element.clientHeight) {
    totalWidth -= this.table.rowManager.element.offsetWidth - this.table.rowManager.element.clientWidth;
  }
  columns.forEach(function(column) {
    var width, minWidth, colWidth;
    if (column.visible) {
      width = column.definition.width;
      minWidth = parseInt(column.minWidth);
      if (width) {
        colWidth = calcWidth(width);
        fixedWidth += colWidth > minWidth ? colWidth : minWidth;
        if (column.definition.widthShrink) {
          fixedShrinkColumns.push({
            column,
            width: colWidth > minWidth ? colWidth : minWidth
          });
          flexShrinkUnits += column.definition.widthShrink;
        }
      } else {
        flexColumns.push({
          column,
          width: 0
        });
        flexGrowUnits += column.definition.widthGrow || 1;
      }
    }
  });
  flexWidth = totalWidth - fixedWidth;
  flexColWidth = Math.floor(flexWidth / flexGrowUnits);
  gapFill = scaleColumns(flexColumns, flexWidth, flexColWidth, false);
  if (flexColumns.length && gapFill > 0) {
    flexColumns[flexColumns.length - 1].width += gapFill;
  }
  flexColumns.forEach(function(col) {
    flexWidth -= col.width;
  });
  overflowWidth = Math.abs(gapFill) + flexWidth;
  if (overflowWidth > 0 && flexShrinkUnits) {
    gapFill = scaleColumns(fixedShrinkColumns, overflowWidth, Math.floor(overflowWidth / flexShrinkUnits), true);
  }
  if (gapFill && fixedShrinkColumns.length) {
    fixedShrinkColumns[fixedShrinkColumns.length - 1].width -= gapFill;
  }
  flexColumns.forEach(function(col) {
    col.column.setWidth(col.width);
  });
  fixedShrinkColumns.forEach(function(col) {
    col.column.setWidth(col.width);
  });
}
var defaultModes = {
  fitData,
  fitDataFill: fitDataGeneral,
  fitDataTable: fitDataGeneral,
  fitDataStretch,
  fitColumns
};
var Layout = class _Layout extends Module {
  static moduleName = "layout";
  //load defaults
  static modes = defaultModes;
  constructor(table2) {
    super(table2, "layout");
    this.mode = null;
    this.registerTableOption("layout", "fitData");
    this.registerTableOption("layoutColumnsOnNewData", false);
    this.registerColumnOption("widthGrow");
    this.registerColumnOption("widthShrink");
  }
  //initialize layout system
  initialize() {
    var layout = this.table.options.layout;
    if (_Layout.modes[layout]) {
      this.mode = layout;
    } else {
      console.warn("Layout Error - invalid mode set, defaulting to 'fitData' : " + layout);
      this.mode = "fitData";
    }
    this.table.element.setAttribute("tabulator-layout", this.mode);
    this.subscribe("column-init", this.initializeColumn.bind(this));
  }
  initializeColumn(column) {
    if (column.definition.widthGrow) {
      column.definition.widthGrow = Number(column.definition.widthGrow);
    }
    if (column.definition.widthShrink) {
      column.definition.widthShrink = Number(column.definition.widthShrink);
    }
  }
  getMode() {
    return this.mode;
  }
  //trigger table layout
  layout(dataChanged) {
    var variableHeight = this.table.columnManager.columnsByIndex.find((column) => column.definition.variableHeight || column.definition.formatter === "textarea");
    this.dispatch("layout-refreshing");
    _Layout.modes[this.mode].call(this, this.table.columnManager.columnsByIndex, dataChanged);
    if (variableHeight) {
      this.table.rowManager.normalizeHeight(true);
    }
    this.dispatch("layout-refreshed");
  }
};
var defaultLangs = {
  "default": {
    //hold default locale text
    "groups": {
      "item": "item",
      "items": "items"
    },
    "columns": {},
    "data": {
      "loading": "Loading",
      "error": "Error"
    },
    "pagination": {
      "page_size": "Page Size",
      "page_title": "Show Page",
      "first": "First",
      "first_title": "First Page",
      "last": "Last",
      "last_title": "Last Page",
      "prev": "Prev",
      "prev_title": "Prev Page",
      "next": "Next",
      "next_title": "Next Page",
      "all": "All",
      "counter": {
        "showing": "Showing",
        "of": "of",
        "rows": "rows",
        "pages": "pages"
      }
    },
    "headerFilters": {
      "default": "filter column...",
      "columns": {}
    }
  }
};
var Localize = class _Localize extends Module {
  static moduleName = "localize";
  //load defaults
  static langs = defaultLangs;
  constructor(table2) {
    super(table2);
    this.locale = "default";
    this.lang = false;
    this.bindings = {};
    this.langList = {};
    this.registerTableOption("locale", false);
    this.registerTableOption("langs", {});
  }
  initialize() {
    this.langList = Helpers.deepClone(_Localize.langs);
    if (this.table.options.columnDefaults.headerFilterPlaceholder !== false) {
      this.setHeaderFilterPlaceholder(this.table.options.columnDefaults.headerFilterPlaceholder);
    }
    for (let locale in this.table.options.langs) {
      this.installLang(locale, this.table.options.langs[locale]);
    }
    this.setLocale(this.table.options.locale);
    this.registerTableFunction("setLocale", this.setLocale.bind(this));
    this.registerTableFunction("getLocale", this.getLocale.bind(this));
    this.registerTableFunction("getLang", this.getLang.bind(this));
  }
  //set header placeholder
  setHeaderFilterPlaceholder(placeholder) {
    this.langList.default.headerFilters.default = placeholder;
  }
  //setup a lang description object
  installLang(locale, lang) {
    if (this.langList[locale]) {
      this._setLangProp(this.langList[locale], lang);
    } else {
      this.langList[locale] = lang;
    }
  }
  _setLangProp(lang, values) {
    for (let key in values) {
      if (lang[key] && typeof lang[key] == "object") {
        this._setLangProp(lang[key], values[key]);
      } else {
        lang[key] = values[key];
      }
    }
  }
  //set current locale
  setLocale(desiredLocale) {
    desiredLocale = desiredLocale || "default";
    function traverseLang(trans, path) {
      for (var prop in trans) {
        if (typeof trans[prop] == "object") {
          if (!path[prop]) {
            path[prop] = {};
          }
          traverseLang(trans[prop], path[prop]);
        } else {
          path[prop] = trans[prop];
        }
      }
    }
    if (desiredLocale === true && navigator.language) {
      desiredLocale = navigator.language.toLowerCase();
    }
    if (desiredLocale) {
      if (!this.langList[desiredLocale]) {
        let prefix = desiredLocale.split("-")[0];
        if (this.langList[prefix]) {
          console.warn("Localization Error - Exact matching locale not found, using closest match: ", desiredLocale, prefix);
          desiredLocale = prefix;
        } else {
          console.warn("Localization Error - Matching locale not found, using default: ", desiredLocale);
          desiredLocale = "default";
        }
      }
    }
    this.locale = desiredLocale;
    this.lang = Helpers.deepClone(this.langList.default || {});
    if (desiredLocale != "default") {
      traverseLang(this.langList[desiredLocale], this.lang);
    }
    this.dispatchExternal("localized", this.locale, this.lang);
    this._executeBindings();
  }
  //get current locale
  getLocale(locale) {
    return this.locale;
  }
  //get lang object for given local or current if none provided
  getLang(locale) {
    return locale ? this.langList[locale] : this.lang;
  }
  //get text for current locale
  getText(path, value) {
    var fillPath = value ? path + "|" + value : path, pathArray = fillPath.split("|"), text = this._getLangElement(pathArray, this.locale);
    return text || "";
  }
  //traverse langs object and find localized copy
  _getLangElement(path, locale) {
    var root = this.lang;
    path.forEach(function(level) {
      var rootPath;
      if (root) {
        rootPath = root[level];
        if (typeof rootPath != "undefined") {
          root = rootPath;
        } else {
          root = false;
        }
      }
    });
    return root;
  }
  //set update binding
  bind(path, callback) {
    if (!this.bindings[path]) {
      this.bindings[path] = [];
    }
    this.bindings[path].push(callback);
    callback(this.getText(path), this.lang);
  }
  //iterate through bindings and trigger updates
  _executeBindings() {
    for (let path in this.bindings) {
      this.bindings[path].forEach((binding) => {
        binding(this.getText(path), this.lang);
      });
    }
  }
};
var Comms = class extends Module {
  static moduleName = "comms";
  constructor(table2) {
    super(table2);
  }
  initialize() {
    this.registerTableFunction("tableComms", this.receive.bind(this));
  }
  getConnections(selectors) {
    var connections = [], connection;
    connection = this.table.constructor.registry.lookupTable(selectors);
    connection.forEach((con) => {
      if (this.table !== con) {
        connections.push(con);
      }
    });
    return connections;
  }
  send(selectors, module, action, data) {
    var connections = this.getConnections(selectors);
    connections.forEach((connection) => {
      connection.tableComms(this.table.element, module, action, data);
    });
    if (!connections.length && selectors) {
      console.warn("Table Connection Error - No tables matching selector found", selectors);
    }
  }
  receive(table2, module, action, data) {
    if (this.table.modExists(module)) {
      return this.table.modules[module].commsReceived(table2, action, data);
    } else {
      console.warn("Inter-table Comms Error - no such module:", module);
    }
  }
};
var coreModules = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  CommsModule: Comms,
  LayoutModule: Layout,
  LocalizeModule: Localize
});
var TableRegistry = class _TableRegistry {
  static registry = {
    tables: [],
    register(table2) {
      _TableRegistry.registry.tables.push(table2);
    },
    deregister(table2) {
      var index = _TableRegistry.registry.tables.indexOf(table2);
      if (index > -1) {
        _TableRegistry.registry.tables.splice(index, 1);
      }
    },
    lookupTable(query, silent) {
      var results = [], matches, match;
      if (typeof query === "string") {
        matches = document.querySelectorAll(query);
        if (matches.length) {
          for (var i = 0; i < matches.length; i++) {
            match = _TableRegistry.registry.matchElement(matches[i]);
            if (match) {
              results.push(match);
            }
          }
        }
      } else if (typeof HTMLElement !== "undefined" && query instanceof HTMLElement || query instanceof _TableRegistry) {
        match = _TableRegistry.registry.matchElement(query);
        if (match) {
          results.push(match);
        }
      } else if (Array.isArray(query)) {
        query.forEach(function(item) {
          results = results.concat(_TableRegistry.registry.lookupTable(item));
        });
      } else {
        if (!silent) {
          console.warn("Table Connection Error - Invalid Selector", query);
        }
      }
      return results;
    },
    matchElement(element) {
      return _TableRegistry.registry.tables.find(function(table2) {
        return element instanceof _TableRegistry ? table2 === element : table2.element === element;
      });
    }
  };
  static findTable(query) {
    var results = _TableRegistry.registry.lookupTable(query, true);
    return Array.isArray(results) && !results.length ? false : results;
  }
};
var ModuleBinder = class _ModuleBinder extends TableRegistry {
  static moduleBindings = {};
  static moduleExtensions = {};
  static modulesRegistered = false;
  static defaultModules = false;
  constructor() {
    super();
  }
  static initializeModuleBinder(defaultModules) {
    if (!_ModuleBinder.modulesRegistered) {
      _ModuleBinder.modulesRegistered = true;
      _ModuleBinder._registerModules(coreModules, true);
      if (defaultModules) {
        _ModuleBinder._registerModules(defaultModules);
      }
    }
  }
  static _extendModule(name, property, values) {
    if (_ModuleBinder.moduleBindings[name]) {
      var source = _ModuleBinder.moduleBindings[name][property];
      if (source) {
        if (typeof values == "object") {
          for (let key in values) {
            source[key] = values[key];
          }
        } else {
          console.warn("Module Error - Invalid value type, it must be an object");
        }
      } else {
        console.warn("Module Error - property does not exist:", property);
      }
    } else {
      console.warn("Module Error - module does not exist:", name);
    }
  }
  static _registerModules(modules, core) {
    var mods = Object.values(modules);
    if (core) {
      mods.forEach((mod) => {
        mod.prototype.moduleCore = true;
      });
    }
    _ModuleBinder._registerModule(mods);
  }
  static _registerModule(modules) {
    if (!Array.isArray(modules)) {
      modules = [modules];
    }
    modules.forEach((mod) => {
      _ModuleBinder._registerModuleBinding(mod);
      _ModuleBinder._registerModuleExtensions(mod);
    });
  }
  static _registerModuleBinding(mod) {
    if (mod.moduleName) {
      _ModuleBinder.moduleBindings[mod.moduleName] = mod;
    } else {
      console.error("Unable to bind module, no moduleName defined", mod.moduleName);
    }
  }
  static _registerModuleExtensions(mod) {
    var extensions = mod.moduleExtensions;
    if (mod.moduleExtensions) {
      for (let modKey in extensions) {
        let ext = extensions[modKey];
        if (_ModuleBinder.moduleBindings[modKey]) {
          for (let propKey in ext) {
            _ModuleBinder._extendModule(modKey, propKey, ext[propKey]);
          }
        } else {
          if (!_ModuleBinder.moduleExtensions[modKey]) {
            _ModuleBinder.moduleExtensions[modKey] = {};
          }
          for (let propKey in ext) {
            if (!_ModuleBinder.moduleExtensions[modKey][propKey]) {
              _ModuleBinder.moduleExtensions[modKey][propKey] = {};
            }
            Object.assign(_ModuleBinder.moduleExtensions[modKey][propKey], ext[propKey]);
          }
        }
      }
    }
    _ModuleBinder._extendModuleFromQueue(mod);
  }
  static _extendModuleFromQueue(mod) {
    var extensions = _ModuleBinder.moduleExtensions[mod.moduleName];
    if (extensions) {
      for (let propKey in extensions) {
        _ModuleBinder._extendModule(mod.moduleName, propKey, extensions[propKey]);
      }
    }
  }
  //ensure that module are bound to instantiated function
  _bindModules() {
    var orderedStartMods = [], orderedEndMods = [], unOrderedMods = [];
    this.modules = {};
    for (var name in _ModuleBinder.moduleBindings) {
      let mod = _ModuleBinder.moduleBindings[name];
      let module = new mod(this);
      this.modules[name] = module;
      if (mod.prototype.moduleCore) {
        this.modulesCore.push(module);
      } else {
        if (mod.moduleInitOrder) {
          if (mod.moduleInitOrder < 0) {
            orderedStartMods.push(module);
          } else {
            orderedEndMods.push(module);
          }
        } else {
          unOrderedMods.push(module);
        }
      }
    }
    orderedStartMods.sort((a, b) => a.moduleInitOrder > b.moduleInitOrder ? 1 : -1);
    orderedEndMods.sort((a, b) => a.moduleInitOrder > b.moduleInitOrder ? 1 : -1);
    this.modulesRegular = orderedStartMods.concat(unOrderedMods.concat(orderedEndMods));
  }
};
var Alert = class extends CoreFeature {
  constructor(table2) {
    super(table2);
    this.element = this._createAlertElement();
    this.msgElement = this._createMsgElement();
    this.type = null;
    this.element.appendChild(this.msgElement);
  }
  _createAlertElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-alert");
    return el;
  }
  _createMsgElement() {
    var el = document.createElement("div");
    el.classList.add("tabulator-alert-msg");
    el.setAttribute("role", "alert");
    return el;
  }
  _typeClass() {
    return "tabulator-alert-state-" + this.type;
  }
  alert(content, type = "msg") {
    if (content) {
      this.clear();
      this.dispatch("alert-show", type);
      this.type = type;
      while (this.msgElement.firstChild) this.msgElement.removeChild(this.msgElement.firstChild);
      this.msgElement.classList.add(this._typeClass());
      if (typeof content === "function") {
        content = content();
      }
      if (content instanceof HTMLElement) {
        this.msgElement.appendChild(content);
      } else {
        this.msgElement.innerHTML = content;
      }
      this.table.element.appendChild(this.element);
    }
  }
  clear() {
    this.dispatch("alert-hide", this.type);
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.msgElement.classList.remove(this._typeClass());
  }
};
var Tabulator = class _Tabulator extends ModuleBinder {
  //default setup options
  static defaultOptions = defaultOptions;
  static extendModule() {
    _Tabulator.initializeModuleBinder();
    _Tabulator._extendModule(...arguments);
  }
  static registerModule() {
    _Tabulator.initializeModuleBinder();
    _Tabulator._registerModule(...arguments);
  }
  constructor(element, options, modules) {
    super();
    _Tabulator.initializeModuleBinder(modules);
    this.options = {};
    this.columnManager = null;
    this.rowManager = null;
    this.footerManager = null;
    this.alertManager = null;
    this.vdomHoz = null;
    this.externalEvents = null;
    this.eventBus = null;
    this.interactionMonitor = false;
    this.browser = "";
    this.browserSlow = false;
    this.browserMobile = false;
    this.rtl = false;
    this.originalElement = null;
    this.componentFunctionBinder = new ComponentFunctionBinder(this);
    this.dataLoader = false;
    this.modules = {};
    this.modulesCore = [];
    this.modulesRegular = [];
    this.deprecationAdvisor = new DeprecationAdvisor(this);
    this.optionsList = new OptionsList(this, "table constructor");
    this.dependencyRegistry = new DependencyRegistry(this);
    this.initialized = false;
    this.destroyed = false;
    if (this.initializeElement(element)) {
      this.initializeCoreSystems(options);
      setTimeout(() => {
        this._create();
      });
    }
    this.constructor.registry.register(this);
  }
  initializeElement(element) {
    if (typeof HTMLElement !== "undefined" && element instanceof HTMLElement) {
      this.element = element;
      return true;
    } else if (typeof element === "string") {
      this.element = document.querySelector(element);
      if (this.element) {
        return true;
      } else {
        console.error("Tabulator Creation Error - no element found matching selector: ", element);
        return false;
      }
    } else {
      console.error("Tabulator Creation Error - Invalid element provided:", element);
      return false;
    }
  }
  initializeCoreSystems(options) {
    this.columnManager = new ColumnManager(this);
    this.rowManager = new RowManager(this);
    this.footerManager = new FooterManager(this);
    this.dataLoader = new DataLoader(this);
    this.alertManager = new Alert(this);
    this._bindModules();
    this.options = this.optionsList.generate(_Tabulator.defaultOptions, options);
    this._clearObjectPointers();
    this._mapDeprecatedFunctionality();
    this.externalEvents = new ExternalEventBus(this, this.options, this.options.debugEventsExternal);
    this.eventBus = new InternalEventBus(this.options.debugEventsInternal);
    this.interactionMonitor = new InteractionManager(this);
    this.dataLoader.initialize();
    this.footerManager.initialize();
    this.dependencyRegistry.initialize();
  }
  //convert deprecated functionality to new functions
  _mapDeprecatedFunctionality() {
  }
  _clearSelection() {
    this.element.classList.add("tabulator-block-select");
    if (window.getSelection) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {
      document.selection.empty();
    }
    this.element.classList.remove("tabulator-block-select");
  }
  //create table
  _create() {
    this.externalEvents.dispatch("tableBuilding");
    this.eventBus.dispatch("table-building");
    this._rtlCheck();
    this._buildElement();
    this._initializeTable();
    this.initialized = true;
    this._loadInitialData().finally(() => {
      this.eventBus.dispatch("table-initialized");
      this.externalEvents.dispatch("tableBuilt");
    });
  }
  _rtlCheck() {
    var style = window.getComputedStyle(this.element);
    switch (this.options.textDirection) {
      case "auto":
        if (style.direction !== "rtl") {
          break;
        }
      case "rtl":
        this.element.classList.add("tabulator-rtl");
        this.rtl = true;
        break;
      case "ltr":
        this.element.classList.add("tabulator-ltr");
      default:
        this.rtl = false;
    }
  }
  //clear pointers to objects in default config object
  _clearObjectPointers() {
    this.options.columns = this.options.columns.slice(0);
    if (Array.isArray(this.options.data) && !this.options.reactiveData) {
      this.options.data = this.options.data.slice(0);
    }
  }
  //build tabulator element
  _buildElement() {
    var element = this.element, options = this.options, newElement;
    if (element.tagName === "TABLE") {
      this.originalElement = this.element;
      newElement = document.createElement("div");
      var attributes = element.attributes;
      for (var i in attributes) {
        if (typeof attributes[i] == "object") {
          newElement.setAttribute(attributes[i].name, attributes[i].value);
        }
      }
      element.parentNode.replaceChild(newElement, element);
      this.element = element = newElement;
    }
    element.classList.add("tabulator");
    element.setAttribute("role", "grid");
    while (element.firstChild) element.removeChild(element.firstChild);
    if (options.height) {
      options.height = isNaN(options.height) ? options.height : options.height + "px";
      element.style.height = options.height;
    }
    if (options.minHeight !== false) {
      options.minHeight = isNaN(options.minHeight) ? options.minHeight : options.minHeight + "px";
      element.style.minHeight = options.minHeight;
    }
    if (options.maxHeight !== false) {
      options.maxHeight = isNaN(options.maxHeight) ? options.maxHeight : options.maxHeight + "px";
      element.style.maxHeight = options.maxHeight;
    }
  }
  //initialize core systems and modules
  _initializeTable() {
    var element = this.element, options = this.options;
    this.interactionMonitor.initialize();
    this.columnManager.initialize();
    this.rowManager.initialize();
    this._detectBrowser();
    this.modulesCore.forEach((mod) => {
      mod.initialize();
    });
    element.appendChild(this.columnManager.getElement());
    element.appendChild(this.rowManager.getElement());
    if (options.footerElement) {
      this.footerManager.activate();
    }
    if (options.autoColumns && options.data) {
      this.columnManager.generateColumnsFromRowData(this.options.data);
    }
    this.modulesRegular.forEach((mod) => {
      mod.initialize();
    });
    this.columnManager.setColumns(options.columns);
    this.eventBus.dispatch("table-built");
  }
  _loadInitialData() {
    return this.dataLoader.load(this.options.data).finally(() => {
      this.columnManager.verticalAlignHeaders();
    });
  }
  //deconstructor
  destroy() {
    var element = this.element;
    this.destroyed = true;
    this.constructor.registry.deregister(this);
    this.eventBus.dispatch("table-destroy");
    this.rowManager.destroy();
    while (element.firstChild) element.removeChild(element.firstChild);
    element.classList.remove("tabulator");
    this.externalEvents.dispatch("tableDestroyed");
  }
  _detectBrowser() {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    if (ua.indexOf("Trident") > -1) {
      this.browser = "ie";
      this.browserSlow = true;
    } else if (ua.indexOf("Edge") > -1) {
      this.browser = "edge";
      this.browserSlow = true;
    } else if (ua.indexOf("Firefox") > -1) {
      this.browser = "firefox";
      this.browserSlow = false;
    } else if (ua.indexOf("Mac OS") > -1) {
      this.browser = "safari";
      this.browserSlow = false;
    } else {
      this.browser = "other";
      this.browserSlow = false;
    }
    this.browserMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(ua.slice(0, 4));
  }
  initGuard(func, msg) {
    var stack, line;
    if (this.options.debugInitialization && !this.initialized) {
      if (!func) {
        stack = new Error().stack.split("\n");
        line = stack[0] == "Error" ? stack[2] : stack[1];
        if (line[0] == " ") {
          func = line.trim().split(" ")[1].split(".")[1];
        } else {
          func = line.trim().split("@")[0];
        }
      }
      console.warn("Table Not Initialized - Calling the " + func + " function before the table is initialized may result in inconsistent behavior, Please wait for the `tableBuilt` event before calling this function." + (msg ? " " + msg : ""));
    }
    return this.initialized;
  }
  ////////////////// Data Handling //////////////////
  //block table redrawing
  blockRedraw() {
    this.initGuard();
    this.eventBus.dispatch("redraw-blocking");
    this.rowManager.blockRedraw();
    this.columnManager.blockRedraw();
    this.eventBus.dispatch("redraw-blocked");
  }
  //restore table redrawing
  restoreRedraw() {
    this.initGuard();
    this.eventBus.dispatch("redraw-restoring");
    this.rowManager.restoreRedraw();
    this.columnManager.restoreRedraw();
    this.eventBus.dispatch("redraw-restored");
  }
  //load data
  setData(data, params, config) {
    this.initGuard(false, "To set initial data please use the 'data' property in the table constructor.");
    return this.dataLoader.load(data, params, config, false);
  }
  //clear data
  clearData() {
    this.initGuard();
    this.dataLoader.blockActiveLoad();
    this.rowManager.clearData();
  }
  //get table data array
  getData(active) {
    return this.rowManager.getData(active);
  }
  //get table data array count
  getDataCount(active) {
    return this.rowManager.getDataCount(active);
  }
  //replace data, keeping table in position with same sort
  replaceData(data, params, config) {
    this.initGuard();
    return this.dataLoader.load(data, params, config, true, true);
  }
  //update table data
  updateData(data) {
    var responses = 0;
    this.initGuard();
    return new Promise((resolve, reject) => {
      this.dataLoader.blockActiveLoad();
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (data && data.length > 0) {
        data.forEach((item) => {
          var row = this.rowManager.findRow(item[this.options.index]);
          if (row) {
            responses++;
            row.updateData(item).then(() => {
              responses--;
              if (!responses) {
                resolve();
              }
            }).catch((e) => {
              reject("Update Error - Unable to update row", item, e);
            });
          } else {
            reject("Update Error - Unable to find row", item);
          }
        });
      } else {
        console.warn("Update Error - No data provided");
        reject("Update Error - No data provided");
      }
    });
  }
  addData(data, pos, index) {
    this.initGuard();
    return new Promise((resolve, reject) => {
      this.dataLoader.blockActiveLoad();
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (data) {
        this.rowManager.addRows(data, pos, index).then((rows2) => {
          var output = [];
          rows2.forEach(function(row) {
            output.push(row.getComponent());
          });
          resolve(output);
        });
      } else {
        console.warn("Update Error - No data provided");
        reject("Update Error - No data provided");
      }
    });
  }
  //update table data
  updateOrAddData(data) {
    var rows2 = [], responses = 0;
    this.initGuard();
    return new Promise((resolve, reject) => {
      this.dataLoader.blockActiveLoad();
      if (typeof data === "string") {
        data = JSON.parse(data);
      }
      if (data && data.length > 0) {
        data.forEach((item) => {
          var row = this.rowManager.findRow(item[this.options.index]);
          responses++;
          if (row) {
            row.updateData(item).then(() => {
              responses--;
              rows2.push(row.getComponent());
              if (!responses) {
                resolve(rows2);
              }
            });
          } else {
            this.rowManager.addRows(item).then((newRows) => {
              responses--;
              rows2.push(newRows[0].getComponent());
              if (!responses) {
                resolve(rows2);
              }
            });
          }
        });
      } else {
        console.warn("Update Error - No data provided");
        reject("Update Error - No data provided");
      }
    });
  }
  //get row object
  getRow(index) {
    var row = this.rowManager.findRow(index);
    if (row) {
      return row.getComponent();
    } else {
      console.warn("Find Error - No matching row found:", index);
      return false;
    }
  }
  //get row object
  getRowFromPosition(position) {
    var row = this.rowManager.getRowFromPosition(position);
    if (row) {
      return row.getComponent();
    } else {
      console.warn("Find Error - No matching row found:", position);
      return false;
    }
  }
  //delete row from table
  deleteRow(index) {
    var foundRows = [];
    this.initGuard();
    if (!Array.isArray(index)) {
      index = [index];
    }
    for (let item of index) {
      let row = this.rowManager.findRow(item, true);
      if (row) {
        foundRows.push(row);
      } else {
        console.error("Delete Error - No matching row found:", item);
        return Promise.reject("Delete Error - No matching row found");
      }
    }
    foundRows.sort((a, b) => {
      return this.rowManager.rows.indexOf(a) > this.rowManager.rows.indexOf(b) ? 1 : -1;
    });
    foundRows.forEach((row) => {
      row.delete();
    });
    this.rowManager.reRenderInPosition();
    return Promise.resolve();
  }
  //add row to table
  addRow(data, pos, index) {
    this.initGuard();
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    return this.rowManager.addRows(data, pos, index, true).then((rows2) => {
      return rows2[0].getComponent();
    });
  }
  //update a row if it exists otherwise create it
  updateOrAddRow(index, data) {
    var row = this.rowManager.findRow(index);
    this.initGuard();
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (row) {
      return row.updateData(data).then(() => {
        return row.getComponent();
      });
    } else {
      return this.rowManager.addRows(data).then((rows2) => {
        return rows2[0].getComponent();
      });
    }
  }
  //update row data
  updateRow(index, data) {
    var row = this.rowManager.findRow(index);
    this.initGuard();
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    if (row) {
      return row.updateData(data).then(() => {
        return Promise.resolve(row.getComponent());
      });
    } else {
      console.warn("Update Error - No matching row found:", index);
      return Promise.reject("Update Error - No matching row found");
    }
  }
  //scroll to row in DOM
  scrollToRow(index, position, ifVisible) {
    var row = this.rowManager.findRow(index);
    if (row) {
      return this.rowManager.scrollToRow(row, position, ifVisible);
    } else {
      console.warn("Scroll Error - No matching row found:", index);
      return Promise.reject("Scroll Error - No matching row found");
    }
  }
  moveRow(from3, to, after) {
    var fromRow = this.rowManager.findRow(from3);
    this.initGuard();
    if (fromRow) {
      fromRow.moveToRow(to, after);
    } else {
      console.warn("Move Error - No matching row found:", from3);
    }
  }
  getRows(active) {
    return this.rowManager.getComponents(active);
  }
  //get position of row in table
  getRowPosition(index) {
    var row = this.rowManager.findRow(index);
    if (row) {
      return row.getPosition();
    } else {
      console.warn("Position Error - No matching row found:", index);
      return false;
    }
  }
  /////////////// Column Functions  ///////////////
  setColumns(definition) {
    this.initGuard(false, "To set initial columns please use the 'columns' property in the table constructor");
    this.columnManager.setColumns(definition);
  }
  getColumns(structured) {
    return this.columnManager.getComponents(structured);
  }
  getColumn(field) {
    var column = this.columnManager.findColumn(field);
    if (column) {
      return column.getComponent();
    } else {
      console.warn("Find Error - No matching column found:", field);
      return false;
    }
  }
  getColumnDefinitions() {
    return this.columnManager.getDefinitionTree();
  }
  showColumn(field) {
    var column = this.columnManager.findColumn(field);
    this.initGuard();
    if (column) {
      column.show();
    } else {
      console.warn("Column Show Error - No matching column found:", field);
      return false;
    }
  }
  hideColumn(field) {
    var column = this.columnManager.findColumn(field);
    this.initGuard();
    if (column) {
      column.hide();
    } else {
      console.warn("Column Hide Error - No matching column found:", field);
      return false;
    }
  }
  toggleColumn(field) {
    var column = this.columnManager.findColumn(field);
    this.initGuard();
    if (column) {
      if (column.visible) {
        column.hide();
      } else {
        column.show();
      }
    } else {
      console.warn("Column Visibility Toggle Error - No matching column found:", field);
      return false;
    }
  }
  addColumn(definition, before, field) {
    var column = this.columnManager.findColumn(field);
    this.initGuard();
    return this.columnManager.addColumn(definition, before, column).then((column2) => {
      return column2.getComponent();
    });
  }
  deleteColumn(field) {
    var column = this.columnManager.findColumn(field);
    this.initGuard();
    if (column) {
      return column.delete();
    } else {
      console.warn("Column Delete Error - No matching column found:", field);
      return Promise.reject();
    }
  }
  updateColumnDefinition(field, definition) {
    var column = this.columnManager.findColumn(field);
    this.initGuard();
    if (column) {
      return column.updateDefinition(definition);
    } else {
      console.warn("Column Update Error - No matching column found:", field);
      return Promise.reject();
    }
  }
  moveColumn(from3, to, after) {
    var fromColumn = this.columnManager.findColumn(from3), toColumn = this.columnManager.findColumn(to);
    this.initGuard();
    if (fromColumn) {
      if (toColumn) {
        this.columnManager.moveColumn(fromColumn, toColumn, after);
      } else {
        console.warn("Move Error - No matching column found:", toColumn);
      }
    } else {
      console.warn("Move Error - No matching column found:", from3);
    }
  }
  //scroll to column in DOM
  scrollToColumn(field, position, ifVisible) {
    return new Promise((resolve, reject) => {
      var column = this.columnManager.findColumn(field);
      if (column) {
        return this.columnManager.scrollToColumn(column, position, ifVisible);
      } else {
        console.warn("Scroll Error - No matching column found:", field);
        return Promise.reject("Scroll Error - No matching column found");
      }
    });
  }
  //////////// General Public Functions ////////////
  //redraw list without updating data
  redraw(force) {
    this.initGuard();
    this.columnManager.redraw(force);
    this.rowManager.redraw(force);
  }
  setHeight(height) {
    this.options.height = isNaN(height) ? height : height + "px";
    this.element.style.height = this.options.height;
    this.rowManager.initializeRenderer();
    this.rowManager.redraw(true);
  }
  //////////////////// Event Bus ///////////////////
  on(key, callback) {
    this.externalEvents.subscribe(key, callback);
  }
  off(key, callback) {
    this.externalEvents.unsubscribe(key, callback);
  }
  dispatchEvent() {
    var args = Array.from(arguments);
    args.shift();
    this.externalEvents.dispatch(...arguments);
  }
  //////////////////// Alerts ///////////////////
  alert(contents, type) {
    this.initGuard();
    this.alertManager.alert(contents, type);
  }
  clearAlert() {
    this.initGuard();
    this.alertManager.clear();
  }
  ////////////// Extension Management //////////////
  modExists(plugin, required) {
    if (this.modules[plugin]) {
      return true;
    } else {
      if (required) {
        console.error("Tabulator Module Not Installed: " + plugin);
      }
      return false;
    }
  }
  module(key) {
    var mod = this.modules[key];
    if (!mod) {
      console.error("Tabulator module not installed: " + key);
    }
    return mod;
  }
};
var Tabulator$1 = Tabulator;

// src/pyon/set.ts
var set_exports = {};
__export(set_exports, {
  copy: () => copy,
  forPreview: () => forPreview,
  fromHuman: () => fromHuman,
  fromMachine: () => fromMachine,
  toHuman: () => toHuman,
  toMachine: () => toMachine
});
var fromMachine = (params) => new Set(params[0]);
var toMachine = (data) => [[...data]];
var fromHuman = fromMachine;
var toHuman = toMachine;
var forPreview = (data) => [...data];
var copy = (src) => new Set(src);

// src/pyon/dict.ts
var dict_exports = {};
__export(dict_exports, {
  Dict: () => Dict,
  copy: () => copy2,
  del: () => del,
  forPreview: () => forPreview2,
  fromHuman: () => fromHuman2,
  fromMachine: () => fromMachine2,
  get: () => get,
  set: () => set,
  toHuman: () => toHuman2,
  toMachine: () => toMachine2
});
var import_fast_deep_equal = __toESM(require_fast_deep_equal(), 1);
var Dict = class extends Map {
  // like Map, but Object keys are compared by value, not by reference
  // inspired by Python dictionary
  equalPYON(v1, v2) {
    return (0, import_fast_deep_equal.default)(v1, v2) && v1.__jsonclass__ === v2.__jsonclass__;
  }
  find(key) {
    if (typeof key !== "object") {
      return key;
    }
    for (let k of this.keys()) {
      if (this.equalPYON(k, key)) {
        return k;
      }
    }
    return key;
  }
  set(key, value) {
    return super.set(this.find(key), value);
  }
  get(key) {
    return super.get(this.find(key));
  }
  has(key) {
    return super.has(this.find(key));
  }
  delete(key) {
    return super.delete(this.find(key));
  }
};
var fromMachine2 = (params) => {
  let d = new Dict();
  params[0].forEach((e) => d.set(e[0], e[1]));
  return d;
};
var toMachine2 = (data) => [Array.from(data)];
var fromHuman2 = fromMachine2;
var toHuman2 = toMachine2;
var forPreview2 = (data) => Array.from(data);
var copy2 = (src) => {
  let clone = new Dict();
  for (let [k, v] of src) {
    clone.set(k, v);
  }
  return clone;
};
var get = (tagged, key) => tagged.get(key);
var set = (tagged, key, value) => tagged.set(key, value);
var del = (tagged, key) => tagged.delete(key);

// src/pyon/tuple.ts
var tuple_exports = {};
__export(tuple_exports, {
  copy: () => copy3,
  del: () => del2,
  forPreview: () => forPreview3,
  fromHuman: () => fromHuman3,
  fromMachine: () => fromMachine3,
  get: () => get2,
  set: () => set2,
  toHuman: () => toHuman3,
  toMachine: () => toMachine3
});
var fromMachine3 = (params) => params[0];
var toMachine3 = (data) => [data];
var fromHuman3 = fromMachine3;
var toHuman3 = toMachine3;
var forPreview3 = (data) => data;
var copy3 = (src) => [...src];
var get2 = (tagged, key) => tagged[key];
var set2 = (tagged, key, value) => tagged[key] = value;
var del2 = (tagged, key) => delete tagged[key];

// src/pyon/nparray.ts
var nparray_exports = {};
__export(nparray_exports, {
  copy: () => copy5,
  forPreview: () => forPreview5,
  fromHuman: () => fromHuman5,
  fromMachine: () => fromMachine5,
  get: () => get3,
  set: () => set3,
  toHuman: () => toHuman5,
  toMachine: () => toMachine5
});

// src/pyon/npscalar.ts
var npscalar_exports = {};
__export(npscalar_exports, {
  copy: () => copy4,
  forPreview: () => forPreview4,
  fromHuman: () => fromHuman4,
  fromMachine: () => fromMachine4,
  toHuman: () => toHuman4,
  toMachine: () => toMachine4
});

// src/pyon/dtype.ts
var dict = [
  { dtype: "|i1", ctor: Int8Array },
  { dtype: "<i2", ctor: Int16Array },
  { dtype: "<i4", ctor: Int32Array },
  { dtype: "<i8", ctor: BigInt64Array },
  { dtype: "|u1", ctor: Uint8Array },
  { dtype: "<u2", ctor: Uint16Array },
  { dtype: "<u4", ctor: Uint32Array },
  { dtype: "<u8", ctor: BigUint64Array },
  // FIXME: use Float16Array, as soon it is natively available
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float16Array
  //    { dtype: "<f2", ctor: Float16Array },
  { dtype: "<f4", ctor: Float32Array },
  { dtype: "<f8", ctor: Float64Array },
  { dtype: "<c16", ctor: Float64Array }
];
var from = (dtype) => {
  let entry = dict.find((e) => e.dtype === dtype);
  if (entry) {
    return entry.ctor;
  }
  console.error("Unknown dtype: " + dtype);
  return Uint8Array;
};

// src/utils.ts
var bytesFrom = (base64) => Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
var base64From = (bytes) => btoa(String.fromCharCode(...bytes));

// src/pyon/npscalar.ts
var from2 = (dtypeName, data) => {
  let TypedArray = from(dtypeName);
  let typed = new TypedArray(data);
  typed.__dtype__ = dtypeName;
  return typed;
};
var fromMachine4 = ([dtypeName, base64]) => {
  let buffer = bytesFrom(base64).buffer;
  return from2(dtypeName, buffer);
};
var toMachine4 = (data) => {
  let base64 = base64From(new Uint8Array(data.buffer));
  return [data.__dtype__, base64];
};
var fromHuman4 = ([dtypeName, arr]) => from2(dtypeName, arr);
var toHuman4 = (data) => [
  data.__dtype__,
  [...data]
];
var forPreview4 = (data) => [...data];
var copy4 = (src) => {
  let dest = src.slice();
  dest.__dtype__ = src.__dtype__;
  return dest;
};

// src/pyon/nparray.ts
var fromMachine5 = ([shape, dtypeName, base64]) => {
  let typed = fromMachine4([dtypeName, base64]);
  typed.__shape__ = shape;
  return typed;
};
var toMachine5 = (data) => {
  let params = toMachine4(data);
  return [data.__shape__, ...params];
};
var fromHuman5 = ([shape, dtypeName, arr]) => {
  let typed = fromHuman4([dtypeName, arr]);
  typed.__shape__ = shape;
  return typed;
};
var toHuman5 = (data) => {
  let params = toHuman4(data);
  return [data.__shape__, ...params];
};
var forPreview5 = (data) => [...data];
var copy5 = (src) => {
  let dest = copy4(src);
  dest.__shape__ = src.__shape__;
  return dest;
};
var get3 = (tagged, key) => tagged[key];
var set3 = (tagged, key, value) => tagged[key] = value;

// src/pyon/fraction.ts
var fraction_exports = {};
__export(fraction_exports, {
  copy: () => copy6,
  forPreview: () => forPreview6,
  fromHuman: () => fromHuman6,
  fromMachine: () => fromMachine6,
  toHuman: () => toHuman6,
  toMachine: () => toMachine6
});

// node_modules/fraction.js/dist/fraction.mjs
if (typeof BigInt === "undefined") BigInt = function(n) {
  if (isNaN(n)) throw new Error("");
  return n;
};
var C_ZERO = BigInt(0);
var C_ONE = BigInt(1);
var C_TWO = BigInt(2);
var C_THREE = BigInt(3);
var C_FIVE = BigInt(5);
var C_TEN = BigInt(10);
var MAX_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
var MAX_CYCLE_LEN = 2e3;
var P = {
  "s": C_ONE,
  "n": C_ZERO,
  "d": C_ONE
};
function assign(n, s) {
  try {
    n = BigInt(n);
  } catch (e) {
    throw InvalidParameter();
  }
  return n * s;
}
function ifloor(x) {
  return typeof x === "bigint" ? x : Math.floor(x);
}
function newFraction(n, d) {
  if (d === C_ZERO) {
    throw DivisionByZero();
  }
  const f = Object.create(Fraction.prototype);
  f["s"] = n < C_ZERO ? -C_ONE : C_ONE;
  n = n < C_ZERO ? -n : n;
  const a = gcd(n, d);
  f["n"] = n / a;
  f["d"] = d / a;
  return f;
}
var FACTORSTEPS = [C_TWO * C_TWO, C_TWO, C_TWO * C_TWO, C_TWO, C_TWO * C_TWO, C_TWO * C_THREE, C_TWO, C_TWO * C_THREE];
function factorize(n) {
  const factors = /* @__PURE__ */ Object.create(null);
  if (n <= C_ONE) {
    factors[n] = C_ONE;
    return factors;
  }
  const add = (p) => {
    factors[p] = (factors[p] || C_ZERO) + C_ONE;
  };
  while (n % C_TWO === C_ZERO) {
    add(C_TWO);
    n /= C_TWO;
  }
  while (n % C_THREE === C_ZERO) {
    add(C_THREE);
    n /= C_THREE;
  }
  while (n % C_FIVE === C_ZERO) {
    add(C_FIVE);
    n /= C_FIVE;
  }
  for (let si = 0, p = C_TWO + C_FIVE; p * p <= n; ) {
    while (n % p === C_ZERO) {
      add(p);
      n /= p;
    }
    p += FACTORSTEPS[si];
    si = si + 1 & 7;
  }
  if (n > C_ONE) add(n);
  return factors;
}
var parse = function(p1, p2) {
  let n = C_ZERO, d = C_ONE, s = C_ONE;
  if (p1 === void 0 || p1 === null) {
  } else if (p2 !== void 0) {
    if (typeof p1 === "bigint") {
      n = p1;
    } else if (isNaN(p1)) {
      throw InvalidParameter();
    } else if (p1 % 1 !== 0) {
      throw NonIntegerParameter();
    } else {
      n = BigInt(p1);
    }
    if (typeof p2 === "bigint") {
      d = p2;
    } else if (isNaN(p2)) {
      throw InvalidParameter();
    } else if (p2 % 1 !== 0) {
      throw NonIntegerParameter();
    } else {
      d = BigInt(p2);
    }
    s = n * d;
  } else if (typeof p1 === "object") {
    if ("d" in p1 && "n" in p1) {
      n = BigInt(p1["n"]);
      d = BigInt(p1["d"]);
      if ("s" in p1)
        n *= BigInt(p1["s"]);
    } else if (0 in p1) {
      n = BigInt(p1[0]);
      if (1 in p1)
        d = BigInt(p1[1]);
    } else if (typeof p1 === "bigint") {
      n = p1;
    } else {
      throw InvalidParameter();
    }
    s = n * d;
  } else if (typeof p1 === "number") {
    if (isNaN(p1)) {
      throw InvalidParameter();
    }
    if (p1 < 0) {
      s = -C_ONE;
      p1 = -p1;
    }
    if (p1 % 1 === 0) {
      n = BigInt(p1);
    } else {
      let z = 1;
      let A = 0, B = 1;
      let C = 1, D = 1;
      let N = 1e7;
      if (p1 >= 1) {
        z = 10 ** Math.floor(1 + Math.log10(p1));
        p1 /= z;
      }
      while (B <= N && D <= N) {
        let M = (A + C) / (B + D);
        if (p1 === M) {
          if (B + D <= N) {
            n = A + C;
            d = B + D;
          } else if (D > B) {
            n = C;
            d = D;
          } else {
            n = A;
            d = B;
          }
          break;
        } else {
          if (p1 > M) {
            A += C;
            B += D;
          } else {
            C += A;
            D += B;
          }
          if (B > N) {
            n = C;
            d = D;
          } else {
            n = A;
            d = B;
          }
        }
      }
      n = BigInt(n) * BigInt(z);
      d = BigInt(d);
    }
  } else if (typeof p1 === "string") {
    let ndx = 0;
    let v = C_ZERO, w = C_ZERO, x = C_ZERO, y = C_ONE, z = C_ONE;
    let match = p1.replace(/_/g, "").match(/\d+|./g);
    if (match === null)
      throw InvalidParameter();
    if (match[ndx] === "-") {
      s = -C_ONE;
      ndx++;
    } else if (match[ndx] === "+") {
      ndx++;
    }
    if (match.length === ndx + 1) {
      w = assign(match[ndx++], s);
    } else if (match[ndx + 1] === "." || match[ndx] === ".") {
      if (match[ndx] !== ".") {
        v = assign(match[ndx++], s);
      }
      ndx++;
      if (ndx + 1 === match.length || match[ndx + 1] === "(" && match[ndx + 3] === ")" || match[ndx + 1] === "'" && match[ndx + 3] === "'") {
        w = assign(match[ndx], s);
        y = C_TEN ** BigInt(match[ndx].length);
        ndx++;
      }
      if (match[ndx] === "(" && match[ndx + 2] === ")" || match[ndx] === "'" && match[ndx + 2] === "'") {
        x = assign(match[ndx + 1], s);
        z = C_TEN ** BigInt(match[ndx + 1].length) - C_ONE;
        ndx += 3;
      }
    } else if (match[ndx + 1] === "/" || match[ndx + 1] === ":") {
      w = assign(match[ndx], s);
      y = assign(match[ndx + 2], C_ONE);
      ndx += 3;
    } else if (match[ndx + 3] === "/" && match[ndx + 1] === " ") {
      v = assign(match[ndx], s);
      w = assign(match[ndx + 2], s);
      y = assign(match[ndx + 4], C_ONE);
      ndx += 5;
    }
    if (match.length <= ndx) {
      d = y * z;
      s = /* void */
      n = x + d * v + z * w;
    } else {
      throw InvalidParameter();
    }
  } else if (typeof p1 === "bigint") {
    n = p1;
    s = p1;
    d = C_ONE;
  } else {
    throw InvalidParameter();
  }
  if (d === C_ZERO) {
    throw DivisionByZero();
  }
  P["s"] = s < C_ZERO ? -C_ONE : C_ONE;
  P["n"] = n < C_ZERO ? -n : n;
  P["d"] = d < C_ZERO ? -d : d;
};
function modpow(b, e, m) {
  let r = C_ONE;
  for (; e > C_ZERO; b = b * b % m, e >>= C_ONE) {
    if (e & C_ONE) {
      r = r * b % m;
    }
  }
  return r;
}
function cycleLen(n, d) {
  for (; d % C_TWO === C_ZERO; d /= C_TWO) {
  }
  for (; d % C_FIVE === C_ZERO; d /= C_FIVE) {
  }
  if (d === C_ONE)
    return C_ZERO;
  let rem = C_TEN % d;
  let t = 1;
  for (; rem !== C_ONE; t++) {
    rem = rem * C_TEN % d;
    if (t > MAX_CYCLE_LEN)
      return C_ZERO;
  }
  return BigInt(t);
}
function cycleStart(n, d, len) {
  let rem1 = C_ONE;
  let rem2 = modpow(C_TEN, len, d);
  for (let t = 0; t < 300; t++) {
    if (rem1 === rem2)
      return BigInt(t);
    rem1 = rem1 * C_TEN % d;
    rem2 = rem2 * C_TEN % d;
  }
  return 0;
}
function gcd(a, b) {
  if (!a)
    return b;
  if (!b)
    return a;
  while (1) {
    a %= b;
    if (!a)
      return b;
    b %= a;
    if (!b)
      return a;
  }
}
function Fraction(a, b) {
  parse(a, b);
  if (this instanceof Fraction) {
    a = gcd(P["d"], P["n"]);
    this["s"] = P["s"];
    this["n"] = P["n"] / a;
    this["d"] = P["d"] / a;
  } else {
    return newFraction(P["s"] * P["n"], P["d"]);
  }
}
var DivisionByZero = function() {
  return new Error("Division by Zero");
};
var InvalidParameter = function() {
  return new Error("Invalid argument");
};
var NonIntegerParameter = function() {
  return new Error("Parameters must be integer");
};
Fraction.prototype = {
  "s": C_ONE,
  "n": C_ZERO,
  "d": C_ONE,
  /**
   * Calculates the absolute value
   *
   * Ex: new Fraction(-4).abs() => 4
   **/
  "abs": function() {
    return newFraction(this["n"], this["d"]);
  },
  /**
   * Inverts the sign of the current fraction
   *
   * Ex: new Fraction(-4).neg() => 4
   **/
  "neg": function() {
    return newFraction(-this["s"] * this["n"], this["d"]);
  },
  /**
   * Adds two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => 467 / 30
   **/
  "add": function(a, b) {
    parse(a, b);
    return newFraction(
      this["s"] * this["n"] * P["d"] + P["s"] * this["d"] * P["n"],
      this["d"] * P["d"]
    );
  },
  /**
   * Subtracts two rational numbers
   *
   * Ex: new Fraction({n: 2, d: 3}).add("14.9") => -427 / 30
   **/
  "sub": function(a, b) {
    parse(a, b);
    return newFraction(
      this["s"] * this["n"] * P["d"] - P["s"] * this["d"] * P["n"],
      this["d"] * P["d"]
    );
  },
  /**
   * Multiplies two rational numbers
   *
   * Ex: new Fraction("-17.(345)").mul(3) => 5776 / 111
   **/
  "mul": function(a, b) {
    parse(a, b);
    return newFraction(
      this["s"] * P["s"] * this["n"] * P["n"],
      this["d"] * P["d"]
    );
  },
  /**
   * Divides two rational numbers
   *
   * Ex: new Fraction("-17.(345)").inverse().div(3)
   **/
  "div": function(a, b) {
    parse(a, b);
    return newFraction(
      this["s"] * P["s"] * this["n"] * P["d"],
      this["d"] * P["n"]
    );
  },
  /**
   * Clones the actual object
   *
   * Ex: new Fraction("-17.(345)").clone()
   **/
  "clone": function() {
    return newFraction(this["s"] * this["n"], this["d"]);
  },
  /**
   * Calculates the modulo of two rational numbers - a more precise fmod
   *
   * Ex: new Fraction('4.(3)').mod([7, 8]) => (13/3) % (7/8) = (5/6)
   * Ex: new Fraction(20, 10).mod().equals(0) ? "is Integer"
   **/
  "mod": function(a, b) {
    if (a === void 0) {
      return newFraction(this["s"] * this["n"] % this["d"], C_ONE);
    }
    parse(a, b);
    if (C_ZERO === P["n"] * this["d"]) {
      throw DivisionByZero();
    }
    return newFraction(
      this["s"] * (P["d"] * this["n"]) % (P["n"] * this["d"]),
      P["d"] * this["d"]
    );
  },
  /**
   * Calculates the fractional gcd of two rational numbers
   *
   * Ex: new Fraction(5,8).gcd(3,7) => 1/56
   */
  "gcd": function(a, b) {
    parse(a, b);
    return newFraction(gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]), P["d"] * this["d"]);
  },
  /**
   * Calculates the fractional lcm of two rational numbers
   *
   * Ex: new Fraction(5,8).lcm(3,7) => 15
   */
  "lcm": function(a, b) {
    parse(a, b);
    if (P["n"] === C_ZERO && this["n"] === C_ZERO) {
      return newFraction(C_ZERO, C_ONE);
    }
    return newFraction(P["n"] * this["n"], gcd(P["n"], this["n"]) * gcd(P["d"], this["d"]));
  },
  /**
   * Gets the inverse of the fraction, means numerator and denominator are exchanged
   *
   * Ex: new Fraction([-3, 4]).inverse() => -4 / 3
   **/
  "inverse": function() {
    return newFraction(this["s"] * this["d"], this["n"]);
  },
  /**
   * Calculates the fraction to some integer exponent
   *
   * Ex: new Fraction(-1,2).pow(-3) => -8
   */
  "pow": function(a, b) {
    parse(a, b);
    if (P["d"] === C_ONE) {
      if (P["s"] < C_ZERO) {
        return newFraction((this["s"] * this["d"]) ** P["n"], this["n"] ** P["n"]);
      } else {
        return newFraction((this["s"] * this["n"]) ** P["n"], this["d"] ** P["n"]);
      }
    }
    if (this["s"] < C_ZERO) return null;
    let N = factorize(this["n"]);
    let D = factorize(this["d"]);
    let n = C_ONE;
    let d = C_ONE;
    for (let k in N) {
      if (k === "1") continue;
      if (k === "0") {
        n = C_ZERO;
        break;
      }
      N[k] *= P["n"];
      if (N[k] % P["d"] === C_ZERO) {
        N[k] /= P["d"];
      } else return null;
      n *= BigInt(k) ** N[k];
    }
    for (let k in D) {
      if (k === "1") continue;
      D[k] *= P["n"];
      if (D[k] % P["d"] === C_ZERO) {
        D[k] /= P["d"];
      } else return null;
      d *= BigInt(k) ** D[k];
    }
    if (P["s"] < C_ZERO) {
      return newFraction(d, n);
    }
    return newFraction(n, d);
  },
  /**
   * Calculates the logarithm of a fraction to a given rational base
   *
   * Ex: new Fraction(27, 8).log(9, 4) => 3/2
   */
  "log": function(a, b) {
    parse(a, b);
    if (this["s"] <= C_ZERO || P["s"] <= C_ZERO) return null;
    const allPrimes = /* @__PURE__ */ Object.create(null);
    const baseFactors = factorize(P["n"]);
    const T1 = factorize(P["d"]);
    const numberFactors = factorize(this["n"]);
    const T2 = factorize(this["d"]);
    for (const prime in T1) {
      baseFactors[prime] = (baseFactors[prime] || C_ZERO) - T1[prime];
    }
    for (const prime in T2) {
      numberFactors[prime] = (numberFactors[prime] || C_ZERO) - T2[prime];
    }
    for (const prime in baseFactors) {
      if (prime === "1") continue;
      allPrimes[prime] = true;
    }
    for (const prime in numberFactors) {
      if (prime === "1") continue;
      allPrimes[prime] = true;
    }
    let retN = null;
    let retD = null;
    for (const prime in allPrimes) {
      const baseExponent = baseFactors[prime] || C_ZERO;
      const numberExponent = numberFactors[prime] || C_ZERO;
      if (baseExponent === C_ZERO) {
        if (numberExponent !== C_ZERO) {
          return null;
        }
        continue;
      }
      let curN = numberExponent;
      let curD = baseExponent;
      const gcdValue = gcd(curN, curD);
      curN /= gcdValue;
      curD /= gcdValue;
      if (retN === null && retD === null) {
        retN = curN;
        retD = curD;
      } else if (curN * retD !== retN * curD) {
        return null;
      }
    }
    return retN !== null && retD !== null ? newFraction(retN, retD) : null;
  },
  /**
   * Check if two rational numbers are the same
   *
   * Ex: new Fraction(19.6).equals([98, 5]);
   **/
  "equals": function(a, b) {
    parse(a, b);
    return this["s"] * this["n"] * P["d"] === P["s"] * P["n"] * this["d"];
  },
  /**
   * Check if this rational number is less than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "lt": function(a, b) {
    parse(a, b);
    return this["s"] * this["n"] * P["d"] < P["s"] * P["n"] * this["d"];
  },
  /**
   * Check if this rational number is less than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "lte": function(a, b) {
    parse(a, b);
    return this["s"] * this["n"] * P["d"] <= P["s"] * P["n"] * this["d"];
  },
  /**
   * Check if this rational number is greater than another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "gt": function(a, b) {
    parse(a, b);
    return this["s"] * this["n"] * P["d"] > P["s"] * P["n"] * this["d"];
  },
  /**
   * Check if this rational number is greater than or equal another
   *
   * Ex: new Fraction(19.6).lt([98, 5]);
   **/
  "gte": function(a, b) {
    parse(a, b);
    return this["s"] * this["n"] * P["d"] >= P["s"] * P["n"] * this["d"];
  },
  /**
   * Compare two rational numbers
   * < 0 iff this < that
   * > 0 iff this > that
   * = 0 iff this = that
   *
   * Ex: new Fraction(19.6).compare([98, 5]);
   **/
  "compare": function(a, b) {
    parse(a, b);
    let t = this["s"] * this["n"] * P["d"] - P["s"] * P["n"] * this["d"];
    return (C_ZERO < t) - (t < C_ZERO);
  },
  /**
   * Calculates the ceil of a rational number
   *
   * Ex: new Fraction('4.(3)').ceil() => (5 / 1)
   **/
  "ceil": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      ifloor(this["s"] * places * this["n"] / this["d"]) + (places * this["n"] % this["d"] > C_ZERO && this["s"] >= C_ZERO ? C_ONE : C_ZERO),
      places
    );
  },
  /**
   * Calculates the floor of a rational number
   *
   * Ex: new Fraction('4.(3)').floor() => (4 / 1)
   **/
  "floor": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      ifloor(this["s"] * places * this["n"] / this["d"]) - (places * this["n"] % this["d"] > C_ZERO && this["s"] < C_ZERO ? C_ONE : C_ZERO),
      places
    );
  },
  /**
   * Rounds a rational numbers
   *
   * Ex: new Fraction('4.(3)').round() => (4 / 1)
   **/
  "round": function(places) {
    places = C_TEN ** BigInt(places || 0);
    return newFraction(
      ifloor(this["s"] * places * this["n"] / this["d"]) + this["s"] * ((this["s"] >= C_ZERO ? C_ONE : C_ZERO) + C_TWO * (places * this["n"] % this["d"]) > this["d"] ? C_ONE : C_ZERO),
      places
    );
  },
  /**
    * Rounds a rational number to a multiple of another rational number
    *
    * Ex: new Fraction('0.9').roundTo("1/8") => 7 / 8
    **/
  "roundTo": function(a, b) {
    parse(a, b);
    const n = this["n"] * P["d"];
    const d = this["d"] * P["n"];
    const r = n % d;
    let k = ifloor(n / d);
    if (r + r >= d) {
      k++;
    }
    return newFraction(this["s"] * k * P["n"], P["d"]);
  },
  /**
   * Check if two rational numbers are divisible
   *
   * Ex: new Fraction(19.6).divisible(1.5);
   */
  "divisible": function(a, b) {
    parse(a, b);
    if (P["n"] === C_ZERO) return false;
    return this["n"] * P["d"] % (P["n"] * this["d"]) === C_ZERO;
  },
  /**
   * Returns a decimal representation of the fraction
   *
   * Ex: new Fraction("100.'91823'").valueOf() => 100.91823918239183
   **/
  "valueOf": function() {
    return Number(this["s"] * this["n"]) / Number(this["d"]);
  },
  /**
   * Creates a string representation of a fraction with all digits
   *
   * Ex: new Fraction("100.'91823'").toString() => "100.(91823)"
   **/
  "toString": function(dec = 15) {
    let N = this["n"];
    let D = this["d"];
    let cycLen = cycleLen(N, D);
    let cycOff = cycleStart(N, D, cycLen);
    let str = this["s"] < C_ZERO ? "-" : "";
    str += ifloor(N / D);
    N %= D;
    N *= C_TEN;
    if (N)
      str += ".";
    if (cycLen) {
      for (let i = cycOff; i--; ) {
        str += ifloor(N / D);
        N %= D;
        N *= C_TEN;
      }
      str += "(";
      for (let i = cycLen; i--; ) {
        str += ifloor(N / D);
        N %= D;
        N *= C_TEN;
      }
      str += ")";
    } else {
      for (let i = dec; N && i--; ) {
        str += ifloor(N / D);
        N %= D;
        N *= C_TEN;
      }
    }
    return str;
  },
  /**
   * Returns a string-fraction representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toFraction() => "4 1/3"
   **/
  "toFraction": function(showMixed = false) {
    let n = this["n"];
    let d = this["d"];
    let str = this["s"] < C_ZERO ? "-" : "";
    if (d === C_ONE) {
      str += n;
    } else {
      const whole = ifloor(n / d);
      if (showMixed && whole > C_ZERO) {
        str += whole;
        str += " ";
        n %= d;
      }
      str += n;
      str += "/";
      str += d;
    }
    return str;
  },
  /**
   * Returns a latex representation of a Fraction object
   *
   * Ex: new Fraction("1.'3'").toLatex() => "\frac{4}{3}"
   **/
  "toLatex": function(showMixed = false) {
    let n = this["n"];
    let d = this["d"];
    let str = this["s"] < C_ZERO ? "-" : "";
    if (d === C_ONE) {
      str += n;
    } else {
      const whole = ifloor(n / d);
      if (showMixed && whole > C_ZERO) {
        str += whole;
        n %= d;
      }
      str += "\\frac{";
      str += n;
      str += "}{";
      str += d;
      str += "}";
    }
    return str;
  },
  /**
   * Returns an array of continued fraction elements
   *
   * Ex: new Fraction("7/8").toContinued() => [0,1,7]
   */
  "toContinued": function() {
    let a = this["n"];
    let b = this["d"];
    const res = [];
    while (b) {
      res.push(ifloor(a / b));
      const t = a % b;
      a = b;
      b = t;
    }
    return res;
  },
  "simplify": function(eps = 1e-3) {
    const ieps = BigInt(Math.ceil(1 / eps));
    const thisABS = this["abs"]();
    const cont = thisABS["toContinued"]();
    for (let i = 1; i < cont.length; i++) {
      let s = newFraction(cont[i - 1], C_ONE);
      for (let k = i - 2; k >= 0; k--) {
        s = s["inverse"]()["add"](cont[k]);
      }
      let t = s["sub"](thisABS);
      if (t["n"] * ieps < t["d"]) {
        return s["mul"](this["s"]);
      }
    }
    return this;
  }
};

// src/pyon/fraction.ts
var fromMachine6 = (params) => {
  params = params;
  if (params.length === 2) {
    return new Fraction(params[0], params[1]);
  }
  return new Fraction(params[0]);
};
var toMachine6 = (data) => {
  let f = data;
  return [Number(f.s * f.n), Number(f.d)];
};
var fromHuman6 = fromMachine6;
var toHuman6 = toMachine6;
var forPreview6 = (data) => data.toFraction();
var copy6 = (src) => new Fraction(src);

// src/pyon/bytes.ts
var bytes_exports = {};
__export(bytes_exports, {
  copy: () => copy7,
  forPreview: () => forPreview7,
  fromHuman: () => fromHuman7,
  fromMachine: () => fromMachine7,
  toHuman: () => toHuman7,
  toMachine: () => toMachine7
});
var fromMachine7 = ([base64]) => bytesFrom(base64);
var toMachine7 = (data) => [base64From(data)];
var fromHuman7 = fromMachine7;
var toHuman7 = toMachine7;
var forPreview7 = (data) => Array.from(data).map((b) => b.toString(16));
var copy7 = (src) => src.slice();

// src/pyon/slice.ts
var slice_exports = {};
__export(slice_exports, {
  copy: () => copy8,
  forPreview: () => forPreview8,
  fromHuman: () => fromHuman8,
  fromMachine: () => fromMachine8,
  toHuman: () => toHuman8,
  toMachine: () => toMachine8
});
var fromMachine8 = (params) => params;
var toMachine8 = (data) => data;
var fromHuman8 = fromMachine8;
var toHuman8 = toMachine8;
var forPreview8 = (data) => data;
var copy8 = (src) => [...src];

// src/pyon/complex.ts
var complex_exports = {};
__export(complex_exports, {
  copy: () => copy9,
  forPreview: () => forPreview9,
  fromHuman: () => fromHuman9,
  fromMachine: () => fromMachine9,
  toHuman: () => toHuman9,
  toMachine: () => toMachine9
});
var fromMachine9 = (params) => new Float64Array(params);
var toMachine9 = (data) => [...data];
var fromHuman9 = fromMachine9;
var toHuman9 = toMachine9;
var forPreview9 = (data) => {
  let sign = data[1] < 0 ? "-" : "+";
  return `${data[0]} ${sign} ${Math.abs(data[1])}j`;
};
var copy9 = (src) => src.slice();

// src/pyon/pyon.ts
var marker = "__jsonclass__";
var isMarked = (v) => v && typeof v === "object" && marker in v;
var isHintedJsonClass = (v) => isMarked(v) && Object.keys(v).length === 1 && Array.isArray(v[marker]) && v[marker].length === 2 && typeof v[marker][0] === "string" && Array.isArray(v[marker][1]);
var identityConv = (v) => v;
var identityType = {
  fromMachine: identityConv,
  toMachine: identityConv,
  fromHuman: identityConv,
  toHuman: identityConv,
  forPreview: identityConv,
  copy: (v) => [...v]
};
var types = { set: set_exports, dict: dict_exports, tuple: tuple_exports, nparray: nparray_exports, Fraction: fraction_exports, bytes: bytes_exports, slice: slice_exports, npscalar: npscalar_exports, complex: complex_exports };
var conv = (t, c) => {
  let type = types[t];
  if (!type) {
    console.error(`PYON type not yet implemented: ${t}`);
    return identityType[c];
  }
  return type[c];
};
var toTagged = (v, convname) => {
  let [typename, params] = v[marker];
  let reviver = conv(typename, convname);
  let revived = reviver(params);
  revived[marker] = typename;
  return revived;
};
var decode = (hinted) => JSON.parse(hinted, (k, v) => {
  if (!isHintedJsonClass(v)) {
    return v;
  }
  return toTagged(v, "fromMachine");
});

// src/webviews/schedule.ts
var vscode = acquireVsCodeApi();
var rows = [];
var rpc = (method, rid) => vscode.postMessage({
  action: "rpc",
  data: { method, rid }
});
var table = new Tabulator$1(".table", {
  layout: "fitDataFill",
  columns: [
    { title: "RID", field: "rid" },
    { title: "Pipeline", field: "pipeline" },
    { title: "Status", field: "status" },
    { title: "Prio", field: "priority" },
    { title: "Due date", field: "due_date" },
    { title: "Revision", field: "expid.repo_rev", formatter: (cell) => cell.getValue() ?? "w/o repo" },
    { title: "File", field: "expid.file" },
    { title: "Class name", field: "expid.class_name" }
  ],
  rowContextMenu: [
    {
      label: "Request termination",
      action: (ev, row) => rpc("request_termination", row.getData().rid)
    },
    {
      label: "Delete",
      action: (ev, row) => rpc("delete", row.getData().rid)
    },
    {
      label: "Gracefully terminate all in pipeline",
      action: (ev, row) => rows.filter((r) => r.pipeline === row.getData().pipeline).forEach((r) => rpc("request_termination", r.rid))
    }
  ]
});
window.addEventListener("message", (ev) => {
  rows = [...decode(ev.data).entries()].map(([rid, syncinfo]) => ({ rid, ...syncinfo }));
  table.replaceData(rows);
});
//# sourceMappingURL=schedule.js.map
