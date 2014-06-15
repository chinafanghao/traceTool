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
  idCounter : 0, /* 新建一个结点时会调用getID，此时Counter自加，并作为新结点的ID被分配 */
  idPrefix  : "FM_tree_object_",
  all       : {}, /* 每新建一个结点，该结点就会将自己的副本放到all数组中 */
  active    : null,
  active_optionality : '',
  active_VP : '',
  changingName        : false,
  changingDescription : false,
  changingOptionality : false,
  changingParent      : false,
  changingVP          : false,
  getId     : function() { return this.idCounter++; },
  toggle    : function (oItem) { this.all[oItem.id.replace('-plus','')].toggle(); },
  click     : function (oItem) { this.all[oItem.id.replace('-anchor','')].click();},
  addChild  : function (oItem) { this.all[oItem.id.replace('-adc','')].addChild(); },
  adcToggle : function (oItem) { this.all[oItem.id.replace('-adc','')].adcToggle(); },
  addSibling: function (oItem) { this.all[oItem.id.replace('-ads','')].addSibling(); },
  delete    : function (oItem) { this.all[oItem.id.replace('-rem','')].delete(); },
  editName  : function () {
    FMTreeHandler.changingName = true;
    document.getElementById("info-name").innerHTML = "<textarea rows=\"1\" id=\"name\">" + FMTreeHandler.active.text + "</textarea>";
    document.getElementById("infoLineButton1").innerHTML="<i class=\"icon-ok\" onclick=\"FMTreeHandler.doEditName();\"></i>";
    //document.getElementById("infoLineButton1").className='';
    //document.getElementById("infoLine1").onmouseover='';
    //document.getElementById("infoLine1").onmouseout='';
  },
  doEditName: function () {
    var name=document.getElementById("name").value;
    FMTreeHandler.active.text = name;
    document.getElementById("info-name").innerHTML = name;
    document.getElementById("infoLineButton1").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editName();\"></i>";
    //document.getElementById("infoLineButton1").className="invisible";
    document.getElementById(FMTreeHandler.active.id + "-anchor").innerHTML = name;
    //document.getElementById("infoLine1").onmouseover="infoLineButton1.className=''";
    //document.getElementById("infoLine1").onmouseout="infoLineButton1.className='invisible'";
    FMTreeHandler.changingName = false;
  },
  editDescription: function () {
    FMTreeHandler.changingDescription = true;
    document.getElementById("info-description").innerHTML = "<textarea rows=\"4\"id=\"description\">" + FMTreeHandler.active.description + "</textarea>";
    document.getElementById("infoLineButton2").innerHTML="<i class=\"icon-ok\" onclick=\"FMTreeHandler.doEditDescription();\"></i>";
    //document.getElementById("infoLineButton2").className="";
    //document.getElementById("infoLine2").onmouseover='';
    //document.getElementById("infoLine2").onmouseout='';
  },
  doEditDescription: function () {
    var description=document.getElementById("description").value;
    FMTreeHandler.active.description = description;
    document.getElementById("info-description").innerHTML = description;
    document.getElementById("infoLineButton2").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editDescription();\"></i>";
    //document.getElementById("infoLineButton2").className="invisible";
    //document.getElementById("infoLine2").onmouseover="infoLineButton2.className=''";
    //document.getElementById("infoLine2").onmouseout="infoLineButton2.className='invisible'";
    FMTreeHandler.changingDescription = false;
  },
  editOptionality: function () {
    FMTreeHandler.changingOptionality = true;
    FMTreeHandler.active_optionality = FMTreeHandler.active.optionality;
    if (FMTreeHandler.active_optionality == 'Mandatory') {
      document.getElementById("info-optionality").innerHTML = "<img id=\"optLeftButton\" class=\"myButton\" src=\"" + FMTreeConfig.optLeftGreyButton + "\" onclick=\"FMTreeHandler.clickOptLeft();\"/><img id=\"optRightButton\" class=\"myButton\" src=\"" + FMTreeConfig.optRightWhiteButton + "\" onclick=\"FMTreeHandler.clickOptRight();\"/>";
    }
    else if (FMTreeHandler.active_optionality == 'Optional') {
      document.getElementById("info-optionality").innerHTML = "<img id=\"optLeftButton\" class=\"myButton\" src=\"" + FMTreeConfig.optLeftWhiteButton + "\" onclick=\"FMTreeHandler.clickOptLeft();\"/><img id=\"optRightButton\" class=\"myButton\" src=\"" + FMTreeConfig.optRightGreyButton + "\" onclick=\"FMTreeHandler.clickOptRight();\"/>";
    }
    else {
      document.getElementById("info-optionality").innerHTML = "<img id=\"optLeftButton\" class=\"myButton\" src=\"" + FMTreeConfig.optLeftWhiteButton + "\" onclick=\"FMTreeHandler.clickOptLeft();\"/><img id=\"optRightButton\" class=\"myButton\" src=\"" + FMTreeConfig.optRightWhiteButton + "\" onclick=\"FMTreeHandler.clickOptRight();\"/>";
    }
    document.getElementById("infoLineButton3").innerHTML="<i class=\"icon-ok\" onclick=\"FMTreeHandler.doEditOptionality();\"></i>";
    //document.getElementById("infoLineButton3").className="";
    //document.getElementById("infoLine3").onmouseover='';
    //document.getElementById("infoLine3").onmouseout='';
  },
  clickOptLeft: function () {
    if (FMTreeHandler.active_optionality == 'Mandatory') {
      //FMTreeHandler.active_optionality='';
      //document.getElementById("optLeftButton").src = FMTreeConfig.optLeftWhiteButton;
      //document.getElementById("optRightButton").src = FMTreeConfig.optRightWhiteButton;
    }
    else {
      FMTreeHandler.active_optionality='Mandatory';
      document.getElementById("optLeftButton").src = FMTreeConfig.optLeftGreyButton;
      document.getElementById("optRightButton").src = FMTreeConfig.optRightWhiteButton;
    }
  },
  clickOptRight: function () {
    if (FMTreeHandler.active_optionality == 'Optional') {
      //FMTreeHandler.active_optionality='';
      //document.getElementById("optLeftButton").src = FMTreeConfig.optLeftWhiteButton;
      //document.getElementById("optRightButton").src = FMTreeConfig.optRightWhiteButton;
    }
    else {
      FMTreeHandler.active_optionality='Optional';
      document.getElementById("optLeftButton").src = FMTreeConfig.optLeftWhiteButton;
      document.getElementById("optRightButton").src = FMTreeConfig.optRightGreyButton;
    }
  },
  doEditOptionality: function () {
    document.getElementById("info-optionality").innerHTML = FMTreeHandler.active_optionality;
    FMTreeHandler.active.optionality = FMTreeHandler.active_optionality;
    document.getElementById("infoLineButton3").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editOptionality();\"></i>";
    if (FMTreeHandler.active.optionality == "Mandatory") {
      document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src = document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src.replace('opt','man');
    }
    else if (FMTreeHandler.active.optionality == "Optional") {
      document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src = document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src.replace('man','opt');
    }
    else {
    }
    //document.getElementById("infoLineButton3").className="invisible";
    //document.getElementById("infoLine3").onmouseover="infoLineButton3.className=''";
    //document.getElementById("infoLine3").onmouseout="infoLineButton3.className='invisible'";
    FMTreeHandler.active_optionality = '';
    FMTreeHandler.changingOptionality = false;
  },
  editParent: function () {
    FMTreeHandler.changingParent = true;
    var selectHTML = "<select id=\"parent\">";
    var root = FMTreeHandler.active;
    while (root.parentNode) { root = root.parentNode; }
    selectHTML = selectHTML + FMTreeHandler.getname(root);
    selectHTML = selectHTML + "</select>";
    document.getElementById("info-parent").innerHTML = selectHTML;
    FMTreeHandler.sortASC("parent");
    document.getElementById("infoLineButton4").innerHTML="<i class=\"icon-ok\" onclick=\"FMTreeHandler.doEditParent();\"></i>";
  },
  getname: function (node) {
    if(node.id == FMTreeHandler.active.id) {
      return;
    }
    var temp;
    if(node.id == FMTreeHandler.active.parentNode.id) {
      temp = "<option value=\"" + node.id + "\" selected=\"selected\">" + node.text + "</option>";
    }
    else {
      temp = "<option value=\"" + node.id + "\">" + node.text + "</option>";
    }
    if (node.folder) {
      for (var i = 0; i < node.childNodes.length; i++) {
        temp = temp + FMTreeHandler.getname(node.childNodes[i]);
      }
    }
    return temp;
  },
  sortASC: function (id) {
    var select = document.getElementById(id);
    if (!select) {
      return;
    }
    var texts = [], values = [], options = select.options, selected = select.value, temp = [];
    while (options.length > 0) {
      texts[texts.length] = options[0].text;
      temp[texts[texts.length - 1]] = texts.length - 1;
      values[values.length] = options[0].value;
      options.remove(0);
    }
    texts.sort(asc =  function(a,b) {
      if (a > b)
        return 1;
      else if (a < b)
        return -1;
      else
        return 0;
    });
    for (var i = 0; i < texts.length; i++) {
      var opt=document.createElement('option');
      opt.text = texts[i];
      opt.value = values[temp[texts[i]]];
      if (opt.value == selected) {
        opt.selected = "selected";
      }
      options.add(opt, i);
    }
  },
  doEditParent: function () {
    var parent_id = document.getElementById("parent").value;
    if (parent_id == FMTreeHandler.active.parentNode.id) {
      document.getElementById("info-parent").innerHTML=FMTreeHandler.active.parentNode.text;
      document.getElementById("infoLineButton4").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editParent();\"></i>";
      return;
    }
    if (FMTreeHandler.changingName || FMTreeHandler.changingDescription || FMTreeHandler.changingOptionality || FMTreeHandler.changingVP) {
      if (!window.confirm(" All the other unsaved changes of this feature will be abandoned. \n Do you confirm? ")) {
        return;
      }
    }
    var newChild = FMTreeHandler.doEditParentAdd(FMTreeHandler.all[parent_id], FMTreeHandler.active);
    FMTreeHandler.active.remove();
    var ancestor = FMTreeHandler.all[parent_id];
    while (ancestor.parentNode) {
      if(!ancestor.open) {
        ancestor.expand();
      }
      ancestor=ancestor.parentNode;
    }
    FMTreeHandler.active = null;
    FMTreeHandler.click(newChild);
    FMTreeHandler.changingParent = false;
  },
  doEditParentAdd : function (newParent, oldChild) {
    var newChild = new FMTreeItem(oldChild.text, oldChild.description, oldChild.optionality, oldChild.VP);
    newParent.add(newChild);
    for (var i = 0; i < oldChild.childNodes.length; i++) {
      FMTreeHandler.doEditParentAdd(newChild, oldChild.childNodes[i]);
    }
    if (oldChild.open) {
      newChild.expand();
    }
    return newChild;
  },
  editVP: function () {
    FMTreeHandler.changingVP = true;
    FMTreeHandler.active_VP = FMTreeHandler.active.VP;
    if (FMTreeHandler.active_VP == 'Non-VP') {
      document.getElementById("info-VP").innerHTML = "<img id=\"vpLeftButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpLeftGreyButton + "\" onclick=\"FMTreeHandler.clickVPLeft();\"/>&nbsp;&nbsp;<img id=\"vpMiddleButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpMiddleWhiteButton + "\" onclick=\"FMTreeHandler.clickVPMiddle();\"/><img id=\"vpRightButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpRightWhiteButton + "\" onclick=\"FMTreeHandler.clickVPRight();\"/>";
    }
    else if (FMTreeHandler.active_VP == 'OR') {
      document.getElementById("info-VP").innerHTML = "<img id=\"vpLeftButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpLeftWhiteButton + "\" onclick=\"FMTreeHandler.clickVPLeft();\"/>&nbsp;&nbsp;<img id=\"vpMiddleButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpMiddleGreyButton + "\" onclick=\"FMTreeHandler.clickVPMiddle();\"/><img id=\"vpRightButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpRightWhiteButton + "\" onclick=\"FMTreeHandler.clickVPRight();\"/>";
    }
    else if (FMTreeHandler.active_VP == 'XOR') {
      document.getElementById("info-VP").innerHTML = "<img id=\"vpLeftButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpLeftWhiteButton + "\" onclick=\"FMTreeHandler.clickVPLeft();\"/>&nbsp;&nbsp;<img id=\"vpMiddleButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpMiddleWhiteButton + "\" onclick=\"FMTreeHandler.clickVPMiddle();\"/><img id=\"vpRightButton\" class=\"myButton\" src=\"" + FMTreeConfig.vpRightGreyButton + "\" onclick=\"FMTreeHandler.clickVPRight();\"/>";
    }
    else {}
    document.getElementById("infoLineButton5").innerHTML="<i class=\"icon-ok\" onclick=\"FMTreeHandler.doEditVP();\"></i>";
  },
  clickVPLeft: function () {
    if (FMTreeHandler.active_VP != 'Non-VP') {
      FMTreeHandler.active_VP='Non-VP';
      document.getElementById("vpLeftButton").src = FMTreeConfig.vpLeftGreyButton;
      document.getElementById("vpMiddleButton").src = FMTreeConfig.vpMiddleWhiteButton;
      document.getElementById("vpRightButton").src = FMTreeConfig.vpRightWhiteButton;
    }
  },
  clickVPMiddle: function () {
    if (FMTreeHandler.active_VP != 'OR') {
      FMTreeHandler.active_VP='OR';
      document.getElementById("vpLeftButton").src = FMTreeConfig.vpLeftWhiteButton;
      document.getElementById("vpMiddleButton").src = FMTreeConfig.vpMiddleGreyButton;
      document.getElementById("vpRightButton").src = FMTreeConfig.vpRightWhiteButton;
    }
  },
  clickVPRight: function () {
    if (FMTreeHandler.active_VP != 'XOR') {
      FMTreeHandler.active_VP='XOR';
      document.getElementById("vpLeftButton").src = FMTreeConfig.vpLeftWhiteButton;
      document.getElementById("vpMiddleButton").src = FMTreeConfig.vpMiddleWhiteButton;
      document.getElementById("vpRightButton").src = FMTreeConfig.vpRightGreyButton;
    }
  },
  doEditVP: function () {
    document.getElementById("info-VP").innerHTML = FMTreeHandler.active_VP;
    FMTreeHandler.active.VP = FMTreeHandler.active_VP;
    document.getElementById("infoLineButton5").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editVP();\"></i>";
    FMTreeHandler.active_VP = '';
    if (FMTreeHandler.active.VP == "XOR") {
      document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src = document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src.replace('NonVP','XOR').replace('OOR','XOR');
    }
    else if (FMTreeHandler.active.VP == "OR") {
      document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src = document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src.replace('NonVP','OOR').replace('XOR','OOR');
    }
    else {
      document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src = document.getElementById(FMTreeHandler.active.id + "-optVPIcon").src.replace('XOR','NonVP').replace('OOR','NonVP');
    }
    FMTreeHandler.changingVP = false;
  },
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

function FMTreeAbstractNode(sText, sDescription, sOptionality, sVP, sAction) {
  this.id_no  = FMTreeHandler.getId();
  this.id     = FMTreeHandler.idPrefix + this.id_no;
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
/*
FMTreeAbstractNode.prototype.save = function save() {
  //存入 Mongodb 的文档
  var feature = {
    id_no: this.id_no;
    text: this.text;
    parent: this.parentNode.id_no;
  }
  mongodb.open(function(err,db) {
    if (err) {
      return;
    }
    db.collection('features', function(err, collection) {
      if (err) {
        mongodb.close();
        return;
      }
      collection.ensureIndex('id_no', {unique: true});
      collection.insert(feature, {safe: true}, function(err, user) {
        mongodb.close();
      });
    });
  });
}
*/
/* 添加一个子结点到当前节点，node为子结点实例，bNoIdent为true时将防止在增加结点时树的折叠*/
FMTreeAbstractNode.prototype.add = function (node, bNoIdent) {
  node.parentNode = this;
  this.childNodes[this.childNodes.length] = node;
  
  /* 如果当前结点不止新的子结点一个子结点，则将原来的last子结点的_last改为false */
  if (this.childNodes.length >= 2) {
    this.childNodes[this.childNodes.length - 2]._last = false;
  }

  /* root为根结点 */
  var root = this;
  while (root.parentNode) { root = root.parentNode; }
  
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


FMTreeAbstractNode.prototype.addChild = function() {
  var child_text = window.prompt("Type the name of the feature:", "New Feature");
  if (child_text) {
  	var child = new FMTreeItem(child_text);
  	this.add(child);
    if (this.folder) {
  	  if (!this.open) {
  	    this.expand();
  	  }
    }
    FMTreeHandler.click(child);
  }
}

FMTreeAbstractNode.prototype.addSibling = function() {
  var sibling_text = (window.prompt("Type the name of the feature", "New Feature"));
  if (sibling_text) {
  	var sibling = new FMTreeItem(sibling_text);
    this.parentNode.add(sibling);
    FMTreeHandler.click(sibling);
  }
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


FMTreeAbstractNode.prototype.click = function() {
  //高亮效果
  if (FMTreeHandler.active) {
    //如果点的还是当前高亮的特征，则不操作
    if (FMTreeHandler.active.id == this.id) {
      return;
    }  
  	//如果当前特征的某个字段正在编辑中，那么提示是否舍弃编辑中的内容，确定继续，取消则不操作
    if (FMTreeHandler.changingName || FMTreeHandler.changingDescription || FMTreeHandler.changingOptionality || FMTreeHandler.changingParent || FMTreeHandler.changingVP) {
      if (!window.confirm(" All the unsaved changes of this feature will be abandoned. \n Do you confirm? ")) {
        return;
      }
    }
    document.getElementById(FMTreeHandler.active.id).className = 'FM-tree-item';
  }
  FMTreeHandler.changingName = false;
  FMTreeHandler.changingDescription = false;
  FMTreeHandler.changingOptionality = false;
  FMTreeHandler.changingParent = false;
  FMTreeHandler.changingVP = false;
  document.getElementById(this.id).className = 'FM-tree-item active-item';
  FMTreeHandler.active = this;
  //显示相应Information
  if (this.parentNode) {
    document.getElementById("info-name").innerHTML=this.text;
    document.getElementById("info-description").innerHTML=this.description;
    document.getElementById("info-optionality").innerHTML=this.optionality;
   	document.getElementById("info-parent").innerHTML=this.parentNode.text;
    document.getElementById("info-VP").innerHTML=this.VP;

    document.getElementById("infoLineButton1").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editName();\"></i>";
    document.getElementById("infoLineButton2").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editDescription();\"></i>";
    document.getElementById("infoLineButton3").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editOptionality();\"></i>";
    document.getElementById("infoLineButton4").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editParent();\"></i>";
    document.getElementById("infoLineButton5").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editVP();\"></i>";
  }
  else {
    document.getElementById("info-name").innerHTML=this.text;
    document.getElementById("info-description").innerHTML=this.description;
    document.getElementById("info-optionality").innerHTML="";
  	document.getElementById("info-parent").innerHTML="";
    document.getElementById("info-VP").innerHTML=this.VP;

    document.getElementById("infoLineButton1").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editName();\"></i>";
    document.getElementById("infoLineButton2").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editDescription();\"></i>";
    document.getElementById("infoLineButton3").innerHTML="";
    document.getElementById("infoLineButton4").innerHTML="";
    document.getElementById("infoLineButton5").innerHTML="<i class=\"icon-pencil\" onclick=\"FMTreeHandler.editVP();\"></i>";
  }
}

FMTreeAbstractNode.prototype.delete = function() {
  if (this.folder) {
  	if (window.confirm("Do you want to delete \"" + this.text + "\" and all its descendants?")) {
  	  this.remove();
  	  if (FMTreeHandler.active.id == this.id) {
  	  	FMTreeHandler.active = null;
  	    document.getElementById("info-name").innerHTML="";
    		document.getElementById("info-description").innerHTML="";
    		document.getElementById("info-optionality").innerHTML="";
    		document.getElementById("info-parent").innerHTML="";
    		document.getElementById("info-VP").innerHTML="";
    	}
    }
  }
  else {
  	if (window.confirm("Do you want to delete \"" + this.text + "\"?")) {
  	  this.remove();
  	  if (FMTreeHandler.active.id == this.id) {
  	  	FMTreeHandler.active = null;
  	    document.getElementById("info-name").innerHTML="";
		    document.getElementById("info-description").innerHTML="";
		    document.getElementById("info-optionality").innerHTML="";
		    document.getElementById("info-parent").innerHTML="";
		    document.getElementById("info-VP").innerHTML="";
	    }
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

function FMTree(sText, sDescription, sOptionality, sVP, sAction) {
  this.base = FMTreeAbstractNode;
  this.base(sText, sDescription, sOptionality, sVP, sAction);
  this.plus = FMTreeConfig.lPlusIcon;

  /* Defaults to open */
  this.open  = true;
  this.folder    = true;
  this.rendered  = false;
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
    "<a href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onclick=\"FMTreeHandler.click(this);\"" +
    (this.target ? " target=\"" + this.target + "\"" : "") +
    ">" + this.text + "</a>" +
    "<img src=\"" + (FMTreeConfig.blankIcon) + "\">" +
    "<span class=\"invisible\" id=\"" + this.id + "_button\">" +
    "<i class=\"icon-glass\" id=\"" + this.id + "-adc\" onclick=\"FMTreeHandler.addChild(this);\"></i>" +
    "</span>"+
    "<img src=\"" + (FMTreeConfig.blankIcon) + "\">" +
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

function FMTreeItem(sText, sDescription, sOptionality, sVP, sAction, eParent) {
  this.base = FMTreeAbstractNode;
  this.base(sText, sDescription, sOptionality, sVP, sAction);
  /* Defaults to close */
  this.open = false;
  if (eParent) { eParent.add(this); }
}

FMTreeItem.prototype = new FMTreeAbstractNode;

FMTreeItem.prototype.remove = function() {
  var iconSrc = document.getElementById(this.id + '-plus').src;
  var parentNode = this.parentNode;
  var prevSibling = this.getPreviousSibling(true);
  var nextSibling = this.getNextSibling(true);
  var folder = this.parentNode.folder;
  var last = ((nextSibling) && (nextSibling.parentNode) && (nextSibling.parentNode.id == parentNode.id))?false:true;
  this._remove();
  if (parentNode.childNodes.length == 0) {
    document.getElementById(parentNode.id + '-cont').style.display = 'none';
    parentNode.doCollapse();
    parentNode.folder = false;
    parentNode.open = false;
  }
  if (!nextSibling || last) { parentNode.indent(null, true, last, this._level, parentNode.childNodes.length); }
  if ((prevSibling == parentNode) && !(parentNode.childNodes.length)) {
    prevSibling.folder = false;
    prevSibling.open = false;
    iconSrc = document.getElementById(prevSibling.id + '-plus').src;
    if (parentNode.parentNode) {
      iconSrc = iconSrc.replace('minus', '').replace('plus', '');
    }
    document.getElementById(prevSibling.id + '-plus').src = iconSrc;
  }
  if (document.getElementById(prevSibling.id + '-plus')) {
    if (parentNode == prevSibling.parentNode) {
      if (parentNode.parentNode) {
        iconSrc = iconSrc.replace('minus', '').replace('plus', '');
      }
      document.getElementById(prevSibling.id + '-plus').src = iconSrc;
}  }  }

FMTreeItem.prototype._remove = function() {
  for (var i = this.childNodes.length - 1; i >= 0; i--) {
    this.childNodes[i]._remove();
   }
  for (var i = 0; i < this.parentNode.childNodes.length; i++) {
    if (this == this.parentNode.childNodes[i]) {
      for (var j = i; j < this.parentNode.childNodes.length; j++) {
        this.parentNode.childNodes[j] = this.parentNode.childNodes[j+1];
      }
      this.parentNode.childNodes.length -= 1;
      if (i + 1 == this.parentNode.childNodes.length) { this.parentNode._last = true; }
      break;
  }  }
  FMTreeHandler.all[this.id] = null;
  var tmp = document.getElementById(this.id);
  if (tmp) { tmp.parentNode.removeChild(tmp); }
  tmp = document.getElementById(this.id + '-cont');
  if (tmp) { tmp.parentNode.removeChild(tmp); }
}

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
  var str = "<div id=\"" + this.id + "\" class=\"FM-tree-item\" onmouseover=\"" + this.id + "_button.className=''\" onmouseout=\"" + this.id + "_button.className='invisible'\">" +
    indent +
    "<img id=\"" + this.id + "-plus\" src=\"" + ((this.folder)?((this.open)?((this.parentNode._last)?FMTreeConfig.lMinusIcon:FMTreeConfig.tMinusIcon):((this.parentNode._last)?FMTreeConfig.lPlusIcon:FMTreeConfig.tPlusIcon)):((this.parentNode._last)?FMTreeConfig.lIcon:FMTreeConfig.tIcon)) + "\" onclick=\"FMTreeHandler.toggle(this);\">"
     + "<img id=\"" + this.id + "-optVPIcon\" class=\"myOptVP\" src=\"";
  if (this.optionality == "Optional") {
    if (this.VP == "OR") {
      str += FMTreeConfig.optOORIcon;
    }
    else if (this.VP == "XOR") {
      str += FMTreeConfig.optXORIcon;
    }
    else {
      str += FMTreeConfig.optNonVPIcon;
    }
  }
  else if (this.optionality == "Mandatory") {
    if (this.VP == "OR") {
      str += FMTreeConfig.manOORIcon;
    }
    else if (this.VP == "XOR") {
      str += FMTreeConfig.manXORIcon;
    }
    else {
      str += FMTreeConfig.manNonVPIcon;
    }
  }  
  str += "\" />" +
    "<a href=\"" + this.action + "\" id=\"" + this.id + "-anchor\" onclick=\"FMTreeHandler.click(this);\"" +
    (this.target ? " target=\"" + this.target + "\"" : "") +
    ">" + label + "</a>" +  
    "<img src=\"" + (FMTreeConfig.blankIcon) + "\">" + 
    "<span class=\"invisible\" id=\"" + this.id + "_button\">" +
    "<i class=\"icon-plus\" id=\"" + this.id + "-ads\" onclick=\"FMTreeHandler.addSibling(this);\"></i>&nbsp;" +
    "<i class=\"icon-glass\" id=\"" + this.id + "-adc\" onclick=\"FMTreeHandler.addChild(this);\"></i>&nbsp;" +
    "<i class=\"icon-remove\" id=\"" + this.id + "-rem\" onclick=\"FMTreeHandler.delete(this);\"></i>" +
    "</span>" +
    "<img src=\"" + (FMTreeConfig.blankIcon) + "\">" + 
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

exports.FMTreeHandler = FMTreeHandler;
exports.FMTree = FMTree;
exports.FMTreeItem = FMTreeItem;

 
  

