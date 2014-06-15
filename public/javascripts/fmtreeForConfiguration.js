var FMTreeConfig = {
  iIcon           : 'images/I.png',
  lIcon           : 'images/L.png',
  lMinusIcon      : 'images/Lminus.png',
  lPlusIcon       : 'images/Lplus.png',
  tIcon           : 'images/T.png',
  tMinusIcon      : 'images/Tminus.png',
  tPlusIcon       : 'images/Tplus.png',
  blankIcon       : 'images/blank.png',
  barMinusIcon    : 'images/Bminus.png',
  barPlusIcon     : 'images/Bplus.png',
  trueBlankIcon   : 'images/trueBlank.png',
  manNonVPIcon    : 'images/manNonVP.png',
  manOORIcon       : 'images/manOOR.png',
  manXORIcon      : 'images/manXOR.png',
  optNonVPIcon    : 'images/optNonVP.png',
  optOORIcon       : 'images/optOOR.png',
  optXORIcon      : 'images/optXOR.png',
  defaultText     : 'New Feature',
  defaultAction   : 'javascript:void(0);',
  optLeftWhiteButton  : 'images/optLeftWhite.png',
  optLeftGreyButton   : 'images/optLeftGrey.png',
  optRightWhiteButton : 'images/optRightWhite.png',
  optRightGreyButton  : 'images/optRightGrey.png',
  vpLeftWhiteButton   : 'images/vpLeftWhite.png',
  vpLeftGreyButton    : 'images/vpLeftGrey.png',
  vpMiddleWhiteButton : 'images/vpMiddleWhite.png',
  vpMiddleGreyButton  : 'images/vpMiddleGrey.png',
  vpRightWhiteButton  : 'images/vpRightWhite.png',
  vpRightGreyButton   : 'images/vpRightGrey.png'
};

var FMTreeHandler = {
  idPrefix  : "FM_tree_object_",
  all       : {}, /* 每新建一个结点，该结点就会将自己的副本放到all数组中 */
  active    : null,
  toggle    : function (oItem) { this.all[oItem.id.replace('-plus','')].toggle(); },
  adcToggle : function (oItem) { this.all[oItem.id.replace('-adc','')].adcToggle(); },
  /* 将sHTML插入HTML中 */
  insertHTMLBeforeEnd  :  function (oElement, sHTML) {
    /* 如果可以用 insertAdjacentHTML 方法 */
    if (oElement.insertAdjacentHTML != null) {
      oElement.insertAdjacentHTML("BeforeEnd", sHTML)
      return;
    }

    /* 如果不可以用 insertAdjacentHTML 方法 */
    var df;  // DocumentFragment
    var r = oElement.ownerDocument.createRange();
    r.selectNodeContents(oElement);
    r.collapse();
    df = r.createContextualFragment(sHTML);
    oElement.appendChild(df);
  }
};
/*
 * FMTreeAbstractNode class
 */

function FMTreeAbstractNode(sText, sDescription, sOptionality, sVP, sId, sAction) {
  this.id  = FMTreeHandler.idPrefix + sId;
  this.text   = sText || FMTreeConfig.defaultText; 
  this.description = sDescription || '';
  if (sOptionality == 'Mandatory' || sOptionality == 'Optional') {
    this.optionality = sOptionality;
  }
  else {
    this.optionality = 'Optional';
  }
  if (sVP == 'XOR' || sVP == 'OR') {
    this.VP = sVP;
  }
  else {
    this.VP = 'Non-VP';
  }
  this.action = sAction || FMTreeConfig.defaultAction;
  this.childNodes  = [];
  this._last  = false; /*该结点是否是兄弟中最后一个 */
  FMTreeHandler.all[this.id] = this;
}

/* 添加一个子结点到当前节点，node为子结点实例，bNoIdent为true时将防止在增加结点时树的折叠*/
FMTreeAbstractNode.prototype.add = function (node, bNoIdent) {
  node.level = this.level + 1;

  /* root为根结点 */
  var root = this;
  while (root.parentNode) { root = root.parentNode; }

  node.parentNode = this;
  this.childNodes[this.childNodes.length] = node;
  
  /* 如果当前结点不止新的子结点一个子结点，则将原来的last子结点的_last改为false */
  if (this.childNodes.length >= 2) {
    this.childNodes[this.childNodes.length - 2]._last = false;
  }

    /* 如果该树已被创建，且已经被渲染 */
  if (root.rendered) {
    if (this.childNodes.length >= 2) {
      /* 父结点的前任last子结点如今已经不是last子结点了，因此要更换树结构图标 */
      document.getElementById(this.childNodes[this.childNodes.length - 2].id + '-plus').src = ((this.childNodes[this.childNodes.length -2].folder)?((this.childNodes[this.childNodes.length -2].open)?FMTreeConfig.tMinusIcon:FMTreeConfig.tPlusIcon):FMTreeConfig.tIcon);
      this.childNodes[this.childNodes.length - 2].plusIcon = FMTreeConfig.tPlusIcon;
      this.childNodes[this.childNodes.length - 2].minusIcon = FMTreeConfig.tMinusIcon;
      this.childNodes[this.childNodes.length - 2]._last = false;
    }
    this._last = true; /* 该结点（新结点的父结点）成为最后一个结点 ！事实上接下来它就会被根据实际情况改变= =/
    
    /* 更新新结点的所有祖先结点的_last*/
    var foo = this;
    while (foo.parentNode) {
      /* 找出foo是它父结点的第几个子结点，数字传给i */ 
      for (var i = 0; i < foo.parentNode.childNodes.length; i++) {
        if (foo.id == foo.parentNode.childNodes[i].id) { break; }
      }
      if (i == foo.parentNode.childNodes.length - 1) { 
        foo.parentNode._last = true; 
      }
      else { 
        foo.parentNode._last = false; 
      }
      foo = foo.parentNode;
    }

    /* 将输出新结点的语句插入HTML中 */
    FMTreeHandler.insertHTMLBeforeEnd(document.getElementById(this.id + '-cont'), node.toString());
    
    if (!this.folder) { this.folder = true; this.collapse(); }
    if (!bNoIdent) { this.indent(); }
  }

  /* 返回新的结点 */
  return node;
}

/* 切换当前结点的展开/折叠状态 */
FMTreeAbstractNode.prototype.toggle = function() {
  if (this.folder) {
    if (this.open) { 
      this.collapse(); 
    }
    else { 
      this.expand();
    }
  }  
}

FMTreeAbstractNode.prototype.doExpand = function() {
  if (this.childNodes.length) {
    document.getElementById(this.id + '-cont').style.display = 'block'; 
  }
  this.open = true;
}

FMTreeAbstractNode.prototype.doCollapse = function() {
  if (this.childNodes.length) {
    document.getElementById(this.id + '-cont').style.display = 'none'; 
  }
  this.open = false;
}

FMTreeAbstractNode.prototype.expandAll = function() {
  this.expandChildren();
  if ((this.folder) && (!this.open)) { 
    this.expand(); 
  }
}

FMTreeAbstractNode.prototype.expandChildren = function() {
  for (var i = 0; i < this.childNodes.length; i++) {
    this.childNodes[i].expandAll();
  }
}

FMTreeAbstractNode.prototype.collapseAll = function() {
  this.collapseChildren();
  if ((this.folder) && (this.open)) { 
    this.collapse(); 
  }
}

FMTreeAbstractNode.prototype.collapseChildren = function() {
  for (var i = 0; i < this.childNodes.length; i++) {
    this.childNodes[i].collapseAll();
  }
}

FMTreeAbstractNode.prototype.indent = function(lvl, del, last, level, nodesLeft) {
  /*
   * Since we only want to modify items one level below ourself,
   * and since the rightmost indentation position is occupied by
   * the plus icon we set this to -2
   */
  if (lvl == null) { lvl = -2; }
  var state = 0;
  for (var i = this.childNodes.length - 1; i >= 0 ; i--) {
    state = this.childNodes[i].indent(lvl + 1, del, last, level);
    if (state) { return; }
  }
  if (del) {
    if ((level >= this._level) && (document.getElementById(this.id + '-plus'))) {
      if (this.folder) {
        document.getElementById(this.id + '-plus').src = (this.open)?FMTreeConfig.lMinusIcon:FMTreeConfig.lPlusIcon;
        this.plusIcon = FMTreeConfig.lPlusIcon;
        this.minusIcon = FMTreeConfig.lMinusIcon;
      }
      else if (nodesLeft) { document.getElementById(this.id + '-plus').src = FMTreeConfig.lIcon; }
      return 1;
  }  }
  var foo = document.getElementById(this.id + '-indent-' + lvl);
  if (foo) {
    if ((foo._last) || ((del) && (last))) { foo.src =  FMTreeConfig.blankIcon; }
    else { foo.src =  FMTreeConfig.iIcon; }
  }
  return 0;
}

/*
 * FMTree class
 */

function FMTree(sText, sDescription, sOptionality, sVP, sId, sAction) {
  this.base = FMTreeAbstractNode;
  this.base(sText, sDescription, sOptionality, sVP, sId, sAction);
  this.plus = FMTreeConfig.lPlusIcon;

  /* Defaults to open */
  this.open  = true;
  this.folder    = true;
  this.rendered  = false;
  this.level = 0;
}

FMTree.prototype = new FMTreeAbstractNode;

FMTree.prototype.remove = function() { }

FMTree.prototype.expand = function() {
  this.doExpand();
  document.getElementById(this.id + '-plus').src = FMTreeConfig.barMinusIcon;
}

FMTree.prototype.collapse = function() {
  this.doCollapse();
  document.getElementById(this.id + '-plus').src = FMTreeConfig.barPlusIcon;
}

FMTree.prototype.getFirst = function() {
  return null;
}

FMTree.prototype.getLast = function() {
  return null;
}

FMTree.prototype.getNextSibling = function() {
  return null;
}

FMTree.prototype.getPreviousSibling = function() {
  return null;
}


FMTree.prototype.toString = function() {
  var str = "<div id=\"" + this.id + "\" class=\"FM-tree-item\" onmouseover=\"" + this.id + "_button.className=''\" onmouseout=\"" + this.id + "_button.className='invisible'\">" +
    "<img id=\"" + this.id + "-plus\" src=\"" + ((this.open)?(FMTreeConfig.barMinusIcon):(FMTreeConfig.barPlusIcon)) + "\" onclick=\"FMTreeHandler.toggle(this);\">" +
    this.text  +
    "</div>" +
    "<div id=\"" + this.id + "-cont\" class=\"FM-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\">" ;
  var sb = [];
  for (var i = 0; i < this.childNodes.length; i++) {
    sb[i] = this.childNodes[i].toString(i, this.childNodes.length);
  }
  this.rendered = true;
  return str + sb.join("") + "</div>";
};

/*
 * FMTreeItem class
 */

function FMTreeItem(sText, sDescription, sOptionality, sVP, sId, sAction, eParent) {
  this.base = FMTreeAbstractNode;
  this.base(sText, sDescription, sOptionality, sVP, sId, sAction);
  /* Defaults to close */
  this.open = false;
  if (eParent) { eParent.add(this); }
}

FMTreeItem.prototype = new FMTreeAbstractNode;

FMTreeItem.prototype.expand = function() {
  this.doExpand();
  document.getElementById(this.id + '-plus').src = this.minusIcon;
}

FMTreeItem.prototype.collapse = function() {
  this.doCollapse();
  document.getElementById(this.id + '-plus').src = this.plusIcon;
}

FMTreeItem.prototype.getFirst = function() {
  return this.childNodes[0];
}

FMTreeItem.prototype.getLast = function() {
  if (this.childNodes[this.childNodes.length - 1].open) { return this.childNodes[this.childNodes.length - 1].getLast(); }
  else { return this.childNodes[this.childNodes.length - 1]; }
}

FMTreeItem.prototype.getNextSibling = function() {
  for (var i = 0; i < this.parentNode.childNodes.length; i++) {
    if (this == this.parentNode.childNodes[i]) { break; }
  }
  if (++i == this.parentNode.childNodes.length) { return this.parentNode.getNextSibling(); }
  else { return this.parentNode.childNodes[i]; }
}

FMTreeItem.prototype.getPreviousSibling = function(b) {
  for (var i = 0; i < this.parentNode.childNodes.length; i++) {
    if (this == this.parentNode.childNodes[i]) { break; }
  }
  if (i == 0) { return this.parentNode; }
  else {
    if ((this.parentNode.childNodes[--i].open) || (b && this.parentNode.childNodes[i].folder)) { return this.parentNode.childNodes[i].getLast(); }
    else { return this.parentNode.childNodes[i]; }
} }

FMTreeItem.prototype.toString = function (nItem, nItemCount) {
  console.log("configuration part");
  var foo = this.parentNode;
  var indent = '';
  if (nItem + 1 == nItemCount) { this.parentNode._last = true; }
  var i = 0;
  while (foo.parentNode) {
    foo = foo.parentNode;
    indent = "<img id=\"" + this.id + "-indent-" + i + "\" src=\"" + ((foo._last)?FMTreeConfig.blankIcon:FMTreeConfig.iIcon) + "\">" + indent;
    i++;
  }
  indent = "<img id=\"" + this.id + "-indent-" + i + "\" src=\"" + (FMTreeConfig.blankIcon) + "\">" + indent;
  this._level = i;
  if (this.childNodes.length) { this.folder = 1; }
  else { this.open = false; }
  var label = this.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  var str = "<div id=\"" + this.id + "\" class=\"FM-tree-item\">" +
    indent +
    "<img id=\"" + this.id + "-plus\" src=\"" + ((this.folder)?((this.open)?((this.parentNode._last)?FMTreeConfig.lMinusIcon:FMTreeConfig.tMinusIcon):((this.parentNode._last)?FMTreeConfig.lPlusIcon:FMTreeConfig.tPlusIcon)):((this.parentNode._last)?FMTreeConfig.lIcon:FMTreeConfig.tIcon)) + "\" onclick=\"FMTreeHandler.toggle(this);\">"
     ;
  if (this.optionality == "Optional") {
    str+="<input type=\"checkbox\" id=\"" + this.id + "_id\" style=\"margin-bottom:5px\" class=\"SetTraceRuleGuard\" onclick=\"addGuard(\'"+this.text+"\')\" name=\"box\">&nbsp;";
  }
 
  str +=
  /*  "<a href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onclick=\"FMTreeHandler.click(this);\"" +
    (this.target ? " target=\"" + this.target + "\"" : "") +
    ">" + */
     label +  
    "</div>" +
    "<div id=\"" + this.id + "-cont\" class=\"FM-tree-container\" style=\"display: " + ((this.open)?'block':'none') + ";\">";
  var sb = [];
  for (var i = 0; i < this.childNodes.length; i++) {
    sb[i] = this.childNodes[i].toString(i,this.childNodes.length);
  }
  this.plusIcon = ((this.parentNode._last)?FMTreeConfig.lPlusIcon:FMTreeConfig.tPlusIcon);
  this.minusIcon = ((this.parentNode._last)?FMTreeConfig.lMinusIcon:FMTreeConfig.tMinusIcon);
  return str + sb.join("") + "</div>";
}

