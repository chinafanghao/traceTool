function loadConstraints() {
  $.ajax({
    type:"POST",
    url: "/loadConstraints",
    success: function(data) {
  		data.constraints.forEach(function(constraint, index) {
  			var lefts = [];
        var rights = [];
        constraint.left.forEach(function(doc, index) {
          var isNot = true;
          if (doc.isNot == "false") {isNot = false;}
          var left = new Constraint_item(doc.item_id, isNot, doc.item_text);
          lefts.push(left);
        });
        constraint.right.forEach(function(doc, index) {
          var isNot = true;
          if (doc.isNot == "false") {isNot = false;}
          var right = new Constraint_item(doc.item_id, isNot, doc.item_text);
          rights.push(right);
        });
        var _cons = new Constraint(lefts, constraint.relation, rights, constraint._id);
        _cons.add();
  		});
  	},
  });
}

loadConstraints();
