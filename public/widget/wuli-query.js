// public/JS/Mainfunctions/DOMregistry.js
var widgetContent = {};
function getDOMregistry() {
  return widgetContent;
}

// public/JS/Mainfunctions/pageDataset.js
function setPageDataset() {
  const path = window.location.pathname;
  const pathSegments = path.split("/").filter(Boolean);
  if (pathSegments.includes("embed")) {
    document.body.dataset.page = "embed";
    return;
  }
  document.body.dataset.page = "demo";
  if (path.startsWith("/guide") || path.startsWith("/introduction") || path.startsWith("/reference") || path.startsWith("/purpose")) {
    document.body.dataset.page = "guide";
  }
  if (path.startsWith("/apiPipeline")) {
    document.body.dataset.page = "apiPipeline";
  }
}

// public/JS/UI/renderArchitecture.js
var container_guideComponent = document.getElementById("guideTextBlock");

// public/JS/wuli-ui/QueryBox/QueryInput.js
var QueryInput = class {
  constructor({
    inputElement,
    readQueryState
  }) {
    this.el = inputElement;
    this.lastKey = null;
    this.onChange = () => {
    };
    this.onArrowDown = () => {
    };
    this.onArrowUp = () => {
    };
    this.onEnter = () => {
    };
    this.onEscape = () => {
    };
    this.onFocus = () => {
    };
    this.onBlur = () => {
    };
    this.setupInputScrollSync = () => {
    };
    this.onCaretChanged = () => {
    };
    this.refreshQueryResult = () => {
    };
    this.#bind();
  }
  #bind() {
    this.el.addEventListener("scroll", () => {
      this.setupInputScrollSync();
    });
    this.el.addEventListener("click", () => {
      this.onCaretChanged(
        this.el.selectionStart
      );
    });
    this.el.addEventListener("keyup", () => {
      this.onCaretChanged(
        this.el.selectionStart
      );
    });
    this.el.addEventListener("input", () => {
      this.onCaretChanged(
        this.el.selectionStart
      );
      this.onChange(this.value);
    });
    this.el.addEventListener("focus", () => {
      this.onFocus();
    });
    this.el.addEventListener("blur", () => {
      setTimeout(() => this.onBlur(), 150);
    });
    this.el.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          this.onArrowDown();
          break;
        case "ArrowUp":
          e.preventDefault();
          this.onArrowUp();
          break;
        case "Enter":
          this.onEnter();
          break;
        case "Escape":
          this.lastKey = "escape";
          this.onEscape();
          break;
        case "Backspace":
          this.lastKey = "backspace";
          break;
        case "Delete":
          this.lastKey = "delete";
          break;
        case " ":
          this.lastKey = "space";
          break;
        default:
          this.lastKey = "insert";
          break;
      }
    });
  }
  consumeLastKey() {
    const key = this.lastKey;
    this.lastKey = null;
    return key;
  }
  get value() {
    return this.el.value;
  }
  //+v[he] +v[HE] +v[sh]
  getValue() {
    return this.el.value;
  }
  setValue(value) {
    this.el.value = value;
  }
  focus() {
    this.el.focus();
  }
  getCaret() {
    return this.el.selectionStart;
  }
  setCaret(position) {
    this.el.setSelectionRange(position, position);
  }
};

// public/JS/wuli-ui/QueryBox/QueryDropdown.js
var QueryDropdown = class {
  constructor(container) {
    this.el = container;
    this.items = [];
    this.selected = -1;
    this.data = {};
    this.queryBox;
    this.onSelect = () => {
    };
    this.nodeRefreshPipeline = () => {
    };
  }
  setItems(items, data) {
    this.data = data;
    this.items = items;
    this.selected = -1;
    this.render();
  }
  render() {
    switch (this.data.type) {
      case "queryExample":
        this.renderList();
        break;
      case "renderAvailableValue":
      case "renderProducersList":
      case "renderAvailableTrait":
        this.renderList();
        break;
      case "renderList_v2":
        this.renderList_v2();
        break;
    }
  }
  renderList_v2() {
    this.el.innerHTML = "";
    const node = this.data.node;
    const root = document.createElement("div");
    root.classList.add("pipelineNode");
    const header = document.createElement("div");
    header.classList.add("pipelineNodeHeader");
    const renderSpec = node.renderSpec || {};
    Object.entries(renderSpec).forEach(([key, spec]) => {
      const element = document.createElement("div");
      if (spec.cssClass) {
      }
      if (spec.cssClassList) {
        element.classList.add(...spec.cssClassList);
      }
      if (spec.textContent !== void 0) {
        element.textContent = spec.textContent;
      }
      header.appendChild(element);
    });
    root.appendChild(header);
    if (node.details && node.details.length) {
      const details = document.createElement("div");
      details.classList.add("pipelineNodeDetails");
      details.style.display = "none";
      node.details.forEach((item) => {
        const row = document.createElement("div");
        row.classList.add("pipelineNodeRow");
        const key = document.createElement("div");
        key.classList.add("pipelineNodeRowKey");
        key.textContent = item.key;
        const val = document.createElement("div");
        val.classList.add("pipelineNodeRowValue");
        val.textContent = item.value;
        row.appendChild(key);
        row.appendChild(val);
        details.appendChild(row);
      });
      this.headerOnClickDOM(details, node, root);
      header.classList.add("clickable");
      header.onclick = () => {
        this.headerOnClickDOM(details, node, root);
        this.nodeRefreshPipeline();
      };
      root.appendChild(details);
    }
    if (node.dataList) {
      const dataList = document.createElement("div");
      dataList.classList.add("pipelineNodeDetails");
      dataList.style.display = "none";
      this.dataRenderList(
        dataList,
        node.dataList,
        node
        //  this.onSelect = correction => {   
        //   this.queryBox.onSelect_traitType(correction, this.queryBox.input);
        //  } 
      );
      this.headerOnClickDOM(dataList, node, root);
      header.classList.add("clickable");
      header.onclick = () => {
        this.headerOnClickDOM(dataList, node, root);
        this.nodeRefreshPipeline();
      };
      root.appendChild(dataList);
    }
    if (node.generalCss) {
      node.generalCss.forEach((element) => {
        root.classList.add(element);
      });
    }
    this.el.appendChild(root);
    node.pipelineNode = root;
    this.#scrollSelectedIntoView();
  }
  headerOnClickDOM(details, node, root) {
    details.style.display = node.state.detailsOpen ? "block" : "none";
    if (node.state.detailsOpen) {
      root.classList.add("open");
    } else {
      root.classList.remove("open");
    }
  }
  setPosition(anchorData) {
    this.el.style.position = anchorData.position;
    this.el.style.left = anchorData.left;
    this.el.style.top = anchorData.top;
    this.el.style.right = anchorData.right;
  }
  getRect() {
    return this.el.getBoundingClientRect();
  }
  renderList() {
    this.el.innerHTML = "";
    if (this.data.anchor) {
      const rect = this.data.anchor.getBoundingClientRect();
      this.el.style.position = "fixed";
      this.el.style.left = rect.left + "px";
      this.el.style.top = rect.bottom + "px";
      this.el.style.right = "auto";
    }
    if (this.data.anchorData) {
      this.el.style.position = this.data.anchorData.position;
      this.el.style.left = this.data.anchorData.left;
      this.el.style.top = this.data.anchorData.top;
      this.el.style.right = this.data.anchorData.right;
    }
    this.dataRenderList(this.el, this.data.renderList, null);
    if (this.data.infoList) {
      this.renderInfo(this.data.infoList);
    }
    this.#scrollSelectedIntoView();
  }
  dataRenderList(container, dataList, node) {
    dataList.forEach((item, index) => {
      if (node) {
        if (node.token.type === "VALUE") {
          if (item.select.start !== node.token.start) return;
        }
      }
      const row = document.createElement("div");
      row.classList.add("pipelineNodeRow");
      const div = document.createElement("div");
      div.classList.add("pipelineNodeRowKey");
      const val = document.createElement("div");
      val.classList.add("pipelineNodeRowValue");
      val.textContent = item.val;
      if (index === this.selected) {
        div.classList.add("selected");
      }
      div.textContent = item.label;
      val.textContent = item.val;
      div.onclick = () => {
        if (node) {
          node.onSelect(item.select);
        } else {
          console.log("  this.onSelect  =  ", this.onSelect);
          this.onSelect(item.select);
        }
      };
      row.appendChild(div);
      row.appendChild(val);
      container.appendChild(row);
    });
  }
  renderQueryExamlpe() {
    this.el.innerHTML = "";
    this.items.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "queryItem";
      if (index === this.selected)
        div.classList.add("selected");
      div.textContent = item.raw;
      div.onclick = () => this.onSelect(item);
      this.el.appendChild(div);
    });
    this.#scrollSelectedIntoView();
  }
  renderInfo(infoList) {
    infoList.forEach((info) => {
      const row = document.createElement("div");
      row.className = "assistantInfo assistantInfo--" + info.type;
      row.textContent = info.text;
      this.el.appendChild(row);
    });
  }
  selectNext() {
    if (!this.items.length) return;
    this.selected = Math.min(
      this.selected + 1,
      this.items.length - 1
    );
    this.render();
  }
  selectPrevious() {
    if (!this.items.length) return;
    this.selected = Math.max(this.selected - 1, 0);
    this.render();
  }
  get selectedItem() {
    return this.items[this.selected];
  }
  show() {
    this.el.classList.add("visible");
  }
  hide() {
    this.el.classList.remove("visible");
  }
  get isOpen() {
    return this.el.classList.contains("visible");
  }
  #scrollSelectedIntoView() {
    const selected = this.el.querySelector(".selected");
    selected?.scrollIntoView({
      block: "nearest"
    });
  }
};

// public/JS/wuli-ui/QueryBox/QueryAssistant.js
var TOKEN = {
  //--------------------------------------------------
  // Lexer
  //--------------------------------------------------
  COMPLETE_PRODUCER: "COMPLETE_PRODUCER",
  PARTIAL_PRODUCER: "PARTIAL_PRODUCER",
  //--------------------------------------------------
  // Grammar
  //--------------------------------------------------
  TRAIT: "TRAIT",
  VALUE: "VALUE",
  SEPARATOR: "SEPARATOR",
  //--------------------------------------------------
  // Future
  //--------------------------------------------------
  MODIFIER: "MODIFIER",
  OPEN_BRACKET: "OPEN_BRACKET",
  CLOSE_BRACKET: "CLOSE_BRACKET",
  //--------------------------------------------------
  // Generic
  //--------------------------------------------------
  SPACE: "SPACE",
  UNKNOWN: "UNKNOWN",
  EOF: "EOF"
};
var QueryAssistant = class {
  /*
      constructor(container){
   
          this.container = container;
  
          this.onErrorClicked = null
          this.onCorrection = null;
    
   
          this.container.addEventListener("click", (e) => {
          const node = e.target.closest(".assistantPreview");
  
          if (!node) return;
           
             this.onErrorClicked({
                block: this.blocks[Number(node.dataset.blockId)],
                anchor: node
             });
  
         });
   
          
      }
    */
  constructor(container) {
    this.root = container;
    this.container = document.createElement("div");
    this.container.className = "queryAssistantContent";
    this.container.id = "queryAssistantContent";
    this.root.innerHTML = "";
    this.root.appendChild(this.container);
    this.onErrorClicked = null;
    this.onCorrection = null;
    this.container.addEventListener("click", (e) => {
      const node = e.target.closest(".assistantPreview");
      if (!node) return;
      const blockId = Number(node.dataset.blockId);
      const block = this.blocks.find((b) => b.blockId === blockId);
      if (!block) return;
      if (this.onErrorClicked) {
        this.onErrorClicked({ block, anchor: node });
      }
    });
  }
  show(queryResult) {
    if (!queryResult.blocks) {
      return;
    }
    let valid = true;
    this.renderBlocks(queryResult.blocks);
    console.log("================================== ");
  }
  hide() {
    this.container.innerHTML = "";
    this.container.classList.remove("visible");
  }
  renderBlocks(blocks) {
    this.blocks = blocks;
    this.container.innerHTML = "";
    blocks.forEach((block) => {
      this.container.appendChild(
        this.renderBlock(block)
      );
    });
  }
  renderBlock(block) {
    const div = document.createElement("div");
    div.className = "assistantError";
    div.innerHTML = `<div class="assistantPreview" data-block-id="${block.blockId}">${this.formatBlock(block)}</div>`;
    return div;
  }
  //+v[      HEAD    :[  Wolf ,   red    ]]-v[HEAD:[re]] e
  formatBlock(block) {
    let html = "";
    if (!block.tokens) return "";
    for (const token of block.tokens) {
      let cssClass = "";
      switch (token.type) {
        //--------------------------------------------------
        // Producer
        //--------------------------------------------------
        case TOKEN.COMPLETE_PRODUCER:
        case TOKEN.PARTIAL_PRODUCER:
          cssClass = "producerToken";
          break;
        //--------------------------------------------------
        // Trait
        //--------------------------------------------------
        case TOKEN.TRAIT:
          cssClass = block.valid ? "traitValid" : "traitError";
          break;
        //--------------------------------------------------
        // Value
        //--------------------------------------------------
        case TOKEN.VALUE:
          cssClass = token.valid ? "traitValue" : "traitValueError";
          break;
        //--------------------------------------------------
        // Raw / spaces / punctuation
        //--------------------------------------------------
        case TOKEN.RAW:
          html += token.raw;
          continue;
        //--------------------------------------------------
        // Unknown future token
        //--------------------------------------------------
        default:
          html += token.raw;
          continue;
      }
      html += `<span class="${cssClass}"data-block-id="${block.blockId}"data-token-id="${token.id}"><span class="pipelineAnchor"></span>${token.raw}</span>`;
    }
    return html;
  }
  getProducerAnchor(blockId) {
    return this.container.querySelector(
      `.producerToken[data-block-id="${blockId}"]`
    );
  }
  getTraitAnchor(blockId) {
    return this.container.querySelector(
      `.traitValid[data-block-id="${blockId}"],
         .traitError[data-block-id="${blockId}"]`
    );
  }
  getValueAnchor(blockId) {
    return this.container.querySelector(
      `.traitValue[data-block-id="${blockId}"]`
    );
  }
  // traitValue
  /*
  getAnchor(blockId, cssClass){
  
      return this.container.querySelector(
  
          `.${cssClass}[data-block-id="${blockId}"]`
  
      );
  }
  */
  getAnchorBytokenID(blockId, tokenId, cssClass) {
    const token = this.container.querySelector(`.${cssClass}[data-block-id="${blockId}"][data-token-id="${tokenId}"]`);
    if (!token) return null;
    return token;
  }
  getAnchor(blockId, cssClass) {
    const token = this.container.querySelector(`.${cssClass}[data-block-id="${blockId}"]`);
    if (!token) return null;
    return token;
  }
  renderTraitSuggestions() {
  }
  renderValueSuggestions() {
  }
  renderWarnings() {
  }
  renderStatistics() {
  }
};

// public/JS/wuli-ui/dataRepresentation/tokenDataToNode.js
function getRenderList_traitSuggestion(block) {
  let renderList = [];
  block.corrections.forEach((item, index) => {
    renderList.push({
      label: item.label,
      val: item.val,
      select: {
        traitSelected: item.label,
        traitStart: block.traitStart,
        traitEnd: block.traitEnd
      }
    });
  });
  return renderList;
}
function getRenderList_valueEvaluation(block) {
  return getRenderList_valueList_core(block.valueEvaluation);
}
function getRenderList_valueList_core(valueList) {
  let renderList = [];
  if (!valueList) {
    return renderList = [];
  }
  valueList.forEach((item, index) => {
    for (let idx = 0; idx < item.matches.length; idx++) {
      const element = item.matches[idx];
      renderList.push({
        //label:  element,
        label: element.label,
        val: element.val,
        select: {
          traitValueSelected: element,
          start: item.start,
          end: item.end
        }
      });
    }
  });
  return renderList;
}

// public/JS/wuli-ui/QueryBox/QueryBox.js
var QueryBox = class {
  constructor(container, store, refreshQueryResult) {
    this.queryState = {
      rawQuery: "",
      queryResult: null
    };
    this.container = container;
    this.nodeGraph;
    this.collection;
    this.layoutOptions;
    this.store = store;
    this.refreshQueryResult = refreshQueryResult;
    this.nodeGraphScroll = document.getElementById("nodeGraphScroll");
    this.queryCaret = container.querySelector(".queryCaret");
    this.caretBar = this.queryCaret.querySelector(".caretBar");
    this.queryCaretText = this.queryCaret.querySelector(".queryCaretText");
    this.input = new QueryInput(
      {
        inputElement: container.querySelector(".queryInput"),
        readQueryState: () => this.queryState
      }
    );
    this.dropdown = new QueryDropdown(
      container.querySelector(".queryDropdown")
    );
    this.correctionDropdown = new QueryDropdown(
      document.getElementById("correctionAssistant")
    );
    this.assistant = new QueryAssistant(
      container.querySelector(".queryAssistant")
      //    queryDropdown
    );
    document.addEventListener("pointerdown", (e) => {
      if (this.container.contains(e.target))
        return;
      this.dropdown.hide();
      this.correctionDropdown.hide();
    });
    this.#bind();
  }
  getRenderList_producer() {
    let renderList = [];
    const producersList = ["+v", "++v", "-v"];
    producersList.forEach((item) => {
      renderList.push({ label: item, select: item });
    });
    return renderList;
  }
  getRenderList_tokens(token) {
    let renderList = [];
    const displayKey = ["type", "normalized", "start", "end"];
    Object.entries(token).forEach(([key, val]) => {
      if (displayKey.indexOf(key) === -1) {
        return;
      }
      let edited_val = val;
      if (String(val).startsWith("COMPLETE_")) {
        edited_val = val.replace("COMPLETE_", "");
      }
      renderList.push({
        label: key + ":" + edited_val,
        select: {
          // traitValueSelected:  element, 
          // start: item.start,
          //  end: item.end
        }
      });
    });
    return renderList;
  }
  tokenTypeToClass(tokenType, blockId, tokenId) {
    switch (tokenType) {
      case "COMPLETE_PRODUCER":
        return "producerToken";
      case "TRAIT":
        const traitValid = this.container.querySelector(
          `.traitValid[data-block-id="${blockId}"][data-token-id="${tokenId}"]`
        );
        return traitValid ? "traitValid" : "traitError";
      case "VALUE":
        const traitValueValid = this.container.querySelector(`.traitValue[data-block-id="${blockId}"][data-token-id="${tokenId}"]`);
        return traitValueValid ? "traitValue" : "traitValueError";
      default:
        break;
    }
  }
  buildPipelineNodes(token, block, dropdownArg, getRenderList, nodeContainer, nodeGraphScroll) {
    const cssClass = this.tokenTypeToClass(token.type, block.blockId, token.id);
    const anchor = this.assistant.getAnchorBytokenID(block.blockId, token.id, cssClass);
    if (!anchor) {
      console.log(
        " anchor is null == node will return null",
        { blockId: block.blockId, id: token.id, cssClass }
      );
      return null;
    }
    let anchorData = {};
    let anchor_left;
    let anchor_top;
    let queryRect;
    if (anchor) {
      queryRect = anchor.getBoundingClientRect();
      anchor_left = queryRect.left;
      anchor_top = queryRect.bottom;
    }
    dropdownArg.show();
    const dropRect = dropdownArg.getRect();
    const graphRect = nodeGraphScroll.getBoundingClientRect();
    const anchorX = queryRect.left + queryRect.width / 2 - graphRect.left + nodeGraphScroll.scrollLeft;
    return {
      token,
      el: dropdownArg.el,
      instance: dropdownArg,
      anchor,
      anchorPos: {
        // x:  queryRect.left    + queryRect.width/2 -  graphRect.left, 
        x: anchorX,
        y: queryRect.bottom - graphRect.top
      },
      x: 0,
      // will be written in layoutNode()
      y: 0,
      // will be written in layoutNode()
      width: dropRect.width,
      height: dropRect.height,
      level: 0,
      desiredX: 0
    };
  }
  showProducerOption(block) {
    let renderList = this.getRenderList_producer();
    this.correctionDropdown.onSelect = (selectedItem) => {
      this.onSelect_ProducterOption(selectedItem);
    };
    const anchor = this.assistant.getProducerAnchor(block.blockId);
    if (!anchor) {
      console.log("showProducerOption   anchor is null ");
      return null;
    }
    this.correctionDropdown.setItems(null, {
      anchor,
      type: "renderProducersList",
      renderList,
      //: producersList,
      infoList: null
      //block.infoList,
    });
    this.correctionDropdown.show();
    return { anchor };
  }
  //========================================================================================================
  //                              show traits Value
  //======================================================================================================== 
  showTraitValues(block) {
    console.log("  ==============    showTraitValues  block.blockId: ");
    const anchor = this.assistant.getValueAnchor(block.blockId);
    if (!anchor) {
      console.log("blockValues   anchor is null ");
      return null;
    }
    this.correctionDropdown.onSelect = (objValue) => {
      this.onSelect_traitValue(objValue, this.input);
      this.correctionDropdown.hide();
    };
    let renderList = getRenderList_valueEvaluation(block);
    this.correctionDropdown.setItems(null, {
      anchor,
      type: "renderAvailableValue",
      renderList,
      //   valueEvaluation : block.valueEvaluation,
      idsLength: block.idsLength,
      infoList: block.infoList
    });
    this.correctionDropdown.show();
    return { anchor };
  }
  //========================================================================================================
  //                              show traits Corrections
  //========================================================================================================
  // todo: showTraitSuggestion
  showCorrections(block) {
    const anchor = this.assistant.getTraitAnchor(block.blockId);
    if (!anchor) {
      console.log("getTraitAnchor  is null ");
      return null;
    }
    let renderList = getRenderList_traitSuggestion(block);
    this.correctionDropdown.setItems(null, {
      anchor,
      type: "renderAvailableTrait",
      renderList,
      //this is argument for onSelect
      infoList: block.infoList
    });
    this.correctionDropdown.onSelect = (correction) => {
      this.onSelect_traitType(correction, this.input);
      this.correctionDropdown.hide();
    };
    this.correctionDropdown.show();
    return { anchor };
  }
  //+v[he] +v[HE] +v[sh]
  updateAssistant(queryResult) {
    this.queryState.queryResult = queryResult;
    this.assistant.show(queryResult);
  }
  onSelect_ProducterOption(selectedItem) {
    this.correctionDropdown.hide();
    this.input.focus();
    const raw = this.input.getValue();
    const caret = this.input.getCaret();
    this.refreshQueryResult({
      raw,
      caret,
      action: null,
      command: { type: "INSERT_OPERATOR", operator: selectedItem }
    });
  }
  onSelect_traitValue(objValue, input) {
    this.correctionDropdown.hide();
    const raw = input.getValue();
    const caret = input.getCaret();
    this.refreshQueryResult({
      raw,
      caret,
      action: null,
      command: {
        type: "REPLACE_TRAITVALUE",
        traitValueSelected: objValue.traitValueSelected.label,
        start: objValue.start,
        end: objValue.end
      }
    });
  }
  onSelect_traitType(correction, input) {
    console.log("this.correctionDropdown.onSelect: (correction) :", correction);
    const raw = input.getValue();
    const caret = input.getCaret();
    this.refreshQueryResult({
      raw,
      caret,
      action: null,
      command: {
        type: "REPLACE_TRAIT",
        traitSelected: correction.traitSelected,
        //      "TRAIT_TYPE",
        traitStart: correction.traitStart,
        traitEnd: correction.traitEnd,
        caret
      }
    });
  }
  #bind() {
    this.input.onFocus = () => {
      const getValue = this.input.getValue();
      console.log(" getValue   === ", getValue);
      if (this.input.getValue() === "") {
        this.showRecent();
        this.dropdown.show();
      }
      if (this.queryState.queryResult) {
        this.updateAssistant(this.queryState.queryResult);
      }
    };
    this.input.onBlur = () => {
      this.close();
    };
    this.input.refreshQueryResult = (obj) => {
      this.refreshQueryResult(obj);
    };
    this.input.onChange = (text) => {
      this.setAndRefreshQuery(text);
    };
    this.input.onArrowDown = () => {
      this.dropdown.selectNext();
    };
    this.input.onArrowUp = () => {
      this.dropdown.selectPrevious();
    };
    this.input.onEnter = () => {
      const item = this.dropdown.selectedItem;
      if (!item) return;
      this.input.setValue(item.raw);
      const caret = this.input.getCaret();
      this.refreshQueryResult({ raw: item.raw, caret });
      this.dropdown.hide();
    };
    this.input.onEscape = () => {
      this.dropdown.hide();
    };
    this.input.setupInputScrollSync = () => {
      const input = this.input.el;
      this.assistant.root.scrollLeft = input.scrollLeft;
      this.nodeGraphScroll.scrollLeft = input.scrollLeft;
    };
    this.input.onCaretChanged = (caret) => {
      const queryResult = this.queryState.queryResult;
      if (!queryResult) {
        return;
      }
      if (queryResult.blocks && queryResult.blocks.length === 0) {
        this.correctionDropdown?.hide();
        return;
      }
      if (this.collection && this.collection === "apiPipeline") {
        return;
      }
      const blocks = queryResult.blocks;
      const block = this.getBlockFromCaret(blocks, caret);
      if (!block) {
        return;
      }
      const blockTrait = queryResult.blocks.find(
        (bl) => caret >= bl.traitStart && caret <= bl.traitEnd
      );
      const blockValues = queryResult.blocks.find(
        (bl) => caret >= bl.valueStart && caret <= bl.valueEnd
      );
      if (block && block.type === "PARTIAL" || block && block.type === "UNKNOWN") {
        return;
      }
      this.correctionDropdown?.hide();
      let show_partial;
      const operatorToken = block.operatorToken;
      if (operatorToken) {
        show_partial = operatorToken.type === "PARTIAL_PRODUCER" ? (
          // || operatorToken.type === "COMPLETE_PRODUCER" ?
          true
        ) : false;
      }
      const show_blockTrait = block && blockTrait ? true : false;
      const show_blockValues = block && blockValues ? true : false;
      console.log(
        "  DROPDOWN TO SHOW  ===================\n",
        "show_blockTrait",
        show_blockTrait,
        "\n",
        "show_blockValues",
        show_blockValues,
        "\n",
        "show_partial",
        show_partial,
        "\n",
        "block",
        block
      );
      let currentAnchor = null;
      if (show_partial) {
        currentAnchor = this.showProducerOption(block);
      }
      if (show_blockTrait) {
        currentAnchor = this.showCorrections(block);
      }
      if (
        // !show_partial && !show_blockTrait &&
        show_blockValues
      ) {
        currentAnchor = this.showTraitValues(block);
      }
    };
  }
  open() {
  }
  close() {
  }
  toggle() {
  }
  getRandomItem() {
    const items = this.store.getRecent();
    if (!items || items.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
  }
  showRecent() {
    this.dropdown.onSelect = (item) => {
      this.input.setValue(item.raw);
      const caret = this.input.getCaret();
      this.refreshQueryResult({ raw: item.raw, caret });
      this.dropdown.hide();
    };
    const items = this.store.getRecent();
    let renderList = [];
    items.forEach((item, index) => {
      renderList.push({
        label: item.raw,
        select: item
      });
    });
    this.dropdown.setItems(null, {
      anchor: null,
      type: "queryExample",
      renderList,
      infoList: null
    });
    if (items.length)
      this.dropdown.show();
    else
      this.dropdown.hide();
  }
  // filter
  setAndRefreshQuery(text) {
    const caret = this.input.getCaret();
    const queryObj = {
      raw: text,
      caret,
      action: this.input.consumeLastKey()
      // command:
    };
    console.log("filter send raw to engine ========", queryObj);
    this.refreshQueryResult(queryObj);
  }
  getBlockFromCaret(blocks, caret) {
    return blocks.find(
      (bl) => caret >= bl.start && caret <= bl.end
    );
  }
};

// widget/wuli-query.js
var guideComponent = null;
function createWidgetRoot(container) {
  if (container.shadowRoot) {
    return container.shadowRoot;
  }
  return container.attachShadow({
    mode: "open"
  });
}
function render({
  container,
  pageData,
  collection = "guide",
  slug,
  componentId = 0
}) {
  const shadowRoot = createWidgetRoot(container);
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "../widget/wuli-architecture.css";
  shadowRoot.appendChild(style);
  const widgetContent2 = document.createElement("div");
  widgetContent2.className = "wulirocks";
  shadowRoot.appendChild(widgetContent2);
  getDOMregistry().widgetContent = widgetContent2;
  setPageDataset();
  if (!container) {
    throw new Error(
      "WuliArchitecture.render() requires a container."
    );
  }
  const html = `
        <div id ="row1" >  
        <div id="topTraitSlot"></div>
         <div id="queryBox">
            <div class="queryCaret">
              <span class="queryCaretText"></span><span class="caretBar"></span>

           </div> 
                  <input class="queryInput" id="queryInput">

                  <div id="queryDropdown" class="queryDropdown" hidden></div>
                  <div id="queryAssistant" class="queryAssistant"  ></div>
                  <div id="correctionAssistant" class="correctionAssistant"  ></div>
           </div>

             <button id="querySave">s</button>
            <button id="queryReset">re</button>
         </div>
    `;
  if (!guideComponent) {
    const container2 = widgetContent2;
    guideComponent = container2.innerHTML = html;
    const queryBox = new QueryBox( 
      /*
      widgetContent2.querySelector("#queryBox"),
       null,
       null*/
        
                {
                root: document,
                container: widgetContent2.querySelector("#queryBox") , 
            
                }
     );
  }
  return guideComponent;
  const options = {
    hideTopArea: true,
    collection,
    slug,
    componentId
  };
  guideComponent.show(
    pageData,
    options
  );
  return guideComponent;
}
window.WuliArchitecture = { render };
runWidget();
async function runWidget() {
  const wuliQueryWidget = document.getElementById("wuli-query-widget");
  if (!wuliQueryWidget || !wuliQueryWidget.dataset.src) {
    return;
  }
  const jsonFile = wuliQueryWidget.dataset.src;
  console.log("  fetch   ");
  const response = await fetch(jsonFile);
  console.log("fetch response    ", response);
  if (!response.ok) {
    throw new Error(
      `Failed to load diagram.json: ${response.status}`
    );
  }
  const pageData = await response.json();
  console.log("pageData   ", pageData);
  render({
    container: wuliQueryWidget,
    pageData,
    collection: "reference",
    slug: "widget-test",
    componentId: 0
  });
  console.log(
    "Wulirocks Architecture widget ready"
  );
}
function testWidget() {
  runWidget();
}
export {
  testWidget
};
