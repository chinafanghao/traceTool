var AddNewConstraintHandler = {
  leftIdPrefix   : "item_left_",
  rightIdPrefix  : "item_right_",
  leftIdCounter  : 0,
  rightIdCounter : 0,
  leftAll        : {},
  rightAll       : {},
  getLeftId      : function() { return this.leftIdCounter++; },
  getRightId     : function() { return this.rightIdCounter++; } ,
  addLeftItem    : function() {
    var str = '';
    var temp_id = "addNewConstraint_left_" + this.getLeftId();
    this.leftAll[temp_id] = temp_id;
    str += "<tr id=\"" + temp_id + "\" onmouseover=\"" + temp_id + "_button.className=\'\'\" onmouseout=\"" + temp_id + "_button.className=\'invisible\'\">" +
      "<td><select id=\"" + temp_id + "_isNot\" class=\"addNewConstraintIsNot\">" +
      "<option value=\"false\"> </option>" +
      "<option value=\"true\"> ~ </option>" +
      "</select> </td>"; 
    str += "<td> <select id=\"" + temp_id + "_item\" class=\"addNewConstraintSelect\">";
    str += this.getAllFeatureTextToSelection();
    str += "</select></td>";
    str += "<td class=\"addNewConstraintRemove\"><span id=\""+temp_id+"_button\" align=\"center\" class=\"invisible\">" + 
      "<i class=\"icon-remove\" id=\"" + temp_id + "-rem\" onclick=\"AddNewConstraintHandler.removeLeft(this);\"></i>" +
      "</span></td>";
    str += "</tr>";
    this.sortASC(temp_id + "_item");
    this.insertHTMLBeforeEnd(document.getElementById("addNewConstraint_left"),str); 
  },
  addRightItem    : function() {
    var str = '';
    var temp_id = "addNewConstraint_right_" + this.getRightId();
    this.rightAll[temp_id] = temp_id;
    str += "<tr id=\"" + temp_id + "\"onmouseover=\"" + temp_id + "_button.className=\'\'\" onmouseout=\"" + temp_id + "_button.className=\'invisible\'\">" +
      "<td><select id=\"" + temp_id + "_isNot\" class=\"addNewConstraintIsNot\">" +
      "<option value=\"false\"> </option>" +
      "<option value=\"true\"> ~ </option>" +
      "</select> </td>"; 
    str += "<td> <select id=\"" + temp_id + "_item\" class=\"addNewConstraintSelect\">";
    str += this.getAllFeatureTextToSelection();
    str += "</select></td>";
    str += "<td class=\"addNewConstraintRemove\"><span id=\""+temp_id+"_button\" align=\"center\" class=\"invisible\">" + 
      "<i class=\"icon-remove\" id=\"" + temp_id + "-rem\" onclick=\"AddNewConstraintHandler.removeRight(this);\"></i>" +
      "</span></td>";
    str += "</tr>";
    this.sortASC(temp_id + "_item");
    this.insertHTMLBeforeEnd(document.getElementById("addNewConstraint_right"),str); 
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
  getAllFeatureTextToSelection: function() {
    var temp = '';
    for (feature_id in FMTreeHandler.all) {
      if(FMTreeHandler.all[feature_id]){
        temp += "<option value=\"" + feature_id + "\">" + FMTreeHandler.all[feature_id].text + "</option>";
      }
    }
    return temp;
  },
  inIt : function() { 
    for (item_id in this.leftAll) {
      this.leftAll[item_id] = undefined;
    }
    for (item_id in this.rightAll) {
      this.rightAll[item_id] = undefined;
    }
    this.leftIdCounter =  0;
    this.rightIdCounter = 0;
    var temp_left_id = "addNewConstraint_left_" + this.getLeftId();
    var temp_right_id = "addNewConstraint_right_" + this.getRightId();
    this.leftAll[temp_left_id] = temp_left_id;
    this.rightAll[temp_right_id] = temp_right_id;
    var str="<tr>"+
        "<td><table id=\"addNewConstraint_left\" class=\"addNewConstraintItemTable\">" +
        "<tr id=\"" + temp_left_id + "\"><td><select id=\"" + temp_left_id + "_isNot\" class=\"addNewConstraintIsNot\">" +
        "<option value=\"false\"> </option>" +
        "<option value=\"true\"> ~ </option>" +
        "</select> </td>" +
        "<td> <select id=\"" + temp_left_id + "_item\" class=\"addNewConstraintSelect\">" +
        this.getAllFeatureTextToSelection() +
        "</select></td>" +
        "<td class=\"addNewConstraintRemove\"></td></tr>" +
        "</table></td>"+
        "<td>"+
          "<select id=\"addNewConstraint_relation\"class=\"addNewConstraintRelation\">"+
            "<option value=\"empty\">  </option>"+
            "<option value=\"Aexclude\"> A-x- </option>"+
            "<option value=\"AexcludeA\"> A-x-A </option>"+
            "<option value=\"AexcludeV\"> A-x-V </option>"+
            "<option value=\"Arequire\"> A--> </option>"+
            "<option value=\"ArequireA\"> A-->A </option>"+
            "<option value=\"ArequireV\"> A-->V </option>"+
            "<option value=\"exclude\"> -x- </option>"+
            "<option value=\"excludeA\"> -x-A </option>"+
            "<option value=\"excludeV\"> -x-V </option>"+
            "<option value=\"require\"> --> </option>"+
            "<option value=\"requireA\"> -->A </option>"+
            "<option value=\"requireV\"> -->V </option>"+
            "<option value=\"Vexclude\"> V-x- </option>"+
            "<option value=\"VexcludeA\"> V-x-A </option>"+
            "<option value=\"VexcludeV\"> V-x-V </option>"+
            "<option value=\"Vrequire\"> V--> </option>"+
            "<option value=\"VrequireA\"> V-->A </option>"+
            "<option value=\"VrequireV\"> V-->V </option>"+
          "</select>"+
        "</td>"+
        "<td><table id=\"addNewConstraint_right\" class=\"addNewConstraintItemTable\">" +
        "<tr id=\"" + temp_right_id + "\"><td><select id=\"" + temp_right_id + "_isNot\" class=\"addNewConstraintIsNot\">" +
        "<option value=\"false\"> </option>" +
        "<option value=\"true\"> ~ </option>" +
        "</select> </td>" +
        "<td> <select id=\"" + temp_right_id + "_item\" class=\"addNewConstraintSelect\">" +
        this.getAllFeatureTextToSelection() +
        "</select></td>" +
        "<td class=\"addNewConstraintRemove\"></td></tr>" +
        "</table></td>"+
      "</tr>"+
      "<tr>"+
        "<td align=\"center\">"+
          "<i class=\"icon-plus\" id=\"addNewConstraint_left_plus\" onclick=\"AddNewConstraintHandler.addLeftItem();\"></i>"+
        "</td>"+
        "<td></td>"+
        "<td align=\"center\">"+
          "<i class=\"icon-plus\" id=\"addNewConstraint_right_plus\" onclick=\"AddNewConstraintHandler.addRightItem();\"></i>"+
        "</td>"+
      "</tr>";
    document.getElementById("addNewConstraint_body").innerHTML=str;
    this.sortASC(temp_left_id + "_item");
    this.sortASC(temp_right_id + "_item");

    //this.addLeftItem(); 
    //this.addRightItem();
  },
  insertHTMLBeforeEnd : function(oElement, sHTML) {
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
  },
  add : function() {
    var lefts = [];
    for (item in this.leftAll) {
      var left = {
        isNot : true,
        item_id  : FMTreeHandler.all[document.getElementById(this.leftAll[item]+"_item").value].id.substring(15),
        //item_text: FMTreeHandler.all[document.getElementById(this.leftAll[item]+"_item").value].text,
      }
      if (document.getElementById(this.leftAll[item]+"_isNot").value == "false")
        left.isNot = false;
      lefts.push(left);
    }
    var rights = [];
    for (item in this.rightAll) {
      var right = {
        isNot : true,
        item_id  : FMTreeHandler.all[document.getElementById(this.rightAll[item]+"_item").value].id.substring(15),
        //item_text: FMTreeHandler.all[document.getElementById(this.rightAll[item]+"_item").value].text,
      }
      if (document.getElementById(this.rightAll[item]+"_isNot").value == "false")
        right.isNot = false;
      rights.push(right);
    }
    $.ajax({
      type: "POST",
      url: "/addNewConstraint",
      data: {
        left        : lefts,
        relation    : document.getElementById("addNewConstraint_relation").value,
        right       : rights,
        projectID   : document.getElementById("hidden_project_id").value,
      },
      dataType:'json',
      success: function(data) {
        var dLefts = [];
        lefts.forEach(function(left, index) {
            var dLeft = new Constraint_item(left.item_id, left.isNot, FMTreeHandler.all[FMTreeHandler.idPrefix + left.item_id].text);
            dLefts.push(dLeft);
        });
        var dRights = [];
        rights.forEach(function(right, index) {
          var dRight = new Constraint_item(right.item_id, right.isNot, FMTreeHandler.all[FMTreeHandler.idPrefix + right.item_id].text);
          dRights.push(dRight);
        });
        var constraint = new Constraint(dLefts, document.getElementById("addNewConstraint_relation").value, dRights, data._id);
        if (ConstraintHandler.appear == 'all') {ConstraintHandler.showAll();}
        else {ConstraintHandler.showCurrent();}
      },
      error: function(data) {
        window.alert("FAILED!!!");
      },
    }); 
  },
  removeLeft : function(oItem) {
    var tmp = document.getElementById(oItem.id.replace('-rem',''));
    if (tmp) { tmp.parentNode.removeChild(tmp); }
    delete this.leftAll[oItem.id.replace('-rem','')];
  },
  removeRight : function(oItem) {
    var tmp = document.getElementById(oItem.id.replace('-rem',''));
    if (tmp) { tmp.parentNode.removeChild(tmp); }
    delete this.rightAll[oItem.id.replace('-rem','')];
  },
}